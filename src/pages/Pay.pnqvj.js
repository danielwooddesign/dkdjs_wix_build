/**
 * Pay page (/pay) — paste this into the page's Velo file.
 *
 * ── Setup in the editor ───────────────────────────────────────────────────
 *   1. Add a page with the slug  pay
 *   2. HIDE IT FROM SEARCH ENGINES (SEO panel → indexing off). It is a
 *      one-to-one link, not a public page.
 *   3. Add the custom element:
 *        Velo file   dkdjs-page.js
 *        Tag name    dkdjs-page
 *        ID          dkdjsPage          ← the ID is not optional. Twice now a
 *                                         missing ID has silently broken a page.
 *   4. Publish, then test with a real hold id.
 *
 * The link Daniel sends:   https://www.dkdjs.com/pay?hold=<holdId>
 * Hold ids are in the Holds collection, _id column.
 */

import wixLocation from 'wix-location';
import wixPayFrontend from 'wix-pay-frontend';
import { SITE } from 'public/content';
import {
  getHoldSummary,
  createRetainerPayment,
  recordRetainerPayment
} from 'backend/payments.web';

const TERMS_URL = 'https://www.dkdjs.com/terms';

$w.onReady(async () => {
  const el = $w('#dkdjsPage');

  el.setAttribute('page', 'pay');
  el.setAttribute('config', JSON.stringify({
    phone: SITE.phone,
    email: SITE.email,
    images: {}
  }));

  el.on('navigate', (event) => {
    const url = event.detail && event.detail.url;
    if (url) wixLocation.to(url);
  });

  const holdId = (wixLocation.query && wixLocation.query.hold) || '';

  if (!holdId) {
    el.setAttribute('payment', JSON.stringify({ ok: false, reason: 'missing-hold' }));
    return;
  }

  // 1. Show what is being paid for, before asking for a card.
  let summary;
  try {
    summary = await getHoldSummary(holdId);
  } catch (err) {
    console.error('[pay] getHoldSummary failed', err);
    summary = { ok: false, reason: 'error' };
  }
  el.setAttribute('payment', JSON.stringify(summary));

  if (!summary.ok) return;

  // 2. The element emits this when the visitor presses the pay button.
  el.on('payretainer', async () => {
    el.setAttribute('payment', JSON.stringify({ ...summary, busy: true }));

    try {
      const created = await createRetainerPayment(holdId);

      if (!created.ok) {
        el.setAttribute('payment', JSON.stringify({ ok: false, reason: created.reason }));
        return;
      }

      // Wix takes over here: its own modal collects the card.
      const result = await wixPayFrontend.startPayment(created.paymentId, {
        termsAndConditionsLink: TERMS_URL,
        showThankYouPage: false
      });

      // Report the outcome. The server re-checks everything — it does not
      // take the browser's word for the amount or for which hold was paid.
      const settled = await recordRetainerPayment(holdId, {
        status: result.status,
        transactionId: result.transactionId,
        paymentId: created.paymentId
      });

      el.setAttribute('payment', JSON.stringify({
        ...summary,
        done: settled.ok,
        status: result.status,
        reason: settled.ok ? null : settled.reason
      }));
    } catch (err) {
      console.error('[pay] payment failed', err);
      el.setAttribute('payment', JSON.stringify({ ...summary, reason: 'error' }));
    }
  });
});
