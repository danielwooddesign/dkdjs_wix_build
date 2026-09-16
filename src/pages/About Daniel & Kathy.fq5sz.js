/**
 * About (/about) — feeds <dkdjs-page page="about">.
 *
 * Canvas setup:
 *   Velo file   dkdjs-page.js
 *   Tag name    dkdjs-page
 *   ID          dkdjsPage
 *   Attribute   page = about
 */

import wixLocation from 'wix-location';
import { SITE } from 'public/content';

/** Same portrait as the home page. Keep the two in step. */
const CONFIG = {
  phone: SITE.phone,
  email: SITE.email,
  images: {
    danielKathy: 'https://static.wixstatic.com/media/fb34fd_d5a611bb78cc4b9282cf84b6287fdfdb~mv2.jpg'
  }
};

$w.onReady(() => {
  const el = $w('#dkdjsPage');
  el.setAttribute('config', JSON.stringify(CONFIG));
  el.on('navigate', (event) => {
    const url = event.detail && event.detail.url;
    if (url) wixLocation.to(url);
  });
});
