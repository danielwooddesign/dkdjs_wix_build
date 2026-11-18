/**
 * DKDJS booking agreements — the cover document, not the terms.
 *
 * DESIGN NOTE. Read this before adding a clause to this file.
 *
 * The obligations of a booking already live in the published Terms &
 * Conditions and Cancellation & Refund Policy (public/legal.js). This file
 * deliberately does NOT restate them. It builds a short cover document — who,
 * which event, which package, how much, when it is paid — and then
 * incorporates the published documents by reference.
 *
 * Two reasons it is built this way:
 *   1. A one-page agreement gets read. A ten-page one gets scrolled past.
 *   2. An agreement that restates the website can contradict the website.
 *      One source of truth makes that impossible.
 *
 * So: event facts and money belong here. Obligations belong in legal.js. If
 * you find yourself writing "the client shall" in this file, it belongs there.
 *
 * NOT ATTORNEY REVIEWED. Daniel declined review on 2026-11-15. This file
 * assembles decisions he had already made and publishes figures the pricing
 * module already holds. It is not legal advice and it is not a substitute for
 * having a lawyer read the Terms it points at.
 */

import { SITE } from 'public/content';
import { POLICY, estimate, formatMoney, getPackage } from 'public/pricing';
import { LEGAL_CONFIG } from 'public/legal';
import { formatDateKey } from 'public/dates';

/** The company side of the agreement, from the Certificate of Organization. */
export const COMPANY = {
  legalName: SITE.legalName,
  entityType: 'Limited Liability Company',
  state: 'Idaho',
  address: `${SITE.street}, ${SITE.city}, ${SITE.region} ${SITE.postalCode}`,
  email: SITE.email,
  phone: SITE.phone
};

/**
 * The two agreements.
 *
 * Their legal weight is identical — it comes from the incorporated Terms.
 * They differ only in which event facts are worth pinning down in writing,
 * because a wedding has moving parts a karaoke night does not.
 */
export const KINDS = {
  wedding: {
    id: 'wedding',
    title: 'Wedding Booking Agreement',
    heading: 'Your wedding day',
    /* [field on the booking record, label shown] — rows with no value are
       dropped, so a half-filled record produces a short agreement, never a
       row reading "Ceremony start: undefined". */
    fields: [
      ['arrivalTime',   'We arrive to set up'],
      ['ceremonyTime',  'Ceremony begins'],
      ['receptionTime', 'Reception begins'],
      ['finishTime',    'Music finishes'],
      ['venue',         'Venue'],
      ['city',          'City'],
      ['setting',       'Indoors or outdoors'],
      ['guestCount',    'Approximate guests']
    ],
    notes: [
      /* Not a new promise: the planning consultation and the music
         questionnaire are already in every package and already named in the
         Terms under what we provide. This only says where they fit. */
      'Your package includes a planning consultation and a music '
        + 'questionnaire. That is where your must-play and do-not-play lists, '
        + 'your first dance and anything you want announced get written down. '
        + 'We work from it on the day.',
      'If your ceremony is outdoors or in a separate space from the reception, '
        + 'the vows need their own sound. Check that ceremony audio appears in '
        + 'the list above — if it does not, it is not included.'
    ]
  },

  event: {
    id: 'event',
    title: 'Event Booking Agreement',
    heading: 'Your event',
    fields: [
      ['eventType',   'Event'],
      ['arrivalTime', 'We arrive to set up'],
      ['startTime',   'We start'],
      ['finishTime',  'Music finishes'],
      ['venue',       'Venue'],
      ['city',        'City'],
      ['setting',     'Indoors or outdoors'],
      ['guestCount',  'Approximate guests']
    ],
    notes: [
      'Tell us about any speeches, awards or announcements before the day. It '
        + 'changes the microphone setup and the running order.',
      'Most venues set a time by which music has to stop. Check yours, so the '
        + 'finish time above is one you can actually keep.'
    ]
  }
};

/**
 * Tidy a list that came from a CMS Tags field or a textarea.
 *
 * Capped at 20 lines of 200 characters. Not arbitrary: every line here is a
 * commitment printed into a contract, and an unbounded list pasted out of an
 * email thread is how a page of someone else's wishes ends up reading as
 * something DKDJS promised.
 */
