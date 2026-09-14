/**
 * DKDJS equipment inventory — single source of truth for the gear.
 *
 * Drives the "Our Setup" page (brief §23) and the "What Comes With Us"
 * homepage section (§11).
 *
 *   import { EQUIPMENT, CONFIGURATIONS, BRAND_NOTE } from 'public/equipment';
 *
 * Brand rule (brief §12): DKDJS uses JBL equipment and may say so factually.
 * Nothing here implies sponsorship, certification, endorsement or partnership.
 * DKDJS is the brand; JBL is the equipment.
 *
 * Copy rule (§23): this is NOT an equipment list page. Model numbers are
 * supporting detail, never the headline. Every item carries `sell` — what the
 * customer actually gets — alongside `spec`.
 */

export const BRAND_NOTE =
  'DKDJS owns and operates JBL professional and PartyBox series equipment. ' +
  'DKDJS is not sponsored by, affiliated with or endorsed by JBL or Harman.';

/**
 * Guest-count and room-size figures are deliberately absent.
 * Venue-capacity claims are on the do-not-invent list (master brief, top).
 * Fill `guestRange` in CONFIGURATIONS once Daniel confirms real coverage.
 */

export const EQUIPMENT = {
  mainSound: {
    label: 'Main sound',
    sell: 'Clear, room-filling sound that carries to the back of the room without punishing the front tables.',
    items: [
      { name: 'JBL PartyBox Ultimate', qty: 2, spec: '1100W each', role: 'Main left/right system' }
    ]
  },

  fillSound: {
    label: 'Room-fill sound',
    sell: 'Extra coverage for long rooms, patios, cocktail areas and ceremony spaces away from the main floor.',
    items: [
      { name: 'JBL PartyBox Stage 320', qty: 2, role: 'Secondary / ceremony system' },
      { name: 'JBL PartyBox Encore', qty: 2, spec: 'approx. 100W each', role: 'Satellite fill' }
    ]
  },

  lighting: {
    label: 'Dance floor lighting',
    sell: 'Synchronized lighting that moves with the music — and stays down during dinner and toasts.',
    items: [
      { name: 'JBL PartyLight Stick', qty: 4, role: 'Floor and perimeter lighting' },
      { name: 'JBL PartyLight Beam', qty: 2, role: 'Beam effects' }
    ]
  },

  booth: {
    label: 'Curved LED video DJ booth',
    sell: 'A curved LED video booth that displays custom animations, names, monograms, photos, logos, event colors and promotions throughout your event.',
    items: [
      { name: 'Curved LED video DJ booth', qty: 1, role: 'Visual centerpiece' }
    ]
  },

  microphones: {
    label: 'Wireless microphones',
    sell: 'For vows, toasts, announcements and karaoke.',
    items: [
      { name: 'JBL wireless microphones', qty: null, role: 'Vocals, toasts, karaoke' }
    ]
  },

  support: {
    label: 'Stands and rigging',
    sell: 'Speakers at proper height, cables run clean and out of the way.',
    items: [
      { name: 'Professional speaker stands', qty: null, role: 'Elevation and coverage' }
    ]
  },

  backup: {
    label: 'Backup equipment',
    sell: 'Spare microphones, cables and critical audio equipment travel to every event.',
    items: []
  }
};

/**
 * Setup scales to the venue — the point of §23's headline,
 * "Professional sound. Flexible setup. Built around your event."
 *
 * `guestRange` is intentionally null. Daniel confirms real coverage before
 * any of this becomes a customer-facing capacity claim.
 */
export const CONFIGURATIONS = [
  {
    id: 'intimate',
    name: 'Intimate',
    guestRange: null,
    sell: 'Smaller rooms, private dining, house parties.',
    deploys: ['JBL PartyBox Stage 320 ×2', 'PartyLight Sticks', 'Wireless microphone']
  },
  {
    id: 'standard',
    name: 'Standard reception',
    guestRange: null,
    sell: 'The typical wedding reception or party room.',
    deploys: [
      'JBL PartyBox Ultimate ×1',
      'PartyBox Stage 320 ×2 as fill',
      'Full PartyLight rig',
      'LED video DJ booth',
      'Wireless microphones'
    ]
  },
  {
    id: 'large',
    name: 'Large venue',
    guestRange: null,
    sell: 'Big halls, barns, outdoor receptions and anywhere sound has to travel.',
    deploys: [
      'JBL PartyBox Ultimate ×2 as mains',
      'PartyBox Stage 320 ×2 as fill',
      'PartyBox Encore ×2 as satellites',
      'Full PartyLight rig',
      'LED video DJ booth',
      'Wireless microphones'
    ]
  },
  {
    id: 'ceremony-plus',
    name: 'Ceremony + reception',
    guestRange: null,
    sell: 'A second system where the vows happen, so the back row hears them.',
    deploys: [
      'Dedicated ceremony system',
      'Officiant and lapel microphones',
      'Full reception rig set up separately'
    ]
  }
];

/**
 * What the curved LED booth can display (brief §13).
 * Positioned as an experience, never as "a DJ facade".
 */
export const BOOTH_USE_CASES = [
  {
    id: 'weddings',
    label: 'Weddings',
    copy: 'Names, monograms, photos and event visuals in your colors.'
  },
  {
    id: 'birthdays',
    label: 'Birthdays',
    copy: 'Birthday messages, themed graphics and custom transitions.'
  },
  {
    id: 'restaurants',
    label: 'Restaurants & venues',
    copy: 'Drink specials, happy hour, food promotions and what is coming up next.'
  },
  {
    id: 'corporate',
    label: 'Corporate',
    copy: 'Logos, sponsor graphics, awards, schedules and branded visuals.'
  }
];

/** Flat list for the "Our Setup" page, in display order. */
export function setupSections() {
  return [
    EQUIPMENT.mainSound,
    EQUIPMENT.fillSound,
    EQUIPMENT.booth,
    EQUIPMENT.lighting,
    EQUIPMENT.microphones,
    EQUIPMENT.support,
    EQUIPMENT.backup
  ];
}

/** "JBL PartyBox Ultimate ×2 (1100W each)" */
export function describeItem(item) {
  const qty = item.qty ? ` ×${item.qty}` : '';
  const spec = item.spec ? ` (${item.spec})` : '';
  return `${item.name}${qty}${spec}`;
}
