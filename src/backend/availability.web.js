/**
 * DKDJS availability — backend web module.
 *
 * Called from page code:
 *   import { checkDate, requestHold } from 'backend/availability.web';
 *
 * Runs on the server on purpose. The Bookings collection is private: a visitor
 * gets back "open" or "taken" and nothing else. Whose wedding is on a date,
 * how many events are booked, and every other detail stays server-side.
 */

import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';
import { isValidDateKey, isPast, nearbySaturdays, toDateKey, formatDateKey } from 'public/dates';
import { POLICY } from 'public/pricing';
import { confirmHold } from 'backend/booking';

const BOOKINGS = 'Bookings';
const HOLDS = 'Holds';
const LEADS = 'Leads';

/**
 * How long a date stays off the calendar before it frees up again.
 *
 * PROVISIONAL — Daniel has not set hold policy yet (brief §31). This is an
 * operational default so dates don't lock forever; it is NOT a refund window
 * and nothing customer-facing quotes it. Replace once policy is decided.
 */
const HOLD_EXPIRY_DAYS = 7;

/**
 * Events accepted per calendar day. Derived from "You Get the Two of Us.
 * Every Time." — both DJs at every event means no double-booking.
 * NEEDS SIGN-OFF: this is a business rule the brief implies but never states.
 */
const EVENTS_PER_DAY = POLICY.eventsPerDay || 1;

const OPTS = { suppressAuth: true };

/**
 * A complete, human-readable summary of the enquiry, written into the Lead row.
 *
 * Why this exists: Wix Automations can email you when a Lead is added, but
 * getting seventeen separate fields into that email means wiring seventeen
 * dynamic values through the automation UI. Writing one preformatted field
 * here means the email needs a single dynamic value — and the wording stays
 * under our control rather than Wix's.
 */
function buildSummary(details, dateKey) {
  const line = (label, value) => (value || value === 0) ? `${label}: ${value}` : null;
  const rows = [
    line('Event date', formatDateKey(dateKey) || dateKey),
    line('Name', details.name),
    line('Email', details.email),
    line('Phone', details.phone),
    line('Event type', details.eventType),
    line('Venue', details.venue),
    line('City', details.city),
    line('Guests', details.guestCount),
    line('Package', details.packageId),
    line('Notes', details.notes)
  ].filter(Boolean);

  return rows.join('\n');
}

/**
 * Is a date taken? Counts confirmed bookings plus unexpired holds.
 * @returns {Promise<boolean>}
 */
async function isTaken(dateKey) {
  const [booked, held] = await Promise.all([
    wixData
      .query(BOOKINGS)
      .eq('eventDate', dateKey)
      .ne('status', 'cancelled')
      .count(OPTS),
    wixData
      .query(HOLDS)
      .eq('eventDate', dateKey)
      .eq('status', 'active')
      .gt('expiresAt', new Date())
      .count(OPTS)
  ]);

  return booked + held >= EVENTS_PER_DAY;
}

/**
 * Public availability check. Deliberately returns the minimum:
 * a status, a formatted date, and — when taken — nearby open Saturdays.
 *
 * @param {string|Date} date
 * @returns {Promise<{status: 'open'|'taken'|'past'|'invalid', dateKey: string|null, alternatives: string[]}>}
 */
export const checkDate = webMethod(Permissions.Anyone, async (date) => {
  const dateKey = toDateKey(date);

  if (!dateKey || !isValidDateKey(dateKey)) {
    return { status: 'invalid', dateKey: null, alternatives: [] };
  }

  if (isPast(dateKey)) {
    return { status: 'past', dateKey, alternatives: [] };
  }

  try {
    if (!(await isTaken(dateKey))) {
      return { status: 'open', dateKey, alternatives: [] };
    }

    // Taken — offer the closest open Saturdays rather than a dead end.
    const candidates = nearbySaturdays(dateKey, 2);
    const checks = await Promise.all(candidates.map((key) => isTaken(key)));
    const alternatives = candidates.filter((_, i) => !checks[i]).slice(0, 2);

    return { status: 'taken', dateKey, alternatives };
  } catch (err) {
    console.error('[availability.checkDate]', dateKey, err);
    // Never tell a visitor a date is open because the database errored.
    return { status: 'error', dateKey, alternatives: [] };
  }
});