function cleanList(value) {
  const raw = Array.isArray(value) ? value : String(value || '').split('\n');

  return raw
    .map((line) => String(line).replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((line) => (line.length > 200 ? line.slice(0, 197) + '\u2026' : line))
    .slice(0, 20);
}

/**
 * Make a phone number readable.
 *
 * The enquiry form takes whatever the visitor types, so "17202086813" is a
 * normal thing to find on a lead. It is their number either way, but a
 * contract should not look like it was filled in by a machine.
 * Anything that is not a plain US number is returned untouched rather than
 * mangled into a shape it does not fit.
 */
function formatPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  const local = digits.length === 11 && digits[0] === '1' ? digits.slice(1) : digits;
  if (local.length !== 10) return String(value || '').trim();
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}

/** Weddings get the wedding agreement. Everything else gets the other one. */
export function kindFor(eventType) {
  return /wedding/i.test(String(eventType || '')) ? KINDS.wedding : KINDS.event;
}

/**
 * Build the agreement for one booking.
 *
 * @param {object} b  the merged booking record — lead fields (name, email,
 *                    phone, eventDate, eventType, venue, city, guestCount)
 *                    plus whatever Daniel has set on the hold (packageId,
 *                    addonIds, extraHours, times).
 * @returns {object|null} null when there is not enough to sign — see
 *                        `missing` for what is absent.
 */
export function buildAgreement(b = {}) {
  const kind = kindFor(b.eventType);
  const pkg = b.packageId ? getPackage(b.packageId) : null;

  /* An agreement with no price is not worth signing — the one thing a
     customer is agreeing to is the number. So this refuses rather than
     printing "as quoted" and hoping. */
  const missing = [];
  if (!b.eventDate) missing.push('eventDate');
  if (!b.name) missing.push('name');
  if (!pkg) missing.push('packageId');

  const quote = pkg
    ? estimate({
        packageId: b.packageId,
        addonIds: Array.isArray(b.addonIds) ? b.addonIds : [],
        extraHours: Number(b.extraHours) || 0
      })
    : null;

  /* A custom-quoted package (the residency) has no computable total, so it
     cannot be signed through this page. Daniel quotes those by hand. */
  if (quote && (quote.custom || !quote.total)) missing.push('total');

  /* If the package commits to a number of hours, the agreement has to say
     which hours. "Six hours" with no start time is not a term anyone can
     hold either side to — and overtime is exactly the thing a booking
     argues about. Same principle as refusing without a price.
     NOTE: arrivalTime is deliberately not accepted here. That is load-in,
     not coverage; treating it as the start would quietly give away the
     setup hour. */
  const coverageStart = b.startTime || b.ceremonyTime || b.receptionTime;
  if (pkg && pkg.hours && !coverageStart) missing.push('startTime');

  if (missing.length) return { ok: false, missing, kind: kind.id };

  const retainer = Number(POLICY.holdAmount);
  const balance = quote.total - retainer;
  const term = POLICY.holdTerm || 'retainer';

  const sections = [];

  /* --------------------------------------------------------- the parties */
  sections.push({
    h: 'This agreement is between',
    rows: [
      [COMPANY.legalName, `an Idaho ${COMPANY.entityType}, ${COMPANY.address}`],
      ['Client', b.name],
      ['Email', b.email || ''],
      ['Phone', formatPhone(b.phone)]
    ]
  });

  /* ----------------------------------------------------------- the event */
  const rows = [['Date', formatDateKey(b.eventDate) || b.eventDate]];
  kind.fields.forEach(([field, label]) => {
    const value = b[field];
    if (value || value === 0) rows.push([label, String(value)]);
  });
  sections.push({ h: kind.heading, rows });

  /* --------------------------------------------------------- the service */
  sections.push({
    h: 'What you are booking',
    lines: quote.lines.map((line) => ({
      label: line.label,
      amount: line.included ? 'Included' : formatMoney(line.amount)
    })),
    total: formatMoney(quote.total)
  });

  /* ----------------------------------------------------------- the money */
  sections.push({
    h: 'How it is paid',
    rows: [
      ['Total', formatMoney(quote.total)],
      [`Date ${term}`, `${formatMoney(retainer)} — due on signing`],
      ['Balance', `${formatMoney(balance)}, due ${POLICY.balanceDueDays} days `
        + 'before your event']
    ],
    body: [
      `The ${term} takes your date off our calendar and comes off your total. `
        + `It is not an extra fee.`
        + (POLICY.holdRefundable ? '' : ` It is non-refundable.`),
      'Your date is not reserved until the ' + term + ' is paid. Until then we '
        + 'can take another booking for it.'
    ]
  });

  /* ------------------------------------------------- what else we agreed */

  /* Everything here is a commitment beyond the package, so it appears only
     because Daniel put it on the hold row deliberately. The intake page can
     PROPOSE these lines; it cannot write them.

     Note what this section does not say. There is no "anything not listed is
     excluded" line. That is an entire-agreement clause — a real legal clause,
     and not mine to invent. The Terms already define what is provided as the
     package as described on the site, and that governs. If an
     entire-agreement clause is wanted it belongs in the Terms, written by an
     attorney. */
  const agreedItems = cleanList(b.agreedItems);
  const clientProvides = cleanList(b.clientProvides);

  /* Two sections rather than one with two lists, so a heading always sits
     directly above the list it introduces. What DKDJS owes and what the
     client owes are the two things a dispute turns on; they should not share
     a box. */
  if (agreedItems.length) {
    sections.push({
      h: 'What else we have agreed',
      body: ['In addition to your package, we have agreed to:'],
      list: agreedItems
    });
  }

  if (clientProvides.length) {
    sections.push({
      h: 'What you are providing',
      body: ['You or your venue are providing the following, so we are not '
        + 'bringing them:'],
      list: clientProvides
    });
  }

  /* ------------------------------------------------ what governs the rest */
  sections.push({
    h: 'The terms that apply',
    body: [
      `This booking is governed by the ${COMPANY.legalName} Terms & Conditions `
        + `and Cancellation & Refund Policy published at ${SITE.url}, in the `
        + `version dated ${LEGAL_CONFIG.effectiveDate}. Those documents cover `
        + `what we provide, what we need from you, timings and overtime, `
        + `travel, music and requests, photography, cancellation, and the `
        + `limits of our liability. They are part of this agreement.`,
      'Please read both before you sign. They are short, and they are the '
        + 'substance of the deal — this page is the summary of your particular '
        + 'booking.',
      'The version that applies to you is the one published on the day you '
        + 'sign. We cannot change the terms of a booking after it is made.'
    ],
    links: [
      { label: 'Terms & Conditions',            url: `${SITE.url}/terms` },
      { label: 'Cancellation & Refund Policy',  url: `${SITE.url}/refund-policy` },
      { label: 'Privacy Policy',                url: `${SITE.url}/privacy-policy` }
    ]
  });

  /* ------------------------------------------------------- the small print */
  sections.push({ h: 'Worth knowing', body: kind.notes });

  return {
    ok: true,
    kind: kind.id,
    title: kind.title,
    sections,
    /* Stored with the signature. If the Terms are ever revised, this says
       which version a given customer actually agreed to. */
    termsVersion: LEGAL_CONFIG.effectiveDate,
    total: quote.total,
    retainer,
    balance,
    eventDate: formatDateKey(b.eventDate) || b.eventDate,
    dateKey: b.eventDate,
    firstName: String(b.name).trim().split(/\s+/)[0]
  };
}

