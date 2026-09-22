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
import { getPackage, visibleIncludes, formatMoney, packagesFor, sellableAddons, priceLabel } from 'public/pricing';

export const SITE = {
  name: 'DKDJS — Daniel & Kathy DJs',
  legalName: 'New Ad City LLC',   // trading as DKDJS
  url: 'https://dkdjs.com',
  phone: '(208) 972-1308',
  email: 'contact@dkdjs.com',
  street: '715 N Synergy Way',
  city: 'Eagle',
  region: 'ID',
  postalCode: '83616',
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
    if (SITE.street) data.address.streetAddress = SITE.street;
    if (SITE.postalCode) data.address.postalCode = SITE.postalCode;
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

/* ------------------------------------------------------------------ *
 * SERVICE PAGES — /weddings, /events, /karaoke
 *
 * One shape, three sets of copy. The element renders from this and the page
 * code builds seoMarkup from the same strings, so what a visitor reads and
 * what a crawler reads cannot diverge.
 *
 * Nothing here states a policy, a guarantee or a capability that is not
 * already true in pricing.js or equipment.js.
 * ------------------------------------------------------------------ */
export const SERVICES = {
  weddings: {
    slug: 'weddings',
    eventTypes: ['wedding'],
    /** Shown as tiers, in this order. Explicit so price sorting cannot
     *  lead the page with the cheapest, thinnest option. */
    packages: ['reception', 'full-day', 'whole-night'],
    alsoPackages: ['ceremony-only'],
    eyebrow: 'Wedding DJ & MC',
    h1: 'The day runs on timing. That is our job.',
    lead: 'Ceremony audio, cocktail hour, introductions, dinner, the first dance and a '
        + 'packed floor at the end of the night — run by two people who planned it with you.',
    intro: [
      'A wedding is not a playlist. It is a sequence of moments that have to land in the '
        + 'right order, and most of them depend on someone saying the right thing at the '
        + 'right time into a microphone that works.',
      'That is why there are two of us at every wedding. One runs music, sound and '
        + 'announcements. The other is free to find the maid of honour who has wandered off '
        + 'with the toast, cue your photographer before the first dance, and keep the '
        + 'timeline moving without anyone noticing it is being moved.'
    ],
    stepsEyebrow: 'How a wedding runs',
    stepsH2: 'What the day looks like.',
    steps: [
      { title: 'Ceremony',
        copy: 'An optional second system where you say the vows, so the back row hears them. '
            + 'Officiant microphone, processional and recessional music.' },
      { title: 'Cocktail hour',
        copy: 'Background music at a level people can talk over while we change the room over '
            + 'and sound-check for the reception.' },
      { title: 'Introductions & dinner',
        copy: 'Wedding party entrances, welcome, blessing, toasts. Handheld microphone for '
            + 'anyone speaking, and someone standing next to them who knows how it works.' },
      { title: 'First dance & formals',
        copy: 'First dance, parent dances, cake, bouquet — cued with your photographer so '
            + 'nobody misses the shot.' },
      { title: 'Open dancing',
        copy: 'We read the room. Your must-play list gets played, your do-not-play list '
            + 'does not, and requests get filtered through both.' },
      { title: 'Send-off',
        copy: 'Last song, last call, and a clean teardown that does not start while your '
            + 'guests are still dancing.' }
    ],
    faqEyebrow: 'Straight answers',
    faqH2: 'Questions we get asked.',
    faq: [
      { q: 'Do we really get both of you?',
        a: 'Yes, on every package. It is not an upgrade and it is not conditional.' },
      { q: 'Do you MC, or just play music?',
        a: 'We MC. Introductions, announcements and keeping the timeline moving are included '
         + 'in every wedding package.' },
      { q: 'What if your equipment fails?',
        a: 'Spare microphones, cables and critical audio gear travel to every event. We have '
         + 'never wanted to find out the hard way, so we do not.' },
      { q: 'Can we give you a do-not-play list?',
        a: 'Please do. The music questionnaire that comes with your package has space for '
         + 'both lists, and we hold to them.' },
      { q: 'How far do you travel?',
        a: 'We cover Boise, Eagle, Meridian, Nampa, Caldwell, Kuna, Star and Garden City. '
         + 'Further out, ask — we travel for the right event.' }
    ],
    ctaH2: 'Start with the date.',
    ctaBody: 'We only take one wedding a day. Tell us yours and we will say straight away '
           + 'whether it is free.'
  },

  events: {
    slug: 'events',
    eventTypes: ['birthday', 'anniversary', 'graduation', 'corporate', 'holiday', 'private', 'other'],
    packages: ['private-party', 'corporate'],
    alsoPackages: [],
    eyebrow: 'Parties & events',
    h1: 'Any room. Any crowd. Any decade.',
    lead: 'Birthdays, anniversaries, graduations, company parties and private celebrations '
        + 'across Boise and the Treasure Valley.',
    intro: [
      'Not every event needs a wedding-sized production. Most need good sound, lighting '
        + 'that changes the mood of a room, and somebody competent running it so the host '
        + 'gets to be a guest at their own party.',
      'We bring a system sized to your room rather than the biggest one we own, set it up '
        + 'before anyone arrives, and take it down after they have gone.'
    ],
    stepsEyebrow: 'What we cover',
    stepsH2: 'The kinds of nights we run.',
    steps: [
      { title: 'Milestone birthdays',
        copy: 'Thirtieth through eightieth. The trick is a playlist that spans the room, '
            + 'not just the guest of honour.' },
      { title: 'Anniversaries',
        copy: 'The songs that mean something, played properly, plus a floor that fills '
            + 'once the speeches are done.' },
      { title: 'Graduations',
        copy: 'Loud, current, and still appropriate for the family members in the room.' },
      { title: 'Company & holiday parties',
        copy: 'Background music through dinner, announcements and awards if you need them, '
            + 'dancing after.' },
      { title: 'Private celebrations',
        copy: 'Retirements, reunions, engagement parties, housewarmings — anything with a '
            + 'room and a reason.' },
      { title: 'Add karaoke',
        copy: 'Any event can become a karaoke night for part of the evening. It is the '
            + 'fastest way to get a shy room involved.' }
    ],
    faqEyebrow: 'Straight answers',
    faqH2: 'Questions we get asked.',
    faq: [
      { q: 'How small is too small?',
        a: 'It is not about headcount. If you want music and a microphone handled properly, '
         + 'the room is big enough.' },
      { q: 'Can you do outdoors?',
        a: 'Yes, with access to power and a plan for weather. Tell us the venue and we will '
         + 'tell you what it needs.' },
      { q: 'Do you take requests on the night?',
        a: 'Yes. With two of us, one can handle requests without the music stopping.' },
      { q: 'Can you keep it background-level?',
        a: 'Absolutely. Volume that lets people talk is a skill, and it is a request we get '
         + 'more often than the opposite.' }
    ],
    ctaH2: 'Tell us about your night.',
    ctaBody: 'Send us the date and roughly what you are planning. We will come back with a '
           + 'straight answer and a straight price.'
  },

  karaoke: {
    slug: 'karaoke',
    eventTypes: ['karaoke'],
    packages: ['karaoke-night'],
    alsoPackages: [],
    eyebrow: 'Hosted karaoke',
    h1: 'Somebody has to go first. We make that easy.',
    lead: 'Hosted karaoke with wireless microphones, on-screen lyrics and someone running '
        + 'the room so the queue keeps moving.',
    intro: [
      'Karaoke goes wrong in predictable ways. The queue stalls, the same four people sing '
        + 'everything, the microphone squeals, and the person who actually wanted to sing '
        + 'never gets up.',
      'Hosted karaoke fixes all four. We run the rotation, we know when to push someone up '
        + 'and when to leave them alone, and the sound is set up properly so nobody has to '
        + 'shout over it.'
    ],
    stepsEyebrow: 'How it works',
    stepsH2: 'What you get.',
    steps: [
      { title: 'Wireless microphones',
        copy: 'Handheld and wireless, so singers are not tethered to a stand in the corner.' },
      { title: 'On-screen lyrics',
        copy: 'Lyrics on screen where the singer and the room can both see them.' },
      { title: 'A host, not a jukebox',
        copy: 'One of us runs the rotation and works the room. The other stays on sound.' },
      { title: 'A real catalogue',
        copy: 'Broad enough that nobody spends ten minutes scrolling and then gives up.' },
      { title: 'Music between singers',
        copy: 'The room never goes silent between songs, which is where karaoke nights die.' },
      { title: 'Part of a bigger night',
        copy: 'Add a karaoke hour to a wedding or a party rather than booking a whole night.' }
    ],
    faqEyebrow: 'Straight answers',
    faqH2: 'Questions we get asked.',
    faq: [
      { q: 'What if nobody wants to sing?',
        a: 'That is the job. Reading who wants to be asked and who wants to be left alone is '
         + 'most of what hosting is.' },
      { q: 'Can we do karaoke at our wedding?',
        a: 'Yes — as a karaoke hour. It works best late, after the formal dancing.' },
      { q: 'Do you run karaoke at restaurants and bars?',
        a: 'Yes. Recurring venue nights are priced separately — ask us about a residency.' },
      { q: 'Can people queue songs from their phones?',
        a: 'Ask us — how requests are handled depends on the venue and the night.' }
    ],
    ctaH2: 'Pick a night.',
    ctaBody: 'Tell us the date and the room and we will tell you what it needs.'
  }
};


/**
 * About page copy. Lives here so the page a visitor reads and the markup a
 * crawler reads are built from the same strings. The baked default inside
 * dkdjs-page.js is GENERATED from this — run tools/build-defaults.mjs.
 */
export const ABOUT = {
    eyebrow: 'More than music',
    h1: 'We met because we could dance.',
    intro: [
      'We are Daniel and Kathy Wood, a husband-and-wife DJ team serving Boise and the '
        + 'Treasure Valley. DKDJS started with something that has been part of our lives for '
        + 'more than two decades: music, dancing and bringing people together.',
      'Long before DKDJS was a business, music and dancing were already a big part of who we were.',
      'After more than 22 years of marriage, they still are.'
    ],
    story: [
      {
        h2: 'Brooklyn, Springfield, and a dance floor in Colorado.',
        paras: [
          'Daniel was born in Brooklyn, New York. Growing up in a military family meant '
            + 'moving, traveling and experiencing different places and cultures from an early age, '
            + 'including time in Germany and a good deal of the United States.',
          'Kathy was born in Springfield, Oregon. She lived in Oregon until she was '
            + 'seven, when her family moved to the Los Angeles area of California, where she grew up.',
          'Our paths eventually crossed in Colorado, and appropriately enough, we met on the dance floor.'
        ]
      },
      {
        h2: 'Twenty-two years of West Coast Swing.',
        paras: [
          'We met at Stampede in Aurora, Colorado, a country-western dance club. A mutual friend '
            + 'introduced us because we both knew how to West Coast Swing. That introduction turned '
            + 'into a partnership that has now lasted more than 22 years.',
          'Daniel went on to compete in the UCWDC Pro-Am division as a West Coast Swing dancer. Kathy '
            + 'took West Coast Swing lessons as well and became an accomplished social dancer in her '
            + 'own right.',
          'We never really stopped. West Coast Swing is still something we enjoy together, including '
            + 'at The Farm in Garden City, and line dancing is part of Kathy\u2019s regular weekly routine.'
        ]
      },
      {
        h2: 'From the dance floor to the sound system.',
        paras: [
          'Our path toward becoming DJs happened naturally. Through line dancing we became friends '
            + 'with the people behind the Friday night line dancing at the Nampa Eagles in Nampa, '
            + 'Idaho.',
          'We started by simply wanting to help. Daniel began assisting with the sound and saw '
            + 'opportunities to make Friday nights better. We contributed speakers, an upgraded sound '
            + 'system and lighting, to give the dancers a more energetic room to work with.',
          'It worked. Friday nights became something we looked forward to, and helping build a room '
            + 'where people could dance, socialize and have a great time made us realize how much we '
            + 'enjoyed the entertainment side of an event.'
        ]
      },
      {
        h2: 'The party that started DKDJS.',
        paras: [
          'The real turning point came when we were invited to provide music for a birthday party.',
          'What started as simply playing music quickly became something bigger. We took requests, '
            + 'adjusted the music to the crowd and kept the party moving. Then the karaoke started, '
            + 'and before long the whole room had joined in.',
          'By the end of the night, people were asking whether we had a business card. We did not. '
            + 'But the question kept coming up.',
          'Nothing about that night had been forced or planned. We already understood music and '
            + 'dancing. We already had professional sound and lighting equipment. We enjoyed reading '
            + 'a room and taking requests. And we had fun doing it together. That night is what '
            + 'inspired DKDJS.'
        ]
      },
      {
        h2: 'Why we do it this way.',
        paras: [
          'We did not get into this because we wanted to stand behind a booth and play a '
            + 'predetermined playlist. We got into it because we genuinely enjoy music, dancing, '
            + 'people and the atmosphere you can build out of all three.',
          'Years of West Coast Swing and line dancing give you a particular view of what makes a '
            + 'dance floor work. Different crowds respond to different music, and a good night is not '
            + 'about the DJ showing off. It is about the people in the room having a great time.',
          'That is why requests are welcome, why we watch the crowd rather than the playlist, and why '
            + 'what we do has grown beyond playing music to include MC work, karaoke, line dancing, '
            + 'professional sound, lighting and our LED video DJ booth.'
        ]
      },
      {
        h2: 'You get the two of us. Every time.',
        paras: [
          'DKDJS is a husband-and-wife team. When you talk with us, you are talking with the same '
            + 'two people who will be there for your event. No wondering which DJ will be assigned '
            + 'to you, and no meeting one person and having a stranger turn up on the day.',
          'We work together, we dance together, and now we DJ together. Whether it is a wedding, a '
            + 'birthday, a company event, a private party or a karaoke night, the goal is the same: '
            + 'a fun, welcoming room, music people actually want to hear, and a night they remember.'
        ]
      }
    ],
    signoff: 'Daniel & Kathy Wood \u00b7 Music. Dancing. Karaoke. Entertainment. And a whole lot of fun.',
    valuesEyebrow: 'How we work',
    valuesH2: 'What you can count on.',
    values: [
      { title: 'Two of us, always',
        copy: 'Every booking includes both of us. It is not an upgrade and it is not conditional on the package.' },
      { title: 'One event a day',
        copy: 'We never double-book a date. Your event gets the whole day, including setup and teardown.' },
      { title: 'Backup gear on site',
        copy: 'Spare microphones, cables and critical audio equipment travel to every single event.' },
      { title: 'Straight pricing',
        copy: 'Every package is published on the site. No "contact us for a quote" and no surprise line items.' },
      { title: 'We plan with you',
        copy: 'A planning call and a music questionnaire come with every package, so nothing is improvised.' },
      { title: 'Dancers first',
        copy: 'Two decades of West Coast Swing and line dancing behind the booth. We read the floor, not a script.' }
    ],
    ctaH2: 'Let us know what you are planning.',
    ctaBody: 'Tell us the date and we will tell you straight away whether we are free.',
    cta: 'Check your date'
  };

/** Crawlable markup for /about, from the same strings the element renders. */
export function aboutSeoMarkup() {
  const c = ABOUT;
  const parts = [];

  parts.push(`<h1>${escapeHtml(c.h1)}</h1>`);
  (c.intro || []).forEach((t) => parts.push(`<p>${escapeHtml(t)}</p>`));
  parts.push(`<p>Serving ${escapeHtml(CITIES.join(', '))}.</p>`);

  (c.story || []).forEach((sec) => {
    parts.push(`<h2>${escapeHtml(sec.h2)}</h2>`);
    (sec.paras || []).forEach((p) => parts.push(`<p>${escapeHtml(p)}</p>`));
  });

  parts.push(`<h2>${escapeHtml(c.valuesH2)}</h2><ul>`);
  (c.values || []).forEach((v) => {
    parts.push(`<li><strong>${escapeHtml(v.title)}</strong> \u2014 ${escapeHtml(v.copy)}</li>`);
  });
  parts.push('</ul>');

  parts.push(`<h2>${escapeHtml(c.ctaH2)}</h2><p>${escapeHtml(c.ctaBody)}</p>`);
  return parts.join('');
}

/**
 * The two strings the packages() renderer hard-codes. They live here so the
 * crawlable markup quotes the page rather than paraphrasing it. If you change
 * either one, change it in dkdjs-page.js packages() too \u2014 a mismatch between
 * the visible heading and the markup is exactly the cloaking this file avoids.
 */
export const PACKAGES_PAGE = {
  h1: 'Here\u2019s what it costs.',
  intro: 'Every package includes both of us, all the gear, setup and teardown, backup '
       + 'equipment, and a planning call. No surprise line items on the invoice.',
  boothH2: 'The booth is part of the package.',
  boothBody: 'Names, monograms, photos, event colors, logos, drink specials, themed animations '
           + '\u2014 the curved LED video booth displays custom content through your whole event. '
           + 'It comes with The Full Day and The Whole Night, and can be added to any other package.',
  extrasH2: 'Not a wedding?',
  addonsH2: 'Add anything',
  ctaH2: 'Still deciding? Check the date anyway.'
};

const WEDDING_TIER_IDS = ['reception', 'full-day', 'whole-night'];
const OTHER_PACKAGE_IDS = ['private-party', 'karaoke-night', 'corporate', 'ceremony-only'];

/** Crawlable markup for /packages. Every figure comes from public/pricing. */
export function packagesSeoMarkup() {
  const c = PACKAGES_PAGE;
  const parts = [];

  parts.push(`<h1>${escapeHtml(c.h1)}</h1>`);
  parts.push(`<p>${escapeHtml(c.intro)}</p>`);
  parts.push(`<p>Serving ${escapeHtml(CITIES.join(', '))}.</p>`);

  // No heading here: the rendered page puts the tier grid straight under the
  // h1 with no h2 above it. Adding one to the markup only would be a heading
  // the visitor never sees \u2014 the same mismatch that broke the home page once.
  parts.push('<ul>');
  WEDDING_TIER_IDS.forEach((id) => {
    const pkg = getPackage(id);
    if (!pkg) return;
    parts.push(`<li><strong>${escapeHtml(pkg.name)}</strong> \u2014 `
      + `${escapeHtml(formatMoney(pkg.price))} for ${pkg.hours} hours. `
      + `${escapeHtml(visibleIncludes(pkg).join(', '))}.</li>`);
  });
  parts.push('</ul>');

  parts.push(`<h2>${escapeHtml(c.extrasH2)}</h2><ul>`);
  OTHER_PACKAGE_IDS.forEach((id) => {
    const pkg = getPackage(id);
    if (!pkg) return;
    parts.push(`<li><strong>${escapeHtml(pkg.name)}</strong> \u2014 `
      + escapeHtml(formatMoney(pkg.price))
      + (pkg.hours ? ` for ${pkg.hours} hours` : '') + '.</li>');
  });
  parts.push('</ul>');

  parts.push(`<h2>${escapeHtml(c.addonsH2)}</h2><ul>`);
  sellableAddons().forEach((a) => {
    parts.push(`<li><strong>${escapeHtml(a.name)}</strong> \u2014 ${escapeHtml(priceLabel(a))}.</li>`);
  });
  parts.push('</ul>');

  parts.push(`<h2>${escapeHtml(c.boothH2)}</h2><p>${escapeHtml(c.boothBody)}</p>`);
  parts.push(`<h2>${escapeHtml(c.ctaH2)}</h2>`);
  return parts.join('');
}

/**
 * Offer data for /packages. Modelled as a Service with offers rather than
 * Product \u2014 these are services, and Product markup on a service page is the
 * kind of thing that earns a manual action. Only packages with a real number
 * are listed; anything quoted is left out rather than guessed at.
 */
export function packagesOfferSchema() {
  const offers = WEDDING_TIER_IDS.concat(OTHER_PACKAGE_IDS)
    .map(getPackage)
    .filter((pkg) => pkg && typeof pkg.price === 'number')
    .map((pkg) => ({
      '@type': 'Offer',
      name: pkg.name,
      price: String(pkg.price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: SITE.url + '/packages'
    }));

  if (!offers.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'DJ and MC services',
    serviceType: 'Mobile DJ and MC',
    provider: { '@id': SITE.url + '/#business' },
    areaServed: CITIES.map((city) => ({
      '@type': 'City', name: city, containedInPlace: { '@type': 'State', name: 'Idaho' }
    })),
    offers
  };
}

/** Crawlable markup for a service page, from the same strings the page renders. */
export function serviceSeoMarkup(key) {
  const s = SERVICES[key];
  if (!s) return '';
  const parts = [];
  parts.push(`<h1>${escapeHtml(s.h1)}</h1>`);
  parts.push(`<p>${escapeHtml(s.lead)}</p>`);
  (s.intro || []).forEach((t) => parts.push(`<p>${escapeHtml(t)}</p>`));
  parts.push(`<p>Serving ${escapeHtml(CITIES.join(', '))}.</p>`);

  parts.push(`<h2>${escapeHtml(s.stepsH2)}</h2><ul>`);
  (s.steps || []).forEach((st) => {
    parts.push(`<li><strong>${escapeHtml(st.title)}</strong> — ${escapeHtml(st.copy)}</li>`);
  });
  parts.push('</ul>');

  // Prices belong in the crawlable copy — the page shows them anyway.
  const ids = (s.packages || []).concat(s.alsoPackages || []);
  const pkgs = ids.length
    ? ids.map(getPackage).filter(Boolean)
    : packagesFor(s.eventTypes[0]).filter((p) => !p.custom);
  if (pkgs.length) {
    parts.push('<h2>Pricing</h2><ul>');
    pkgs.forEach((p) => {
      parts.push(`<li><strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(formatMoney(p.price))}`
        + (p.hours ? ` for ${p.hours} hours` : '') + '.</li>');
    });
    parts.push('</ul>');
  }

  parts.push(`<h2>${escapeHtml(s.faqH2)}</h2>`);
  (s.faq || []).forEach((f) => {
    parts.push(`<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`);
  });

  return parts.join('');
}

/** FAQPage structured data — the questions are real and answered on the page. */
export function faqSchema(key) {
  const s = SERVICES[key];
  if (!s || !s.faq || !s.faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: s.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}
