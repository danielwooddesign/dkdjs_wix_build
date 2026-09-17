/**
 * Contact (/contact) — feeds <dkdjs-page page="contact">.
 *
 * Canvas setup:
 *   Velo file   dkdjs-page.js
 *   Tag name    dkdjs-page
 *   ID          dkdjsPage
 *
 * Phone, email and the service-area city list all come from SITE and CITIES in
 * public/content.js, so they are never typed twice. The map is a service-area
 * view with no pin — a deliberate choice, since DKDJS runs from home.
 */

import wixLocation from 'wix-location';
import { SITE, CITIES } from 'public/content';

$w.onReady(() => {
  const el = $w('#dkdjsPage');

  // Set here as well as in the editor's Set Attributes panel. If the panel
  // entry is missing the element would otherwise render the wrong page.
  el.setAttribute('page', 'contact');

  el.setAttribute('config', JSON.stringify({
    phone: SITE.phone,
    email: SITE.email,
    cities: CITIES,
    images: {}
  }));

  el.on('navigate', (event) => {
    const url = event.detail && event.detail.url;
    if (url) wixLocation.to(url);
  });
});
