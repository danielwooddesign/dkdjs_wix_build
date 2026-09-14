/**
 * Home page — feeds <dkdjs-home>, brokers its events, and handles SEO.
 *
 * The element owns the markup and styling but holds no copy. Everything
 * visible comes from public/content.js, and the crawlable `seoMarkup` is
 * generated from those same strings — so the page a visitor reads and the page
 * Google reads cannot diverge. Wix's docs call a mismatch cloaking.
 *
 * The element on the page needs ID #dkdjsHome and tag name dkdjs-home.
 */

import wixLocation from 'wix-location';
import wixSeoFrontend from 'wix-seo-frontend';
import { checkDate } from 'backend/availability.web';
import { getPackage, visibleIncludes, formatMoney } from 'public/pricing';
import { HOME, CITIES, TRUST, homeSeoMarkup, localBusinessSchema, servicesSchema } from 'public/content';

/**
 * Images and phone. Upload to the Wix Media Manager, copy the URL, paste here.
 * Anything left empty renders as a labelled box at the right aspect ratio —
 * the page is never broken and never fakes a photo it doesn't have.
 */
const CONFIG = {
  phone: '',          // e.g. '(208) 555-0134' — also fill SITE.phone in content.js
  images: {
    heroDesktop: '',  // 2400x1350
    danielKathy: '',  // 1200x1500
    weddings: '',     // 1200x900
    events: '',       // 1200x900
    karaoke: '',      // 1200x900
    'line-dancing': '', // 1200x900
    booth: '',        // 2400x1350
    gallery1: '', gallery2: '', gallery3: '',
    gallery4: '', gallery5: '', gallery6: ''   // 1600x1200 each
  }
};

const WEDDING_TIERS = ['reception', 'full-day', 'whole-night'];

$w.onReady(() => {
  const el = $w('#dkdjsHome');

  // Content and behaviour first. SEO is wrapped separately below, because a
  // failure there must never take the page down with it — that is exactly
  // what happened when this file used a named import for wix-seo-frontend:
  // the throw aborted onReady and the buttons never got wired.
  el.setAttribute('content', JSON.stringify(Object.assign({}, HOME, { cities: CITIES, trust: TRUST })));
  el.setAttribute('config', JSON.stringify(CONFIG));
  el.setAttribute('pricing', JSON.stringify(buildPricing()));

  el.on('checkdate', async (event) => {
    const date = event.detail && event.detail.date;
    try {
      const result = await checkDate(date);
      el.setAttribute('availability', JSON.stringify(result));
    } catch (err) {
      console.error('[home] checkDate failed', err);
      el.setAttribute('availability', JSON.stringify({ status: 'error', dateKey: date, alternatives: [] }));
    }
  });

  el.on('navigate', (event) => {
    const url = event.detail && event.detail.url;
    if (url) wixLocation.to(url);
  });

  applySeo(el);
});

/** Nice-to-have, never load-bearing. Everything here is allowed to fail quietly. */
function applySeo(el) {
  try {
    // Crawlers that don't run JavaScript see this instead of an empty element.
    el.seoMarkup = homeSeoMarkup();
  } catch (err) {
    console.error('[home] seoMarkup failed', err);
  }

  try {
    // Structured data must be set inside onReady for search engines to read it.
    wixSeoFrontend.setStructuredData([localBusinessSchema()].concat(servicesSchema()));
  } catch (err) {
    console.error('[home] setStructuredData failed', err);
  }
}

/** Tiers derived from public/pricing so no figure is ever typed twice. */
function buildPricing() {
  const packages = WEDDING_TIERS.map(getPackage).filter(Boolean).map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    hours: pkg.hours,
    featured: Boolean(pkg.featured),
    badge: pkg.badge || '',
    includes: visibleIncludes(pkg)
  }));

  const extras = ['private-party', 'karaoke-night', 'corporate']
    .map(getPackage)
    .filter(Boolean)
    .map((pkg) => `${pkg.name} from ${formatMoney(pkg.price)}`);

  return { packages, otherLine: extras.join(' · ') + ' · See all packages and add-ons' };
}
