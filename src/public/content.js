/**
 * DKDJS site content — single source of truth for page copy.
 *
 * Why this file exists: the pages render inside custom elements, which are
 * client-side. Crawlers that don't run JavaScript need the same content
 * supplied separately as `seoMarkup`. Wix's own documentation warns that if
 * the two differ, that's cloaking.
 *
 * So the copy lives here exactly once. Page code passes it to the element for
 * display AND generates the SEO markup from it. They cannot drift, because
 * they're the same strings.
 *
 * Change a headline here and it changes on screen and for Google together.
 */

/**
 * Business facts. Anything blank is unknown and must NOT be invented —
 * schema.org markup with made-up contact details is worse than none.
 */
import { getPackage, visibleIncludes, formatMoney } from 'public/pricing';

export const SITE = {
  name: 'DKDJS — Daniel & Kathy DJs',
  legalName: '',          // TBD: 'New Ad City' DBA? confirm before publishing
  url: 'https://dkdjs.com',
  phone: '(208) 972-1308',
  email: 'contact@dkdjs.com',
  city: '',               // TBD — the city DKDJS is based in
  region: 'ID',
  country: 'US',
  priceRange: '$$',
  sameAs: []              // Facebook, Instagram, The Knot… once they exist
};

export const CITIES = ['Boise', 'Eagle', 'Meridian', 'Nampa', 'Caldwell', 'Kuna', 'Star', 'Garden City'];

export const TRUST = ['Two DJs, every event', 'Professional sound', 'Backup equipment', 'Treasure Valley local'];

