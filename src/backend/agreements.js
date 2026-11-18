/**
 * DKDJS booking agreements — shared backend logic (NOT a web module).
 *
 * Same reason booking.js exists: the agreement is read by a web module and
 * signed by an HTTP function, and those two must never disagree about what
 * the agreement says. Both call in here. Nothing in this file is callable
 * from a browser.
 *
 * WHY THE SIGNATURE IS WRITTEN FROM AN HTTP FUNCTION
 * A Velo web module has no access to the caller's IP address — there is no
 * request object. `wix-http-functions` does (`request.ip`). An IP recorded by
 * our own server is real evidence; one passed up from the page is just a
 * string the browser chose, so it is worth nothing. Reading the agreement
 * therefore happens in agreements.web.js, and writing the signature happens
 * in http-functions.js, which calls recordSignature() below.
 */

import wixData from 'wix-data';
import { buildAgreement, agreementText, CONSENT_TEXT } from 'public/agreements';
import { loadPayableHold } from 'backend/booking';

const HOLDS = 'Holds';
const LEADS = 'Leads';
const AGREEMENTS = 'Agreements';

const OPTS = { suppressAuth: true };

/**
 * Assemble the booking record the agreement is built from.
 *
 * The Lead row holds what the customer told us (name, email, date, venue,
 * guests). The Hold row holds what Daniel decided (package, add-ons, times).
 * The Hold wins on any field both carry, because Daniel's figure is the
 * quoted one.
 */
function mergeRecord(hold, lead) {
  const pick = (key) => (hold[key] !== undefined && hold[key] !== null && hold[key] !== ''
    ? hold[key]
    : (lead ? lead[key] : undefined));

  /** Hold's list wins if it has anything; otherwise whatever the form caught. */
  const list = (key) => {
    const fromHold = hold[key];
    if (Array.isArray(fromHold) && fromHold.length) return fromHold;
    const fromLead = lead && lead[key];
    return Array.isArray(fromLead) ? fromLead : [];
  };

  return {
    name: pick('name'),
    email: pick('email'),
    phone: pick('phone'),
    eventDate: hold.eventDate,
    eventType: pick('eventType'),
    venue: pick('venue'),
    city: pick('city'),
    guestCount: pick('guestCount'),

    packageId: pick('packageId'),
    addonIds: list('addonIds'),
    extraHours: hold.extraHours,

    arrivalTime: hold.arrivalTime,
    ceremonyTime: hold.ceremonyTime,
    receptionTime: hold.receptionTime,
    startTime: pick('startTime'),
    /* The enquiry form calls it endTime; the agreement calls it finishTime.
       Same thing, named differently either side of this function. */
    finishTime: hold.finishTime || (lead ? lead.endTime : undefined),
    setting: hold.setting,

    /* Commitments, and deliberately hold-only — never from the Lead.
       These print in the contract as things DKDJS has agreed to do, and a
       Lead is what the CUSTOMER typed. Letting a request promote itself into
       a promise by travelling through this function is exactly the failure
       the intake page's unticked checkboxes exist to prevent.

       Passed through whatever shape they are in. These moved from a Tags
       field to a Text field on 2026-11-18, because the Tags field splits
       its input on commas — which turned "…video booth, at your request"
       into two bullets, the second reading only "at your request".
       cleanList() in public/agreements takes an array or a newline string,
       so this hands the value over rather than guessing at it. */
    agreedItems: hold.agreedItems,
    clientProvides: hold.clientProvides
  };
}

/**
 * Load a hold and build its agreement.
 *
 * @returns {Promise<{ok: boolean, reason?: string, agreement?: object,
 *                    hold?: object, record?: object, missing?: string[]}>}
 */
export async function loadAgreement(holdId) {
  const check = await loadPayableHold(holdId);
  if (!check.ok) return { ok: false, reason: check.reason, hold: check.hold };

  const hold = check.hold;
  const lead = hold.leadId
    ? await wixData.get(LEADS, hold.leadId, OPTS).catch(() => null)
    : null;

  const record = mergeRecord(hold, lead);
  const agreement = buildAgreement(record);

  /* Not an error the customer caused — it means the Hold row is not finished.
     Reported separately so the page says "we are still preparing this"
     rather than accusing the visitor's link of being broken. */
  if (!agreement.ok) {
    console.error('[agreements.loadAgreement] hold not ready', holdId, agreement.missing);
    return { ok: false, reason: 'not-ready', missing: agreement.missing, hold, record };
  }

  return { ok: true, agreement, hold, record, lead };
}

/**
 * Write the signature.
 *
 * Idempotent: a double-tap, a refresh or a second visit to the link must not
 * produce two signature rows for one booking.
 *
 * @param {string} holdId
 * @param {{fullName: string, ip?: string, userAgent?: string}} signer
 */
export async function recordSignature(holdId, signer = {}) {
  const fullName = String(signer.fullName || '').trim().replace(/\s+/g, ' ');

  /* A signature has to be a name, so this insists on two words. It does NOT
     insist on matching the name on the enquiry: the person who filled in the
     form is often not the person whose legal name goes on the agreement, and
     for weddings that is the normal case rather than the exception. The name
     we already had is stored alongside, so a mismatch is visible to Daniel
     instead of silently blocking a legitimate signer. */
  if (fullName.length < 3 || !/\s/.test(fullName)) {
    return { ok: false, reason: 'bad-name' };
  }

  const loaded = await loadAgreement(holdId);
  if (!loaded.ok) return { ok: false, reason: loaded.reason, missing: loaded.missing };

  const { agreement, hold, record } = loaded;

  // Already signed — hand back the existing record, do not write another.
  const prior = await wixData
    .query(AGREEMENTS)
    .eq('holdId', holdId)
    .limit(1)
    .find(OPTS)
    .catch(() => ({ items: [] }));

  if (prior.items.length) {
    const row = prior.items[0];
    return { ok: true, alreadySigned: true, agreementId: row._id, signedAt: row.signedAt };
  }

  const signedAt = new Date();

  try {
    const row = await wixData.insert(AGREEMENTS, {
      title: `${agreement.title} · ${agreement.eventDate} · ${fullName}`,
      holdId,
      leadId: hold.leadId || '',
      eventDate: hold.eventDate,
      agreementKind: agreement.kind,
      packageId: record.packageId,
      totalAmount: agreement.total,
      retainerAmount: agreement.retainer,

      /* The four things ESIGN and Idaho's UETA actually turn on. */
      signerName: fullName,            // intent to sign
      consentText: CONSENT_TEXT,       // consent to sign electronically
      agreementSnapshot: agreementText(agreement), // association with the record
      termsVersion: agreement.termsVersion,        // which version was agreed

      signerEmail: record.email || '',
      nameOnRecord: record.name || '',
      nameMatchesRecord: String(record.name || '').trim().toLowerCase()
        === fullName.toLowerCase(),

      signedAt,
      // Recorded by our server from the request, not sent up by the page.
      signerIp: String(signer.ip || ''),
      // Client-asserted. Corroborating detail only; never treat it as proof.
      userAgent: String(signer.userAgent || '').slice(0, 500)
    }, OPTS);

    await wixData.update(HOLDS, {
      ...hold,
      agreementSignedAt: signedAt,
      agreementId: row._id
    }, OPTS).catch((err) => console.error('[agreements] hold update failed', err));

    return { ok: true, agreementId: row._id, signedAt };
  } catch (err) {
    console.error('[agreements.recordSignature]', holdId, err);
    return { ok: false, reason: 'error' };
  }
}
