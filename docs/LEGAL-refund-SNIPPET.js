/**
 * Cancellation & Refund Policy (/refund-policy) — SNIPPET.
 *
 * Create the page in the editor with slug `refund-policy`, then paste this into the
 * file Wix generates. See docs/CONTACT-PAGE-SETUP.md for the full procedure —
 * the order matters (start wix dev, create page, let it sync, stop wix dev).
 *
 * Canvas setup:
 *   Velo file   dkdjs-page.js
 *   Tag name    dkdjs-page
 *   ID          dkdjsPage
 */

import wixLocation from 'wix-location';
import { SITE } from 'public/content';
import { LEGAL } from 'public/legal';

$w.onReady(() => {
  const el = $w('#dkdjsPage');

  el.setAttribute('page', 'legal');
  el.setAttribute('config', JSON.stringify({ phone: SITE.phone, email: SITE.email, images: {} }));
  el.setAttribute('content', JSON.stringify({ legal: LEGAL.refund }));

  el.on('navigate', (event) => {
    const url = event.detail && event.detail.url;
    if (url) wixLocation.to(url);
  });
});
