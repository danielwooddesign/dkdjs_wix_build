/**
 * Contact — SNIPPET, not a drop-in file.
 *
 * There is no Contact page in the repo yet. Create it in the Studio editor
 * first (URL slug /contact); Wix will generate a file named
 * Contact.{id}.js. Paste this into that file.
 *
 * Canvas setup:
 *   Velo file   dkdjs-page.js
 *   Tag name    dkdjs-page
 *   ID          dkdjsPage
 *   Attribute   page = contact
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
