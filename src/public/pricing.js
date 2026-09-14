/**
 * DKDJS pricing & policy — single source of truth.
 *
 * Imported by BOTH front-end page code and backend modules:
 *   import { PACKAGES, ADDONS, POLICY, estimate } from 'public/pricing';
 *
 * Every price the site displays comes from this file. Nothing else hard-codes
 * a dollar figure — that is a requirement from the master brief, §14.
 *
 * Figures below are from the master brief (2026-09-14) unless marked TBD.
 * Anything marked TBD is a business decision Daniel has not made yet: the code
 * must not display it, and must not invent a substitute.
 */

export const CURRENCY = 'USD';

/* ------------------------------------------------------------------ *
 * AVAILABILITY FLAGS
 *
 * Daniel's call (2026-09-14): the LED video booth and the second JBL
 * PartyBox Ultimate are arriving and are advertised now. Both flags on.
 *
 * The switch stays in place as a kill switch — if a piece of gear is out for
 * repair or sold, flip it false and every package inclusion and add-on that
 * depends on it drops out of customer-facing copy automatically.
 * ------------------------------------------------------------------ */
export const AVAILABLE = {
  /** Curved LED video DJ booth. */
  ledBooth: true,
  /** Second JBL PartyBox Ultimate — dual-Ultimate main system. */
  secondUltimate: true,
  /**
   * Cold spark / pyro-adjacent effects. Still OFF — this one is not an
   * equipment-arrival question. Brief §17 gates it on venue restrictions,
   * insurance and operational sign-off, and Daniel has not lifted that.
   */
  dancefloorEffects: false
};

/* ------------------------------------------------------------------ *
 * POLICY — none of this is invented. TBD means TBD.
 * ------------------------------------------------------------------ */
export const POLICY = {
  /** What it costs to take a date off the calendar. TBD — see brief §31. */
  holdAmount: null,
  /** 'deposit' | 'retainer' | 'date hold' — wording has legal weight. TBD. */
  holdTerm: null,
  /** Refund window in days, or null for "not decided". TBD. */
  holdRefundDays: null,
  /** Whether the hold is refundable at all. TBD. */
  holdRefundable: null,
  /** Minutes of travel included before a surcharge applies. TBD. */
  travelIncludedMinutes: null,
  /** Events accepted per calendar day. Derived from "you get the two of us,
   *  every time" — but it is a business rule, not a stated one. NEEDS SIGN-OFF. */
  eventsPerDay: 1,
  /** When the balance is due, in days before the event. TBD. */
  balanceDueDays: null,
  /** Payments are processed by the umbrella company (brief §30). */
  processingEntity: 'New Ad City',
  processingDisclosure:
    'Payments for DKDJS are securely processed through New Ad City, the company behind DKDJS. ' +
    'Your payment receipt or card statement may reference New Ad City.'
};

/** True when a policy value is set and safe to display. */
export function policyReady(key) {
  return POLICY[key] !== null && POLICY[key] !== undefined;
}

/* ------------------------------------------------------------------ *
 * WEDDING PACKAGES — brief §14
 * ------------------------------------------------------------------ */
