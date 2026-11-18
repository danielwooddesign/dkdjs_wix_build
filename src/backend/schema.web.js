/**
 * DKDJS CMS schema — inspect what exists, add what is missing.
 *
 * ── Why this file exists ──────────────────────────────────────────────────
 *
 * A CSV export shows a collection's DISPLAY NAMES. Code reads and writes by
 * FIELD KEY. Wix generates the key from the name when a field is created, so
 * a column shown as "Signed Hold" is almost certainly the key `signedHold` —
 * which is not what `backend/agreements.js` writes to. Nothing warns you
 * about that. The first function here prints the real keys so the two can be
 * reconciled on fact rather than on guesswork.
 *
 * ── Correction to an earlier claim ────────────────────────────────────────
 *
 * I previously said Wix silently DROPS a value whose field is not defined in
 * the collection. Wix's own documentation says the opposite: "The structure
 * you define for a data collection isn't enforced... if you add or update an
 * item containing a field or data type that doesn't match the collection's
 * structure, your data is stored anyway."
 *
 * So an undefined field is stored, not lost. What it is not, is VISIBLE in
 * the CMS, and — the part that actually matters here — it is not reliably
 * QUERYABLE. `recordSignature` does `query(Agreements).eq('holdId', …)` to
 * avoid writing a second signature for one booking. Against an undefined
 * field that check cannot be depended on. So the fields still need to exist;
 * the consequence of skipping them is a duplicate-signature check that
 * quietly stops working, not a signature that vanishes.
 *
 * ── Permissions ───────────────────────────────────────────────────────────
 *
 * The v2 Collections API is restricted and has to be called through
 * wix-auth's elevate(). Elevating makes the inner call run with full rights,
 * so both exports below are Permissions.Admin: the elevation is wrapped in a
 * method only the site owner can reach.
 */

import { Permissions, webMethod } from 'wix-web-module';

/* wix-auth and wix-data.v2 are NOT imported at the top of this file, on
   purpose. A static import that cannot resolve throws while the module is
   being loaded, before any function in it is registered — so every method
   here fails, nothing can catch it, and Site Monitoring shows no entry at
   all, because there is no function to attribute the failure to. That is
   precisely what happened. Loading them dynamically turns an unresolvable
   module from a silent total failure into a message. */

/**
 * Elevation is resolved on first use, not at module load.
 *
 * It used to be three top-level `elevate(...)` calls. If any of those
 * arguments is undefined on a given site, elevate throws while the module is
 * being loaded — which takes down every method in the file, and Velo reports
 * it as the generic "Unable to handle the request" with no clue which line
 * or why. Doing it lazily means a problem here is reported as a value, by
 * the function that needed it.
 */
let api = null;

/**
 * Resolve the Collections API, reporting rather than throwing.
 *
 * Returns { ok: true, get, update, create } or { ok: false, detail, seen }.
 * Nothing in here is allowed to escape as an exception.
 */
async function getApi() {
  if (api) return api;

  const problems = [];
  let elevate = null;
  let collections = null;

  try {
    ({ elevate } = await import('wix-auth'));
  } catch (err) {
    problems.push('wix-auth did not load: ' + String((err && err.message) || err));
  }

  try {
    ({ collections } = await import('wix-data.v2'));
  } catch (err) {
    problems.push('wix-data.v2 did not load: ' + String((err && err.message) || err));
  }

  const seen = {
    elevate: typeof elevate,
    collections: typeof collections,
    methods: collections ? Object.keys(collections).slice(0, 40) : null
  };

  if (typeof elevate !== 'function') problems.push('elevate is not a function');
  if (!collections) problems.push('collections is empty');
  else {
    ['getDataCollection', 'updateDataCollection', 'createDataCollection']
      .forEach((fn) => {
        if (typeof collections[fn] !== 'function') problems.push('missing collections.' + fn);
      });
  }

  if (problems.length) return { ok: false, detail: problems.join('; '), seen };

  try {
    api = {
      ok: true,
      get: elevate(collections.getDataCollection),
      update: elevate(collections.updateDataCollection),
      create: elevate(collections.createDataCollection)
    };
  } catch (err) {
    return { ok: false, detail: 'elevate() failed: ' + String((err && err.message) || err), seen };
  }

  return api;
}

