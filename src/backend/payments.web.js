/**
 * DKDJS retainer payments — backend web module.
 *
 * Flow:
 *   1. Daniel sends the customer a link:  /pay?hold=<holdId>
 *   2. The page calls getHoldSummary()    → shows date and amount only
 *   3. The page calls createRetainerPayment() → returns a Wix payment id
 *   4. Page code calls wixPayFrontend.startPayment(paymentId)
 *   5. The page reports the outcome to recordRetainerPayment()
 *
 * SECURITY NOTE, read before changing anything here.
 * Velo's Pay API has no server-side webhook — the only signal that a payment
 * succeeded comes back through the browser, and a browser can lie. So this
 * module never treats the client's word as proof of money received:
 *   - the AMOUNT is set server-side from POLICY, never sent up from the page;
 *   - the hold is re-validated server-side before and after payment;
 *   - a reported success is recorded with its transaction id and flagged for
 *     Daniel to match against the Wix Payments dashboard.
 * The worst a forged callback achieves is a date marked booked without money,
 * which Daniel will see in the notification and can cancel.
 */

import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';
import { createPayment } from 'wix-pay-backend';
import { POLICY } from 'public/pricing';
import { formatDateKey } from 'public/dates';
import { confirmHold, loadPayableHold } from 'backend/booking';

const HOLDS = 'Holds';
const LEADS = 'Leads';
const OPTS = { suppressAuth: true };

const CURRENCY = 'USD';

/** The retainer, in dollars. Server-side only — never accepted from the page. */
function retainerAmount() {
  const amount = Number(POLICY.holdAmount);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

/**
 * What the pay page is allowed to know.
 *
 * Deliberately thin. The hold id is an unguessable GUID, but it still travels
 * in a URL that could be forwarded, so this returns the event date, the amount
 * and a first name — never the phone number, the venue, the notes or the
 * full lead row.
 */
export const getHoldSummary = webMethod(Permissions.Anyone, async (holdId) => {
  const amount = retainerAmount();
  if (!amount) return { ok: false, reason: 'no-policy' };

  const check = await loadPayableHold(holdId);

  if (!check.ok) {
    return {
      ok: false,
      reason: check.reason,
      eventDate: check.hold ? formatDateKey(check.hold.eventDate) : null
    };
  }

  let firstName = '';
  if (check.hold.leadId) {
    const lead = await wixData.get(LEADS, check.hold.leadId, OPTS).catch(() => null);
    if (lead && lead.name) firstName = String(lead.name).trim().split(/\s+/)[0];
  }

  return {
    ok: true,
    firstName,
    eventDate: formatDateKey(check.hold.eventDate),
    dateKey: check.hold.eventDate,
    amount,
    term: POLICY.holdTerm || 'retainer',
    refundable: Boolean(POLICY.holdRefundable),
    balanceDueDays: POLICY.balanceDueDays || null,
    disclosure: POLICY.processingDisclosure || ''
  };
});

/**
 * Create the Wix payment. Amount comes from POLICY, not from the browser.
 */
export const createRetainerPayment = webMethod(Permissions.Anyone, async (holdId) => {
  const amount = retainerAmount();
  if (!amount) return { ok: false, reason: 'no-policy' };

  const check = await loadPayableHold(holdId);
  if (!check.ok) return { ok: false, reason: check.reason };

  const hold = check.hold;
  const pretty = formatDateKey(hold.eventDate) || hold.eventDate;

  let userInfo;
  if (hold.leadId) {
    const lead = await wixData.get(LEADS, hold.leadId, OPTS).catch(() => null);
    if (lead) {
      const parts = String(lead.name || '').trim().split(/\s+/);
      userInfo = {
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: lead.email || hold.email || '',
        phone: lead.phone || ''
      };
    }
  }

  try {
    const payment = await createPayment({
      amount,
      currency: CURRENCY,
      items: [{
        name: `Date ${POLICY.holdTerm || 'retainer'} — ${pretty}`,
        price: amount,
        quantity: 1
      }],
      userInfo
    });

    // Remember which payment belongs to which hold, so a success callback
    // cannot point at a different, cheaper payment.
    await wixData.update(HOLDS, {
      ...hold,
      paymentId: payment.id,
      paymentAmount: amount
    }, OPTS);

    return { ok: true, paymentId: payment.id, amount };
  } catch (err) {
    console.error('[payments.createRetainerPayment]', holdId, err);
    return { ok: false, reason: 'error' };
  }
});

/**
 * Record what the browser reported, then decide whether to confirm.
 *
 * `status` comes from wixPayFrontend.startPayment(). Anything other than
 * Successful or Offline is written down but changes nothing.
 */
export const recordRetainerPayment = webMethod(Permissions.Anyone, async (holdId, result = {}) => {
  const check = await loadPayableHold(holdId);
  if (!check.ok) return { ok: false, reason: check.reason };

  const hold = check.hold;
  const status = String(result.status || '').trim();
  const transactionId = String(result.transactionId || '').trim();
  const paymentId = String(result.paymentId || '').trim();

  // The payment id must be the one this server created for this hold.
  if (!paymentId || paymentId !== hold.paymentId) {
    console.error('[payments.recordRetainerPayment] payment id mismatch', holdId, paymentId);
    return { ok: false, reason: 'payment-mismatch' };
  }

  await wixData.update(HOLDS, {
    ...hold,
    lastPaymentStatus: status,
    transactionId: transactionId || hold.transactionId || '',
    // Daniel matches this against the Wix Payments dashboard before the
    // booking is treated as money-in-the-bank.
    paymentVerified: false
  }, OPTS).catch((err) => console.error('[payments] hold update failed', err));

  if (status !== 'Successful' && status !== 'Offline') {
    return { ok: false, reason: 'not-paid', status };
  }

  const confirmed = await confirmHold(holdId, {
    transactionId,
    amount: Number(hold.paymentAmount) || retainerAmount(),
    method: status === 'Offline' ? 'offline' : 'card'
  });

  if (!confirmed.ok) return { ok: false, reason: confirmed.reason };

  return {
    ok: true,
    status,
    bookingId: confirmed.bookingId,
    alreadyConfirmed: Boolean(confirmed.alreadyConfirmed)
  };
});