export const PACKAGES = [
  {
    id: 'reception',
    name: 'The Reception',
    price: 1095,
    hours: 4,
    eventTypes: ['wedding'],
    includes: [
      'Daniel & Kathy',
      'DJ + MC',
      'Professional sound',
      'Dance floor lighting',
      'Wireless microphone',
      'Planning consultation',
      'Music questionnaire',
      'Backup equipment'
    ],
    /** Offered as a paid extra on this tier, not included. */
    optionalAddons: ['led-booth']
  },
  {
    id: 'full-day',
    name: 'The Full Day',
    price: 1595,
    hours: 6,
    featured: true,
    badge: 'MOST BOOKED',
    eventTypes: ['wedding'],
    bundledAddons: ['ceremony-audio', 'led-booth'],
    includes: [
      'Everything in The Reception',
      'Ceremony audio',
      'Officiant microphone',
      'Cocktail-hour music',
      'Two wireless microphones',
      'Timeline coordination',
      { text: 'Curved LED Video DJ Booth', requires: 'ledBooth' },
      { text: 'Basic personalized visuals', requires: 'ledBooth' }
    ]
  },
  {
    id: 'whole-night',
    name: 'The Whole Night',
    price: 2095,
    hours: 8,
    eventTypes: ['wedding'],
    bundledAddons: ['ceremony-audio', 'led-booth', 'uplighting', 'karaoke-hour', 'custom-visuals'],
    includes: [
      'Everything in The Full Day',
      'Enhanced lighting / uplighting',
      'Karaoke hour',
      'Guest song-request portal',
      'Extended coverage',
      'Premium send-off music',
      { text: 'Full Custom LED Visual Experience', requires: 'ledBooth' }
    ]
  },

  /* NON-WEDDING — brief §15 */
  {
    id: 'private-party',
    name: 'Private Party',
    price: 595,
    hours: 3,
    eventTypes: ['birthday', 'anniversary', 'graduation', 'private', 'other']
  },
  {
    id: 'karaoke-night',
    name: 'Karaoke Night',
    price: 450,
    hours: 3,
    eventTypes: ['karaoke']
  },
  {
    id: 'corporate',
    name: 'Corporate / Holiday Event',
    price: 895,
    hours: 4,
    eventTypes: ['corporate', 'holiday']
  },
  {
    id: 'ceremony-only',
    name: 'Ceremony Audio Only',
    price: 395,
    hours: 2,
    eventTypes: ['wedding']
  },
  {
    id: 'residency',
    name: 'Restaurant / Venue Residency',
    price: null,
    custom: true,
    priceLabel: 'Custom recurring pricing',
    eventTypes: ['residency']
  }
];

/* ------------------------------------------------------------------ *
 * ADD-ONS — brief §16 and §17
 * `requires` gates an add-on on an AVAILABLE flag.
 * ------------------------------------------------------------------ */
export const ADDONS = [
  { id: 'extra-hour', name: 'Extra hour', price: 175, perUnit: true },
  { id: 'karaoke-hour', name: 'Karaoke hour', price: 150 },
  { id: 'uplighting', name: 'Enhanced uplighting', price: 295 },
  { id: 'monogram', name: 'Custom monogram projection', price: 195 },
  { id: 'ceremony-audio', name: 'Ceremony audio + officiant microphone', price: 395 },

  /* LED video booth family — all gated until the booth arrives. */
  { id: 'led-booth', name: 'Curved LED Video Booth', price: 349, requires: 'ledBooth' },
  { id: 'custom-visuals', name: 'Custom Animated Visual Package', price: 250, requires: 'ledBooth' },
  { id: 'booth-experience', name: 'Full Booth + Custom Visual Experience', price: 599, requires: 'ledBooth' },
  { id: 'corporate-visuals', name: 'Corporate / Branded Visual Package', price: 595, from: true, requires: 'ledBooth' },
  { id: 'venue-content', name: 'Restaurant promotional content updates', price: 150, from: true, recurring: 'month', requires: 'ledBooth' },

  /* Not advertised until confirmed — brief §17. */
  { id: 'dancefloor-fx', name: 'Premium dance-floor effects', price: null, quoted: true, requires: 'dancefloorEffects' }
];

/** An add-on is sellable only if its gating flag is on. */
export function isAvailable(addon) {
  return !addon.requires || AVAILABLE[addon.requires] === true;
}

export function getPackage(id) {
  return PACKAGES.find((p) => p.id === id) || null;
}

export function getAddon(id) {
  return ADDONS.find((a) => a.id === id) || null;
}

/** Add-ons safe to show on the site right now. */
export function sellableAddons() {
  return ADDONS.filter(isAvailable);
}

/** Packages for an event type, cheapest first. Custom-priced last. */
export function packagesFor(eventType) {
  return PACKAGES
    .filter((p) => !p.eventTypes || p.eventTypes.includes(eventType))
    .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
}

/**
 * A package's inclusion list as plain strings, with anything gated on gear
 * DKDJS does not yet own removed. Keeps unowned equipment out of
 * customer-facing copy automatically rather than by anyone remembering to.
 */