/**
 * Proof of life. No imports, no API, nothing that can fail.
 *
 * If this returns and inspectSchema does not, the module is loading and the
 * fault is in the Collections API. If this does not return either, the
 * problem is the module or the permission, not the code inside it.
 */
export const ping = webMethod(Permissions.Admin, async () => {
  return { ok: true, at: new Date().toISOString(), file: 'schema.web.js' };
});

const WATCHED = ['Leads', 'Holds', 'Bookings', 'Agreements'];

/**
 * Every field key this build reads or writes, by collection.
 * Kept here so there is one list to check a live site against.
 */
export const EXPECTED = {
  Holds: [
    // written by availability.web.js — these already exist
    'title', 'eventDate', 'leadId', 'email', 'status', 'paid', 'expiresAt',
    // the agreement needs these
    'eventType', 'venue', 'city', 'guestCount',
    'packageId', 'addonIds', 'extraHours',
    'arrivalTime', 'ceremonyTime', 'receptionTime', 'startTime', 'finishTime',
    'setting', 'agreedItems', 'clientProvides',
    'agreementSignedAt', 'agreementId',
    // the pay flow needs these
    'paymentId', 'paymentAmount', 'lastPaymentStatus', 'transactionId',
    'paymentVerified'
  ],
  Agreements: [
    'title', 'holdId', 'leadId', 'eventDate', 'agreementKind', 'packageId',
    'totalAmount', 'retainerAmount', 'signerName', 'consentText',
    'agreementSnapshot', 'termsVersion', 'signerEmail', 'nameOnRecord',
    'nameMatchesRecord', 'signedAt', 'signerIp', 'userAgent'
  ]
};

/**
 * What the live site actually has.
 *
 * Returns the real keys, display names and type strings, plus a list of the
 * expected keys that are absent. Read-only — it changes nothing.
 */
export const inspectSchema = webMethod(Permissions.Admin, async () => {
  /* Nothing in here is allowed to throw. A thrown error reaches the browser
     as "Unable to handle the request", which says nothing — and this function
     exists precisely to diagnose. */
  const resolved = await getApi();
  if (!resolved.ok) {
    return { ok: false, reason: 'api-unavailable', detail: resolved.detail, seen: resolved.seen };
  }
  const getCollection = resolved.get;

  const out = {};

  for (const name of WATCHED) {
    try {
      const collection = await getCollection(name);

      const fields = (collection.fields || []).map((f) => ({
        key: f.key,
        name: f.displayName,
        type: f.type,
        system: Boolean(f.systemField)
      }));

      const keys = fields.map((f) => f.key);

      out[name] = {
        exists: true,
        revision: collection.revision,
        permissions: collection.permissions,
        fields,
        missing: (EXPECTED[name] || []).filter((k) => !keys.includes(k))
      };
    } catch (err) {
      out[name] = { exists: false, error: String(err && err.message || err) };
    }
  }

  return { ok: true, collections: out };
});

/* ------------------------------------------------------------------ *
 * Adding the missing Holds fields
 * ------------------------------------------------------------------ */

/**
 * Work out the type strings this site uses, by reading fields that already
 * have the right type, rather than hard-coding enum values.
 *
 * Wix's own docs say "do not assume any prop names or enum values other than
 * the ones in the example", and the example only shows TEXT and DATETIME. So
 * NUMBER, BOOLEAN and the tags type are copied off real fields on this site:
 * whatever string Wix used there is the string that works here.
 *
 * `_id` and `_createdDate` are system fields present on every collection, so
 * TEXT and DATETIME are always discoverable. The other three come from fields
 * created by the existing build. If any cannot be found, this refuses rather
 * than guessing — a wrong type on a date or a number is worse than a missing
 * field, because it fails later and less obviously.
 */
