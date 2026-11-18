/**
 * DKDJS booking agreement — read side.
 *
 * Flow:
 *   1. Daniel finishes the Hold row (package, times) and sends:
 *        /agreement?hold=<holdId>
 *   2. The page calls getAgreement()  → renders the agreement to read
 *   3. The visitor types their name, ticks consent, submits
 *   4. The page POSTs to /_functions/sign (an HTTP function, because only it
 *      can see the caller's IP — see backend/agreements.js for why)
 *   5. On success the page sends them to /pay?hold=<holdId>
 *
 * PRIVACY NOTE. Unlike the pay page, which deliberately shows only a first
 * name, an agreement has to identify the parties and the event to be an
 * agreement at all. So this returns the name, email, phone, venue and total.
 * The hold id is an unguessable GUID, but it travels in a URL that can be
 * forwarded, so the link should be treated as confidential — it is the same
 * posture as emailing someone a contract, which is what it replaces.
 */

import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';
import { CONSENT_TEXT, KINDS } from 'public/agreements';
import { loadAgreement } from 'backend/agreements';

const AGREEMENTS = 'Agreements';
const HOLDS = 'Holds';
const OPTS = { suppressAuth: true };

export const getAgreement = webMethod(Permissions.Anyone, async (holdId) => {
  if (!holdId) return { ok: false, reason: 'missing-hold' };

  /* Signed already? Then the stored row IS the answer, whatever state the
     hold is in now — and this is checked first for that reason.
     A paid booking is no longer "payable", so running the payability check
     first meant a customer who had just paid could not reopen their own
     contract. Being able to keep the record is one of the four things ESIGN
     turns on, so that was a real defect, not a rough edge.
     What goes back is the snapshot, verbatim. Rebuilding from today's hold
     would show them a document they never signed if anything has been
     edited since. */
  const prior = await wixData
    .query(AGREEMENTS)
    .eq('holdId', holdId)
    .limit(1)
    .find(OPTS)
    .catch(() => ({ items: [] }));

  if (prior.items.length) {
    const row = prior.items[0];
    const hold = await wixData.get(HOLDS, holdId, OPTS).catch(() => null);
    const kind = KINDS[row.agreementKind] || KINDS.event;

    return {
      ok: true,
      title: kind.title,
      retainer: Number(row.retainerAmount) || null,
      paid: Boolean(hold && hold.paid),
      signed: {
        signerName: row.signerName,
        signedAt: row.signedAt,
        termsVersion: row.termsVersion,
        snapshot: row.agreementSnapshot
      }
    };
  }

  const loaded = await loadAgreement(holdId);

  if (!loaded.ok) {
    /* `missing` names the empty fields when the hold is not finished. It is
       field names, nothing about the customer, and it saves opening Site
       Monitoring to find out why a link will not render. */
    return { ok: false, reason: loaded.reason, missing: loaded.missing || null };
  }

  return {
    ok: true,
    agreement: loaded.agreement,
    consent: CONSENT_TEXT,
    signed: null,
    paid: Boolean(loaded.hold && loaded.hold.paid)
  };
});
