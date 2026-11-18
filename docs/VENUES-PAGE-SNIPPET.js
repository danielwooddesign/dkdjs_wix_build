/**
 * Venue residencies (/venues) — feeds <dkdjs-page page="residency">.
 *
 * ── Setup in the editor ───────────────────────────────────────────────────
 *   1. New page, slug  venues
 *   2. Leave it OUT of the menu. This page is written for bar and restaurant
 *      owners, and a B2B page in the nav competes for the attention of every
 *      couple browsing packages. You send the link; you do not advertise it.
 *   3. Add the custom element:
 *        Velo file   dkdjs-page.js
 *        Tag name    dkdjs-page
 *        ID          dkdjsPage
 *   4. Paste this file into the page code.
 *
 * Indexing is a judgement call rather than a rule here. Unlike /pay and
 * /agreement — which carry a customer's name, venue and price and must stay
 * out of search — this page is ordinary marketing copy. Leaving indexing on
 * costs nothing and may catch the occasional "karaoke host for my bar"
 * search. Leaving it off keeps the public site strictly about weddings and
 * parties. Either is defensible.
 *
 * Copy lives in SERVICES.residency in public/content.js.
 */

import wixLocation from 'wix-location';
import wixSeoFrontend from 'wix-seo-frontend';
import { SITE, CITIES, SERVICES, serviceSeoMarkup, faqSchema, localBusinessSchema } from 'public/content';

const KEY = 'residency';

/** Optional hero image. A photo of a real night works harder than a stock bar. */
const IMAGES = {};

$w.onReady(() => {
  const el = $w('#dkdjsPage');

  el.setAttribute('page', KEY);
  el.setAttribute('config', JSON.stringify({
    phone: SITE.phone, email: SITE.email, cities: CITIES, images: IMAGES
  }));
  el.setAttribute('content', JSON.stringify({ service: SERVICES[KEY] }));

  /* Pricing is explicitly EMPTIED, not just left unset.
     The element seeds this._pricing with DEFAULT_PRICING in its constructor,
     so a page that never sets the attribute keeps showing the baked wedding
     tiers — which on this page meant a bar owner looking at three wedding
     packages under "What it costs", each with a "Check my date" button.
     Clearing it makes the renderer skip the whole section, which is what a
     page that quotes per venue should do. */
  el.setAttribute('pricing', JSON.stringify({ tiers: [], also: [], addons: [] }));

  el.on('navigate', (event) => {
    const url = event.detail && event.detail.url;
    if (url) wixLocation.to(url);
  });

  applySeo(el);
});

/** Never load-bearing: a failure here must not take the page down. */
function applySeo(el) {
  try {
    el.seoMarkup = serviceSeoMarkup(KEY);
  } catch (err) {
    console.error('[venues] seoMarkup failed', err);
  }
  try {
    const schema = [localBusinessSchema()];
    const faq = faqSchema(KEY);
    if (faq) schema.push(faq);
    wixSeoFrontend.setStructuredData(schema);
  } catch (err) {
    console.error('[venues] setStructuredData failed', err);
  }
}