function discoverTypes(leads, holds) {
  const find = (collection, key) => {
    const field = (collection.fields || []).find((f) => f.key === key);
    return field ? field.type : null;
  };

  const types = {
    TEXT: find(holds, '_id'),
    DATETIME: find(holds, '_createdDate'),
    NUMBER: find(leads, 'guestCount') || find(leads, 'estimateTotal'),
    BOOLEAN: find(holds, 'paid'),
    TAGS: find(leads, 'addonIds')
  };

  const unknown = Object.keys(types).filter((k) => !types[k]);
  return { types, unknown };
}

/** The fields to add to Holds, in the order they should appear. */
const HOLD_FIELDS = [
  ['eventType', 'Event Type', 'TEXT'],
  ['venue', 'Venue', 'TEXT'],
  ['city', 'City', 'TEXT'],
  ['guestCount', 'Guest Count', 'NUMBER'],
  ['packageId', 'Package Id', 'TEXT'],
  ['addonIds', 'Addon Ids', 'TAGS'],
  ['extraHours', 'Extra Hours', 'NUMBER'],
  ['arrivalTime', 'Arrival Time', 'TEXT'],
  ['ceremonyTime', 'Ceremony Time', 'TEXT'],
  ['receptionTime', 'Reception Time', 'TEXT'],
  ['startTime', 'Start Time', 'TEXT'],
  ['finishTime', 'Finish Time', 'TEXT'],
  ['setting', 'Indoors Or Outdoors', 'TEXT'],
  /* TEXT, one item per line — not TAGS. A Tags field splits on commas. */
  ['agreedItems', 'Agreed Items', 'TEXT'],
  ['clientProvides', 'Client Provides', 'TEXT'],
  ['agreementSignedAt', 'Agreement Signed At', 'DATETIME'],
  ['agreementId', 'Agreement Id', 'TEXT'],
  ['paymentId', 'Payment Id', 'TEXT'],
  ['paymentAmount', 'Payment Amount', 'NUMBER'],
  ['lastPaymentStatus', 'Last Payment Status', 'TEXT'],
  ['transactionId', 'Transaction Id', 'TEXT'],
  ['paymentVerified', 'Payment Verified', 'BOOLEAN']
];

/**
 * Add the missing fields to Holds. Idempotent: a field that already exists is
 * left exactly as it is, so running this twice is harmless.
 *
 * `dryRun` defaults to TRUE. Nothing changes unless it is called with false.
 */
export const addHoldFields = webMethod(Permissions.Admin, async (dryRun = true) => {
  let leads;
  let holds;
  const resolved = await getApi();
  if (!resolved.ok) {
    return { ok: false, reason: 'api-unavailable', detail: resolved.detail, seen: resolved.seen };
  }
  const getCollection = resolved.get;

  try {
    leads = await getCollection('Leads');
    holds = await getCollection('Holds');
  } catch (err) {
    return { ok: false, reason: 'read-failed', detail: String(err && err.message || err) };
  }

  const { types, unknown } = discoverTypes(leads, holds);
  if (unknown.length) {
    return {
      ok: false,
      reason: 'unknown-types',
      unknown,
      detail: 'Could not work out the type string for: ' + unknown.join(', ')
        + '. Add one field of each missing type by hand in the CMS, then run '
        + 'this again — it copies the type off whatever is already there.'
    };
  }

  const existing = (holds.fields || []).map((f) => f.key);
  const toAdd = HOLD_FIELDS.filter(([key]) => !existing.includes(key));

  if (!toAdd.length) return { ok: true, added: [], note: 'Nothing missing.' };

  if (dryRun) {
    return {
      ok: true,
      dryRun: true,
      types,
      wouldAdd: toAdd.map(([key, name, type]) => `${key} (${name}) — ${types[type]}`)
    };
  }

  const updated = {
    ...holds,
    fields: (holds.fields || []).concat(
      toAdd.map(([key, displayName, type]) => ({ key, displayName, type: types[type] }))
    )
  };

  try {
    const result = await resolved.update(updated);
    return {
      ok: true,
      added: toAdd.map(([key]) => key),
      revision: result && result.revision
    };
  } catch (err) {
    console.error('[schema.addHoldFields]', err);
    return { ok: false, reason: 'update-failed', detail: String(err && err.message || err) };
  }
});

