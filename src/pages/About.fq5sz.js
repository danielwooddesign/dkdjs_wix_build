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
import wixSeoFrontend from 'wix-seo-frontend';
import { SITE, CITIES, ABOUT, aboutSeoMarkup, localBusinessSchema } from 'public/content';

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

  // Set here as well as in the editor's Set Attributes panel. If the panel
  // entry is missing the element would otherwise render the wrong page.
  el.setAttribute('page', 'about');
  el.setAttribute('config', JSON.stringify(CONFIG));
  el.setAttribute('content', JSON.stringify({ about: ABOUT }));
  el.on('navigate', (event) => {
    const url = event.detail && event.detail.url;
    if (url) wixLocation.to(url);
  });

  applySeo(el);
});

/**
 * The story only exists inside the shadow root, so a crawler that does not
 * render JavaScript sees nothing. Same strings, so it is a mirror and not a
 * second version of the page. Never load-bearing: a failure here must not take
 * the page down.
 */
function applySeo(el) {
  try {
    el.seoMarkup = aboutSeoMarkup();
  } catch (err) {
    console.error('[about] seoMarkup failed', err);
  }
  try {
    wixSeoFrontend.setStructuredData([localBusinessSchema()]);
  } catch (err) {
    console.error('[about] setStructuredData failed', err);
  }
}