export function visibleIncludes(pkg) {
  if (!pkg || !pkg.includes) return [];
  return pkg.includes
    .map((line) => (typeof line === 'string' ? { text: line } : line))
    .filter((line) => !line.requires || AVAILABLE[line.requires] === true)
    .map((line) => line.text);
}

/** Every inclusion, flagged — for Daniel's own reference, not the public site. */
export function allIncludes(pkg) {
  if (!pkg || !pkg.includes) return [];
  return pkg.includes
    .map((line) => (typeof line === 'string' ? { text: line } : line))
    .map((line) => ({
      text: line.text,
      hidden: Boolean(line.requires) && AVAILABLE[line.requires] !== true
    }));
}

/**
 * Build a line-item estimate.
 *
 * Unavailable add-ons are silently dropped — they should never have been
 * offered, and they must never reach a total.
 *
 * @returns {{lines: Array, total: number, holdAmount: number|null, needsTravelQuote: boolean, custom: boolean}}
 */
export function estimate({ packageId, addonIds = [], extraHours = 0, travelMinutes = null } = {}) {
  const pkg = getPackage(packageId);
  const empty = { lines: [], total: 0, holdAmount: POLICY.holdAmount, needsTravelQuote: false, custom: false };
  if (!pkg) return empty;

  if (pkg.custom) {
    return { ...empty, custom: true, lines: [{ id: pkg.id, label: pkg.name, amount: null, quoted: true }] };
  }

  const bundled = (pkg.bundledAddons || []).filter((id) => {
    const addon = getAddon(id);
    return addon && isAvailable(addon);
  });

  const lines = [{ id: pkg.id, label: `${pkg.name} · ${pkg.hours} hrs`, amount: pkg.price }];

  bundled.forEach((id) => {
    const addon = getAddon(id);
    lines.push({ id: addon.id, label: addon.name, amount: 0, included: true });
  });

  addonIds
    .filter((id) => !bundled.includes(id))
    .map(getAddon)
    .filter((addon) => addon && isAvailable(addon) && addon.price !== null)
    .forEach((addon) => {
      lines.push({ id: addon.id, label: addon.name, amount: addon.price });
    });

  const hours = Math.max(0, Math.floor(extraHours));
  if (hours > 0) {
    const extra = getAddon('extra-hour');
    lines.push({
      id: 'extra-hour',
      label: `${hours} extra ${hours === 1 ? 'hour' : 'hours'}`,
      amount: extra.price * hours
    });
  }

  // Travel policy is undecided, so the estimate never guesses at it.
  // Until POLICY.travelIncludedMinutes is set, travel is simply "quoted".
  let needsTravelQuote = false;
  if (travelMinutes !== null) {
    if (!policyReady('travelIncludedMinutes')) {
      needsTravelQuote = true;
      lines.push({ id: 'travel', label: 'Travel', amount: 0, quoted: true });
    } else {
      needsTravelQuote = travelMinutes > POLICY.travelIncludedMinutes;
      lines.push({
        id: 'travel',
        label: needsTravelQuote ? 'Travel' : `Travel (within ${POLICY.travelIncludedMinutes} min)`,
        amount: 0,
        quoted: needsTravelQuote,
        included: !needsTravelQuote
      });
    }
  }

  const total = lines.reduce((sum, line) => sum + (line.amount || 0), 0);
  return { lines, total, holdAmount: POLICY.holdAmount, needsTravelQuote, custom: false };
}

/** "$1,595" — returns '' for a null amount so nothing renders "$null". */
export function formatMoney(amount) {
  if (amount === null || amount === undefined) return '';
  return `$${Number(amount).toLocaleString('en-US')}`;
}

/** "Starting at $595" / "$295" / "Quoted" */
export function priceLabel(item) {
  if (!item) return '';
  if (item.priceLabel) return item.priceLabel;
  if (item.quoted || item.price === null) return 'Quoted';
  const base = formatMoney(item.price);
  const suffix = item.recurring ? `/${item.recurring}` : '';
  return item.from ? `Starting at ${base}${suffix}` : `${base}${suffix}`;
}
