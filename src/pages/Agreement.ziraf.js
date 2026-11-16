/**
 * Agreement page (/agreement) — paste this into the page's Velo file.
 *
 * ── Setup in the editor ───────────────────────────────────────────────────
 *   1. Add a page with the slug  agreement
 *   2. HIDE IT FROM SEARCH ENGINES (SEO panel → "Let search engines index
 *      this page" OFF). It is a one-to-one link containing a customer's name,
 *      venue and price. It must never appear in Google.
 *   3. Add the custom element:
 *        Velo file   dkdjs-page.js
 *        Tag name    dkdjs-page
 *        ID          dkdjsPage        ← NOT optional. A missing ID has
 *                                       silently broken a page twice on this
 *                                       build; the element falls back to
 *                                       baked defaults and shows the wrong
 *                                       thing with no error anywhere.
 *   4. Publish, then test with a real hold id.
 *
 * The link Daniel sends:  https://www.dkdjs.com/agreement?hold=<holdId>
 *
 * ── Before the link will work ─────────────────────────────────────────────
 * The agreement refuses to render without a price, because the number is the
 * one thing the customer is actually agreeing to. So the Holds row needs
 * `packageId` filled in (and `addonIds` / times if they apply) before the
 * link is sent. Until then the page says "we are still putting your figures
 * together" rather than showing a contract with a blank total.
 */

import wixLocation from 'wix-location';
import { SITE } from 'public/content';
import { getAgreement } from 'backend/agreements.web';

/* The signature is POSTed to an HTTP function, not a web module, because only
   an HTTP function can see the caller's IP address — and an IP our own server
   observed is evidence, while one the page passes up is just a string the
   browser chose. See backend/agreements.js for the full note. */
const SIGN_URL = '/_functions/sign';

$w.onReady(async () => {
  const el = $w('#dkdjsPage');

  el.setAttribute('page', 'agreement');
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
    el.setAttribute('agreement', JSON.stringify({ ok: false, reason: 'missing-hold' }));
    return;
  }

  const payUrl = `/pay?hold=${encodeURIComponent(holdId)}`;

  // 1. Load the agreement.
  let state;
  try {
    state = await getAgreement(holdId);
  } catch (err) {
    console.error('[agreement] getAgreement failed', err);
    state = { ok: false, reason: 'error' };
  }
  el.setAttribute('agreement', JSON.stringify(state));

  if (!state.ok) return;

  // 2. "Pay the retainer" on the signed view.
  el.on('payaftersigning', () => wixLocation.to(payUrl));

  // 3. The signature.
  el.on('signagreement', async (event) => {
    const detail = event.detail || {};

    el.setAttribute('agreement', JSON.stringify({ ...state, busy: true, error: null }));

    try {
      const response = await fetch(SIGN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdId,
          fullName: detail.fullName,
          consent: detail.consent === true
        })
      });

      const result = await response.json().catch(() => ({ ok: false, reason: 'error' }));

      if (!result.ok) {
        el.setAttribute('agreement', JSON.stringify({
          ...state, busy: false, error: result.reason || 'error'
        }));
        return;
      }

      /* Re-read from the server rather than assembling the signed view from
         what we sent. The signed record is the server's, and this way the
         page shows exactly what was stored. */
      const fresh = await getAgreement(holdId).catch(() => null);

      el.setAttribute('agreement', JSON.stringify(fresh && fresh.ok ? fresh : {
        ...state,
        busy: false,
        signed: { signerName: detail.fullName, signedAt: result.signedAt }
      }));

      /* Straight on to the retainer — the Terms say a booking is a signed
         agreement AND the retainer, so stopping at "signed" leaves the date
         still available and the customer thinking it is not. */
      wixLocation.to(payUrl);
    } catch (err) {
      console.error('[agreement] sign failed', err);
      el.setAttribute('agreement', JSON.stringify({ ...state, busy: false, error: 'error' }));
    }
  });
});
