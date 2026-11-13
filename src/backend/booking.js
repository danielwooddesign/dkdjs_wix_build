/**
 * DKDJS booking — shared backend logic (NOT a web module).
 *
 * Lives outside availability.web.js so that both the owner-only
 * confirmBooking() web method and the payment flow can call the same code.
 * Nothing here is callable from the browser.
 */

import wixData from 'wix-data';

const BOOKINGS = 'Bookings';
const HOLDS = 'Holds';
const LEADS = 'Leads';

const OPTS = { suppressAuth: true };

/**
 * Turn a hold into a confirmed booking.
 *
 * Idempotent on purpose: a visitor can double-click, a payment callback can
 * fire twice, and Daniel may also confirm by hand. Calling this repeatedly
 * for the same hold must never create a second booking for one date.
 *
 * @param {string} holdId
 * @param {{transactionId?: string, amount?: number, method?: string}} [payment]
 * @returns {Promise<{ok: boolean, bookingId?: string, reason?: string, alreadyConfirmed?: boolean}>}
 */
export async function confirmHold(holdId, payment = {}) {
  if (!holdId) return { ok: false, reason: 'missing-hold' };

  try {
    const hold = await wixData.get(HOLDS, holdId, OPTS);
    if (!hold) return { ok: false, reason: 'not-found' };

    // Already converted — find the existing booking rather than making another.
    if (hold.status === 'converted') {
      const existing = await wixData
        .query(BOOKINGS)
        .eq('eventDate', hold.eventDate)
        .ne('status', 'cancelled')
        .limit(1)
        .find(OPTS);

      return {
        ok: true,
        alreadyConfirmed: true,
        bookingId: existing.items.length ? existing.items[0]._id : undefined
      };
    }

    const booking = await wixData.insert(BOOKINGS, {
      title: `Booking · ${hold.eventDate}`,
      eventDate: hold.eventDate,
      leadId: hold.leadId,
      status: 'confirmed',
      retainerPaid: Number(payment.amount) || null,
      transactionId: payment.transactionId || '',
      paymentMethod: payment.method || ''
    }, OPTS);

    await wixData.update(HOLDS, {
      ...hold,
      status: 'converted',
      paid: true,
      transactionId: payment.transactionId || hold.transactionId || ''
    }, OPTS);

    if (hold.leadId) {
      const lead = await wixData.get(LEADS, hold.leadId, OPTS);
      if (lead) await wixData.update(LEADS, { ...lead, status: 'booked' }, OPTS);
    }

    return { ok: true, bookingId: booking._id };
  } catch (err) {
    console.error('[booking.confirmHold]', holdId, err);
    return { ok: false, reason: 'error' };
  }
}

/**
 * Is this hold still payable?
 *
 * Checked before creating a payment AND again before confirming, because a
 * visitor can leave the pay page open for an hour while the date is taken.
 *
 * @returns {Promise<{ok: boolean, hold?: object, reason?: string}>}
 */
export async function loadPayableHold(holdId) {
  if (!holdId) return { ok: false, reason: 'missing-hold' };

  const hold = await wixData.get(HOLDS, holdId, OPTS).catch(() => null);
  if (!hold) return { ok: false, reason: 'not-found' };

  if (hold.status === 'converted') return { ok: false, reason: 'already-booked', hold };
  if (hold.status === 'cancelled') return { ok: false, reason: 'cancelled', hold };
  if (hold.expiresAt && new Date(hold.expiresAt) < new Date()) {
    return { ok: false, reason: 'expired', hold };
  }

  // Someone else may have booked this date since the hold was made.
  const taken = await wixData
    .query(BOOKINGS)
    .eq('eventDate', hold.eventDate)
    .ne('status', 'cancelled')
    .count(OPTS);

  if (taken > 0) return { ok: false, reason: 'date-taken', hold };

  return { ok: true, hold };
}
