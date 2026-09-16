/**
 * Packages page (/packages) — feeds <dkdjs-page page="packages">.
 *
 * The element on the page needs:
 *   Velo file   dkdjs-page.js
 *   Tag name    dkdjs-page
 *   ID          dkdjsPage
 *   Attribute   page = packages   (Set Attributes panel)
 *
 * Like the home page, the element carries its own fallbacks, so a failure
 * here can leave the page thin but never blank.
 */

import wixLocation from 'wix-location';
import { SITE } from 'public/content';
import {
  PACKAGES,
  POLICY,
  policyReady,
  getPackage,
  sellableAddons,
  visibleIncludes,
  formatMoney,
  priceLabel
} from 'public/pricing';

/** Same CONFIG shape as the home page — keep the two in step. */
const CONFIG = {
  phone: SITE.phone,
  images: { booth: '' }   // 2400x1350
};

const WEDDING_TIERS = ['reception', 'full-day', 'whole-night'];
const EXTRA_IDS = ['private-party', 'karaoke-night', 'corporate', 'ceremony-only', 'residency'];

/** Set true while the rates on the page are still for discussion. */
const DRAFT_RATES = true;

$w.onReady(() => {
  const el = $w('#dkdjsPage');
  el.setAttribute('config', JSON.stringify(CONFIG));
  el.setAttribute('pricing', JSON.stringify(build()));
  el.on('navigate', (event) => {
    const url = event.detail && event.detail.url;
    if (url) wixLocation.to(url);
  });
});

/**
 * The cheapest wedding tier that already bundles an add-on.
 * Listing "Ceremony audio $395" with no context, on a page where two packages
 * include it, reads as a trap — naming the tier is honest and upsells for us.
 */
function includedFrom(addonId) {
  const tier = WEDDING_TIERS
    .map(getPackage)
    .filter(Boolean)
    .find((pkg) => (pkg.bundledAddons || []).includes(addonId));
  return tier ? tier.name : '';
}

function build() {
  const tiers = WEDDING_TIERS.map(getPackage).filter(Boolean).map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    hours: pkg.hours,
    featured: Boolean(pkg.featured),
    badge: pkg.badge || '',
    includes: visibleIncludes(pkg)
  }));

  const extras = EXTRA_IDS.map(getPackage).filter(Boolean).map((pkg) => ({
    name: pkg.name,
    detail: pkg.hours ? `${pkg.hours} hours` : '',
    price: priceLabel(pkg),
    custom: Boolean(pkg.custom)
  }));

  const addons = sellableAddons().map((addon) => ({
    name: addon.name + (addon.perUnit ? ' (each)' : ''),
    price: priceLabel(addon),
    note: includedFrom(addon.id) ? `Included in ${includedFrom(addon.id)} and above` : ''
  }));

  // Terms appear only once Daniel has actually decided them. No placeholders.
  const terms = [];
  if (policyReady('holdAmount') && policyReady('holdTerm')) {
    const refund = policyReady('holdRefundDays') ? ` Refundable for ${POLICY.holdRefundDays} days.` : '';
    terms.push({
      title: `${formatMoney(POLICY.holdAmount)} holds any date`,
      copy: `A ${POLICY.holdTerm} takes your date off the calendar.${refund} It comes off your total — it isn't a fee.`
    });
  }
  if (policyReady('balanceDueDays')) {
    terms.push({
      title: `Balance due ${POLICY.balanceDueDays} days out`,
      copy: 'Pay online, or split it across two payments. Your call.'
    });
  }
  terms.push({
    title: 'Setup time is on us',
    copy: 'Load-in, sound check and teardown are never counted in your hours.'
  });

  return { tiers, extras, addons, terms, draft: DRAFT_RATES };
}