/**
 * The sentence the signer ticks. Kept here, next to the agreement, because it
 * is the part that has to mean something: ESIGN and Idaho's UETA both turn on
 * the signer intending to sign and consenting to do it electronically.
 */
export const CONSENT_TEXT =
  'I am the person named in this agreement. I have read it, and I have read '
  + 'the Terms & Conditions and the Cancellation & Refund Policy it refers to. '
  + 'I agree to all three. I intend my typed name below to be my signature, '
  + 'and I agree to sign electronically rather than on paper.';

/**
 * A flat-text snapshot of the agreement, stored alongside the signature.
 *
 * This is the point of the whole file. Six months from now the question will
 * not be "what do our terms say" but "what did this person actually agree
 * to". Keeping the rendered text verbatim gives that question an answer that
 * does not depend on what the website says today.
 */
export function agreementText(agreement) {
  if (!agreement || !agreement.ok) return '';
  const out = [agreement.title, '='.repeat(agreement.title.length), ''];

  agreement.sections.forEach((s) => {
    out.push(s.h.toUpperCase());
    (s.rows || []).forEach(([k, v]) => out.push(`  ${k}: ${v}`));
    (s.lines || []).forEach((l) => out.push(`  ${l.label} — ${l.amount}`));
    if (s.total) out.push(`  TOTAL: ${s.total}`);
    (s.body || []).forEach((p) => out.push(`  ${p}`));
    (s.list || []).forEach((l) => out.push(`    - ${l}`));
    (s.links || []).forEach((l) => out.push(`  ${l.label}: ${l.url}`));
    out.push('');
  });

  out.push('CONSENT', `  ${CONSENT_TEXT}`, '');
  out.push(`Terms version: ${agreement.termsVersion}`);
  return out.join('\n');
}