/* ------------------------------------------------------------------ *
 * The Agreements collection
 * ------------------------------------------------------------------ */

/**
 * The Agreements collection, as the code needs it.
 *
 * Display names are the ones Wix AI chose — they are better than mine, and a
 * display name is what you read in the CMS. The KEYS are the code's, because
 * a key is what `backend/agreements.js` writes to. Wix generates a key from
 * the name at creation time, which is why a hand-built collection with
 * perfect column headings can still be invisible to the code: "Signed Hold"
 * becomes `signedHold`, and nothing writes to `signedHold`.
 */
const AGREEMENT_FIELDS = [
  ['title', 'Title', 'TEXT'],
  ['holdId', 'Signed Hold', 'TEXT'],
  ['leadId', 'Enquiry Reference', 'TEXT'],
  ['eventDate', 'Event Date', 'TEXT'],
  ['agreementKind', 'Wedding/Event', 'TEXT'],
  ['packageId', 'Booked Package', 'TEXT'],
  ['totalAmount', 'Agreed Price', 'NUMBER'],
  ['retainerAmount', 'Retainer Amount', 'NUMBER'],
  ['signerName', 'Electronic Signature', 'TEXT'],
  ['consentText', 'Exact Accepted Statement', 'TEXT'],
  ['agreementSnapshot', 'Full Plain-text Agreement', 'TEXT'],
  ['termsVersion', 'Applicable Version', 'TEXT'],
  ['signerEmail', 'Signer Email', 'TEXT'],
  ['nameOnRecord', 'Enquiry Name', 'TEXT'],
  ['nameMatchesRecord', 'Name Matches Record', 'BOOLEAN'],
  ['signedAt', 'Signed At', 'DATETIME'],
  ['signerIp', 'Signer IP', 'TEXT'],
  ['userAgent', 'Browser Information', 'TEXT']
];

/**
 * Create the Agreements collection with the right keys.
 *
 * Refuses if one already exists — this never deletes anything. If the
 * existing collection is empty and has the wrong keys, delete it in the CMS
 * first, then run this.
 *
 * Permissions are ADMIN on all four actions. Signatures are evidence; no
 * visitor needs to read them, and the backend writes with suppressAuth.
 */
export const createAgreements = webMethod(Permissions.Admin, async (dryRun = true) => {
  let leads;
  let holds;

  const resolved = await getApi();
  if (!resolved.ok) {
    return { ok: false, reason: 'api-unavailable', detail: resolved.detail, seen: resolved.seen };
  }
  const getCollection = resolved.get;

  try {
    leads = await getCollection('Leads');
    holds = await getCollection('Holds');
  } catch (err) {
    return { ok: false, reason: 'read-failed', detail: String(err && err.message || err) };
  }

  try {
    const existing = await getCollection('Agreements');
    if (existing) {
      return {
        ok: false,
        reason: 'already-exists',
        detail: 'An Agreements collection already exists. If it is empty and '
          + 'its keys are wrong, delete it in the CMS first — this will not '
          + 'delete anything for you.'
      };
    }
  } catch (err) {
    // Not found is the expected path. Carry on.
  }

  const { types, unknown } = discoverTypes(leads, holds);
  if (unknown.length) {
    return { ok: false, reason: 'unknown-types', unknown };
  }

  const collection = {
    _id: 'Agreements',
    displayName: 'Agreements',
    displayField: 'title',
    permissions: { read: 'ADMIN', insert: 'ADMIN', update: 'ADMIN', remove: 'ADMIN' },
    fields: AGREEMENT_FIELDS.map(([key, displayName, type]) => ({
      key, displayName, type: types[type]
    }))
  };

  if (dryRun) return { ok: true, dryRun: true, types, collection };

  try {
    const created = await resolved.create(collection);
    return { ok: true, created: created && created._id, fields: AGREEMENT_FIELDS.length };
  } catch (err) {
    console.error('[schema.createAgreements]', err);
    return { ok: false, reason: 'create-failed', detail: String(err && err.message || err) };
  }
});
