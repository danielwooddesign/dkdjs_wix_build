/**
 * Parties & Events (/events) — feeds <dkdjs-page page="events">.
 *
 * Canvas setup:
 *   Velo file   dkdjs-page.js
 *   Tag name    dkdjs-page
 *   ID          dkdjsPage
 *
 * Copy comes from SERVICES.events in public/content.js. The same strings build
 * the crawlable seoMarkup below, so the page a visitor reads and the page
 * Google reads cannot drift apart.
 */

import wixLocation from 'wix-location';
import wixSeoFrontend from 'wix-seo-frontend';
import { SITE, CITIES, SERVICES, serviceSeoMarkup, faqSchema, localBusinessSchema } from 'public/content';
import { packagesFor, getPackage, visibleIncludes, sellableAddons, formatMoney } from 'public/pricing';

const KEY = 'events';

/** Optional hero image for this page. Paste a Wix Media URL to use one. */
const IMAGES = { hero: '' };

$w.onReady(() => {
  const el = $w('#dkdjsPage');
  const service = SERVICES[KEY];

  el.setAttribute('page', KEY);
  el.setAttribute('config', JSON.stringify({
    phone: SITE.phone, email: SITE.email, cities: CITIES, images: IMAGES
  }));
  el.setAttribute('content', JSON.stringify({ service }));
  el.setAttribute('pricing', JSON.stringify(buildPricing(service)));

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
    console.error('[events] seoMarkup failed', err);
  }
  try {
    const schema = [localBusinessSchema()];
    const faq = faqSchema(KEY);
    if (faq) schema.push(faq);
    wixSeoFrontend.setStructuredData(schema);
  } catch (err) {
    console.error('[events] setStructuredData failed', err);
  }
}

/**
 * The tiers this service shows, in the order SERVICES declares them.
 * Deliberately not price-sorted: on the wedding page that led with the $395
 * ceremony-audio option, which is not a wedding package and read as the
 * headline price.
 */
function buildPricing(service) {
  const ids = (service.packages || []).length
    ? service.packages
    : packagesFor((service.eventTypes || [])[0]).filter((p) => !p.custom).map((p) => p.id);

  const tiers = ids.map(getPackage).filter(Boolean).map((pkg) => ({
    id: pkg.id, name: pkg.name, price: pkg.price, hours: pkg.hours,
    featured: Boolean(pkg.featured), badge: pkg.badge || '',
    includes: visibleIncludes(pkg)
  }));

  // Options that belong on the page but not in the tier grid.
  const also = (service.alsoPackages || []).map(getPackage).filter(Boolean).map((pkg) => ({
    name: pkg.name, price: formatMoney(pkg.price), hours: pkg.hours
  }));

  return { tiers, also, addons: sellableAddons().map((a) => ({ name: a.name })) };
}
