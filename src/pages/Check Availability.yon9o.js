/**
 * Check Availability (/check-availability) — feeds <dkdjs-page page="availability">.
 *
 * Canvas setup:
 *   Velo file   dkdjs-page.js
 *   Tag name    dkdjs-page
 *   ID          dkdjsPage
 *   Attribute   page = availability
 *
 * The element validates and collects; it never touches the database. It emits
 * events, this file calls the backend, and the answer goes back as an
 * attribute. The Bookings/Holds collections stay Admin-only and a visitor only
 * ever learns "open" or "taken".
 */

import wixLocation from 'wix-location';
import { checkDate, requestHold } from 'backend/availability.web';
import { SITE, CITIES } from 'public/content';
import { getPackage, visibleIncludes } from 'public/pricing';

const WEDDING_TIERS = ['reception', 'full-day', 'whole-night'];

$w.onReady(() => {
  const el = $w('#dkdjsPage');

  el.setAttribute('config', JSON.stringify({
    phone: SITE.phone,
    email: SITE.email,
    cities: CITIES,
    images: {}
  }));

  // The package dropdown is built from the same source as every price on the
  // site, so a tier renamed in pricing.js renames itself here too.
  el.setAttribute('pricing', JSON.stringify({
    tiers: WEDDING_TIERS.map(getPackage).filter(Boolean).map((pkg) => ({
      id: pkg.id, name: pkg.name, price: pkg.price, hours: pkg.hours,
      includes: visibleIncludes(pkg)
    }))
  }));

  el.on('checkdate', async (event) => {
    const date = event.detail && event.detail.date;
    try {
      const result = await checkDate(date);
      el.setAttribute('availability', JSON.stringify(result));
    } catch (err) {
      console.error('[availability] checkDate failed', err);
      el.setAttribute('availability', JSON.stringify({ status: 'error', dateKey: date, alternatives: [] }));
    }
  });

  el.on('requesthold', async (event) => {
    const details = (event.detail && event.detail.details) || {};
    try {
      const result = await requestHold(details);
      el.setAttribute('submission', JSON.stringify(result));
    } catch (err) {
      // A thrown error here almost always means the CMS collections do not
      // exist yet. The visitor sees a "call us" message rather than a blank.
      console.error('[availability] requestHold failed', err);
      el.setAttribute('submission', JSON.stringify({ ok: false, reason: 'error' }));
    }
  });

  el.on('navigate', (event) => {
    const url = event.detail && event.detail.url;
    if (url) wixLocation.to(url);
  });
});
