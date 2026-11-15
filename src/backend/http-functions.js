/**
 * DKDJS HTTP functions.
 *
 * There is exactly one thing here, and one reason for it: a Velo web module
 * cannot see the caller's IP address, and an HTTP function can. A signature
 * record with a server-observed IP is evidence; one with an IP the page typed
 * into a parameter is not. So the signature is written from here.
 *
 * Endpoint:  POST https://www.dkdjs.com/_functions/sign
 * Body:      { "holdId": "<guid>", "fullName": "Jane Smith", "consent": true }
 *
 * Security posture is the same as the pay and agreement web methods: the hold
 * id is an unguessable GUID and is the only credential. This endpoint cannot
 * be used to read anything — it returns an id and a timestamp, nothing else —
 * and it cannot take money.
 */

import { ok, badRequest, serverError } from 'wix-http-functions';
import { recordSignature } from 'backend/agreements';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function post_sign(request) {
  let body;
  try {
    body = await request.body.json();
  } catch (err) {
    return badRequest({ headers: JSON_HEADERS, body: { ok: false, reason: 'bad-body' } });
  }

  const holdId = String((body && body.holdId) || '').trim();
  const fullName = String((body && body.fullName) || '').trim();

  if (!holdId) {
    return badRequest({ headers: JSON_HEADERS, body: { ok: false, reason: 'missing-hold' } });
  }

  /* The tick is not decoration. Consent to transact electronically is one of
     the things ESIGN requires, so an unticked box is a hard stop, not a
     validation nicety to be worked around. */
  if (body.consent !== true) {
    return badRequest({ headers: JSON_HEADERS, body: { ok: false, reason: 'no-consent' } });
  }

  try {
    const result = await recordSignature(holdId, {
      fullName,
      ip: request.ip,
      userAgent: (request.headers && request.headers['user-agent']) || ''
    });

    // A refused signature is a 200 with ok:false — the page needs the reason
    // in order to say something useful, and these are not server faults.
    return ok({ headers: JSON_HEADERS, body: result });
  } catch (err) {
    console.error('[http.post_sign]', holdId, err);
    return serverError({ headers: JSON_HEADERS, body: { ok: false, reason: 'error' } });
  }
}