/**
 * Record the enquiry and put a provisional hold on the date.
 *
 * This does NOT take payment and makes no promise about refundability —
 * hold terminology and refund policy are undecided (brief §31). It records
 * the Lead and an unpaid Hold and returns the ids. Wire Wix Pay to it once
 * the plan supports payments AND Daniel has signed off on the terms, then
 * call confirmBooking() from the payment success handler.
 *
 * @param {object} details
 * @returns {Promise<{ok: boolean, holdId?: string, reason?: string}>}
 */
export const requestHold = webMethod(Permissions.Anyone, async (details = {}) => {
  const dateKey = toDateKey(details.eventDate);

  if (!dateKey || !isValidDateKey(dateKey) || isPast(dateKey)) {
    return { ok: false, reason: 'invalid-date' };
  }

  // Minimal contact requirement — everything else is optional.
  const email = String(details.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return { ok: false, reason: 'invalid-email' };
  }

  try {
    // Re-check at write time. The visitor may have sat on the form for an hour.
    if (await isTaken(dateKey)) {
      return { ok: false, reason: 'taken' };
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + HOLD_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const lead = await wixData.insert(LEADS, {
      title: `${details.name || 'Unnamed'} · ${dateKey}`,
      name: details.name || '',
      email,
      phone: details.phone || '',
      eventDate: dateKey,
      eventType: details.eventType || '',
      venue: details.venue || '',
      city: details.city || '',
      guestCount: details.guestCount || null,
      startTime: details.startTime || '',
      endTime: details.endTime || '',
      packageId: details.packageId || '',
      addonIds: Array.isArray(details.addonIds) ? details.addonIds : [],
      estimateTotal: Number(details.estimateTotal) || 0,
      notes: details.notes || '',
      source: details.source || 'website',
      status: 'new',
      // One preformatted field so the notification email needs a single
      // dynamic value instead of one per field.
      summary: buildSummary(details, dateKey)
    }, OPTS);

    const hold = await wixData.insert(HOLDS, {
      title: `Hold · ${dateKey}`,
      eventDate: dateKey,
      leadId: lead._id,
      email,
      status: 'active',
      paid: false,
      expiresAt
    }, OPTS);

    return { ok: true, holdId: hold._id, leadId: lead._id, expiresAt };
  } catch (err) {
    console.error('[availability.requestHold]', dateKey, err);
    return { ok: false, reason: 'error' };
  }
});

/**
 * Owner-only: turn a hold into a confirmed booking by hand.
 *
 * The logic moved to backend/booking.js so this and the payment flow in
 * backend/payments.web.js cannot drift apart — two routes to a booking is
 * exactly how a date ends up double-sold. Use this for a retainer paid by
 * invoice, cash or bank transfer, where no Wix payment exists.
 */
export const confirmBooking = webMethod(Permissions.SiteMember, async (holdId, payment = {}) => {
  return confirmHold(holdId, payment);
});

/**
 * Housekeeping: mark expired holds so their dates free up.
 * Wire this to a scheduled job in src/backend/jobs.config (hourly is plenty).
 */
export const expireStaleHolds = webMethod(Permissions.SiteMember, async () => {
  try {
    const stale = await wixData
      .query(HOLDS)
      .eq('status', 'active')
      .lt('expiresAt', new Date())
      .limit(100)
      .find(OPTS);

    if (!stale.items.length) return { ok: true, expired: 0 };

    await wixData.bulkUpdate(
      HOLDS,
      stale.items.map((item) => ({ ...item, status: 'expired' })),
      OPTS
    );

    return { ok: true, expired: stale.items.length };
  } catch (err) {
    console.error('[availability.expireStaleHolds]', err);
    return { ok: false, reason: 'error' };
  }
});