export const HOME = {
  seoTitle: 'Treasure Valley DJ Services | Daniel & Kathy DJs',
  seoDescription:
    'Professional DJ entertainment for weddings, birthdays, private parties, karaoke and special events ' +
    'throughout Boise, Eagle, Meridian and the Treasure Valley.',

  hero: {
    eyebrow: 'Treasure Valley DJ & MC',
    h1: 'Nobody remembers the centerpieces.',
    sub:
      'They remember the dance floor. Daniel & Kathy are a husband-and-wife DJ team bringing great ' +
      'music, professional sound, lighting and interactive entertainment to weddings, parties and ' +
      'special events throughout Boise and the Treasure Valley.',
    primaryCta: 'Check your date',
    secondaryCta: 'View packages',
    checkerLabel: 'Is your date still open?',
    checkerButton: 'Check it',
    checkerHint: 'Instant answer — no waiting on an email.'
  },

  about: {
    eyebrow: 'More than music',
    h2: 'You get the two of us. Every time.',
    body:
      'We’re Daniel and Kathy, a husband-and-wife DJ team serving Boise and the Treasure Valley. ' +
      'From planning through the last song, we’re the team you work with and the team at your event. ' +
      'While one of us focuses on music, sound and announcements, the other can help with requests, ' +
      'guests, karaoke and the flow of the event.',
    stats: [
      { value: '2', label: 'DJs always' },
      { value: '100%', label: 'Backup gear on site' },
      { value: '8', label: 'Cities served' }
    ]
  },

  services: {
    eyebrow: 'What we do',
    h2: 'Four kinds of night.',
    items: [
      {
        id: 'weddings', title: 'Weddings', url: '/weddings', img: 'weddings',
        copy: 'Ceremony audio, cocktail hour, introductions, reception music, MC support and guest requests.',
        icon: '<path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.7c0 4.9-7 9.3-7 9.3z"/>'
      },
      {
        id: 'events', title: 'Parties & Events', url: '/events', img: 'events',
        copy: 'Birthdays, anniversaries, graduations, company parties and private celebrations.',
        icon: '<path d="M4 20l5-12 8 8-13 4z"/><path d="M15 4l1 2M20 9l-2 1M19 3l-2 2"/>'
      },
      {
        id: 'karaoke', title: 'Karaoke', url: '/karaoke', img: 'karaoke',
        copy: 'Hosted karaoke with wireless microphones, on-screen lyrics and interactive entertainment.',
        icon: '<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/>'
      },
      {
        id: 'line-dancing', title: 'Line Dancing', url: '/events', img: 'line-dancing',
        copy: 'Beginner-friendly line dancing and crowd favorites, wherever the room is up for it.',
        icon: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'
      }
    ]
  },

  included: {
    eyebrow: 'What comes with us',
    h2: 'What rolls in the door.',
    items: [
      { title: 'Room-filling sound', copy: 'Clear sound designed for even coverage — loud on the dance floor, civil at grandma’s table.', icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/>' },
      { title: 'LED video DJ booth', copy: 'A curved LED video booth that displays visuals and custom content through your event.', icon: '<path d="M12 3v7M8 6l4-3 4 3"/><rect x="4" y="12" width="16" height="9" rx="2"/><path d="M9 16h6"/>' },
      { title: 'Dance floor lighting', copy: 'Lighting that changes with the energy of the event — and stays down during dinner.', icon: '<path d="M12 2v6M5 8l3 4M19 8l-3 4"/><rect x="6" y="12" width="12" height="4" rx="1"/><path d="M9 16l-2 6M15 16l2 6"/>' },
      { title: 'Wireless microphones', copy: 'For vows, toasts, announcements and karaoke.', icon: '<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>' },
      { title: 'Ceremony audio', copy: 'An optional second system where you say the vows, so the back row hears them too.', icon: '<path d="M3 12a9 9 0 0 1 18 0"/><rect x="3" y="12" width="4" height="7" rx="2"/><rect x="17" y="12" width="4" height="7" rx="2"/>' },
      { title: 'Backup equipment', copy: 'Spare microphones, cables and critical audio gear travel to every single event.', icon: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>' }
    ]
  },

  pricing: {
    eyebrow: 'Straight pricing',
    h2: 'Here’s what it costs.',
    intro:
      'No “contact us for a quote.” Every package includes both of us, all the gear, setup and ' +
      'teardown, backup equipment and a planning call.'
  },

  booth: {
    eyebrow: 'DKDJS visual experience',
    h2: 'Make the booth part of the show.',
    body:
      'Our curved LED video DJ booth can display custom animations, names, photos, logos, event colors, ' +
      'themed visuals and promotions throughout your event — from personalized wedding graphics and ' +
      'birthday messages to corporate branding and venue promotions.',
    uses: [
      { label: 'Weddings', copy: 'Names, monograms, photos and event visuals in your colors.' },
      { label: 'Birthdays', copy: 'Birthday messages, themed graphics and custom transitions.' },
      { label: 'Restaurants', copy: 'Drink specials, happy hour, food promotions and what’s on next.' },
      { label: 'Corporate', copy: 'Logos, sponsor graphics, awards, schedules and branded visuals.' }
    ]
  },

  gallery: { eyebrow: 'Real nights', h2: 'See us work.', cta: 'See the full gallery' },

  cta: {
    h2: 'Let’s see if your date is open.',
    body: 'Tell us the date and roughly what you’re planning. We answer every inquiry within 24 hours.',
    button: 'Check your date'
  }
};

/* ------------------------------------------------------------------ *
 * SEO
 * ------------------------------------------------------------------ */

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

/**
 * The home page's content as plain crawlable HTML, built from the same strings
 * the custom element renders. Assigned to the element's `seoMarkup` so
 * non-JavaScript crawlers see the real page, and so it matches what a visitor
 * sees — which is what keeps it on the right side of the cloaking rule.
 */
export function homeSeoMarkup() {
  const c = HOME;
  const parts = [];

  // The element renders <h1>{hero.h1}</h1> and <p>{hero.sub}</p>. This must
  // match it exactly. An earlier version appended a second sentence here that
  // the visible heading did not carry — that is the cloaking mismatch this
  // whole file exists to prevent.
  parts.push(`<h1>${escapeHtml(c.hero.h1)}</h1>`);
  parts.push(`<p>${escapeHtml(c.hero.sub)}</p>`);
  parts.push(`<p>Serving ${escapeHtml(CITIES.join(', '))}.</p>`);

  parts.push(`<h2>${escapeHtml(c.about.h2)}</h2><p>${escapeHtml(c.about.body)}</p>`);

  parts.push(`<h2>${escapeHtml(c.services.h2)}</h2>`);
  c.services.items.forEach((s) => {
    parts.push(`<h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.copy)}</p>`);
  });

  parts.push(`<h2>${escapeHtml(c.included.h2)}</h2><ul>`);
  c.included.items.forEach((f) => {
    parts.push(`<li><strong>${escapeHtml(f.title)}</strong> — ${escapeHtml(f.copy)}</li>`);
  });
  parts.push('</ul>');

  parts.push(`<h2>${escapeHtml(c.pricing.h2)}</h2><p>${escapeHtml(c.pricing.intro)}</p>`);

  // Prices belong in the crawlable copy — "wedding dj boise pricing" is a real
  // query and the element renders these figures anyway. Straight from
  // public/pricing so the markup can never quote a stale number.
  parts.push('<ul>');
  ['reception', 'full-day', 'whole-night'].forEach((id) => {
    const pkg = getPackage(id);
    if (!pkg) return;
    const inc = visibleIncludes(pkg).join(', ');
    parts.push(
      `<li><strong>${escapeHtml(pkg.name)}</strong> — ${escapeHtml(formatMoney(pkg.price))}` +
      ` for ${pkg.hours} hours. ${escapeHtml(inc)}.</li>`
    );
  });
  parts.push('</ul>');

  parts.push(`<h2>${escapeHtml(c.booth.h2)}</h2><p>${escapeHtml(c.booth.body)}</p><ul>`);
  c.booth.uses.forEach((u) => {
    parts.push(`<li><strong>${escapeHtml(u.label)}</strong> — ${escapeHtml(u.copy)}</li>`);
  });
  parts.push('</ul>');

  parts.push(`<h2>${escapeHtml(c.cta.h2)}</h2><p>${escapeHtml(c.cta.body)}</p>`);

  return parts.join('');
}

/**
 * LocalBusiness structured data. Only emits fields we actually know —
 * schema.org markup with invented contact details is worse than none at all.
 */
export function localBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': SITE.url + '/#business',
    name: SITE.name,
    description: HOME.seoDescription,
    url: SITE.url,
    priceRange: SITE.priceRange,
    areaServed: CITIES.map((city) => ({
      '@type': 'City', name: city, containedInPlace: { '@type': 'State', name: 'Idaho' }
    }))
  };

  if (SITE.phone) data.telephone = SITE.phone;
  if (SITE.email) data.email = SITE.email;
  if (SITE.sameAs.length) data.sameAs = SITE.sameAs;
  if (SITE.city) {
    data.address = {
      '@type': 'PostalAddress',
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country
    };
  }

  return data;
}

/** One Service entry per thing DKDJS sells, for rich results. */
export function servicesSchema() {
  return HOME.services.items.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.copy,
    provider: { '@id': SITE.url + '/#business' },
    areaServed: CITIES.map((city) => ({ '@type': 'City', name: city })),
    url: SITE.url + s.url
  }));
}
