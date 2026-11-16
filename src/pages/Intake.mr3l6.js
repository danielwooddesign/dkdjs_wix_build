/**
 * Intake page (/intake) — paste this into the page's Velo file.
 *
 * ── Setup in the editor ───────────────────────────────────────────────────
 *   1. Add a page with the slug  intake
 *   2. SEO panel → indexing OFF.
 *   3. Add the custom element:
 *        Velo file   dkdjs-page.js
 *        Tag name    dkdjs-page
 *        ID          dkdjsPage        ← not optional
 *   4. Paste this file into the page code.
 *
 * ── Access ────────────────────────────────────────────────────────────────
 * You do NOT need to make this a members-only page. Both backend methods are
 * `Permissions.Admin`, so if anyone else finds the URL the page loads and
 * every call fails. The page is a form with no data in it.
 *
 * You do have to be logged in to your own site as the owner for it to work.
 *
 * ── Before it will work ───────────────────────────────────────────────────
 * Add your Anthropic API key in the Wix dashboard under Settings → Secrets
 * Manager, named exactly:  anthropicApiKey
 */

import wixLocation from 'wix-location';
import { SITE } from 'public/content';
import { PACKAGES, sellableAddons } from 'public/pricing';
import { parseEnquiry, applyIntake } from 'backend/intake.web';
import { inspectSchema, addHoldFields } from 'backend/schema.web';

$w.onReady(() => {
  const el = $w('#dkdjsPage');

  el.setAttribute('page', 'intake');
  el.setAttribute('config', JSON.stringify({
    phone: SITE.phone,
    email: SITE.email,
    images: {}
  }));

  el.on('navigate', (event) => {
    const url = event.detail && event.detail.url;
    if (url) wixLocation.to(url);
  });

  /* The option lists the review form needs. Built from the pricing module, so
     a package added there appears here without touching this file — and an
     add-on that is gated off (AVAILABLE.*) never appears at all, because
     sellableAddons() filters it out. */
  const packages = PACKAGES.map((p) => ({ id: p.id, name: p.name }));
  const addons = sellableAddons().map((a) => ({ id: a.id, name: a.name }));

  const blank = {
    stage: 'idle',
    check: null,
    checking: false,
    adding: false,
    applied: null,
    holdId: (wixLocation.query && wixLocation.query.hold) || '',
    text: '',
    proposal: {},
    flags: [],
    error: null,
    packages,
    addons
  };

  let state = { ...blank };

  const paint = (patch) => {
    state = { ...state, ...patch };
    el.setAttribute('intake', JSON.stringify(state));
  };

  paint({});

  el.on('resetintake', () => paint({ ...blank, holdId: state.holdId }));

  /* --- CMS setup panel ---------------------------------------------------
     Read-only check that every field the code writes to exists under the key
     it writes to. A CSV export cannot answer that: exports show display
     names, code uses keys, and Wix generates one from the other. */
  el.on('checkschema', async () => {
    paint({ checking: true, applied: null });
    try {
      const result = await inspectSchema();

      if (!result.ok) {
        /* A structured refusal, not a crash — show what it said. The usual
           one is 'api-unavailable', meaning the Collections API is not
           reachable on this site, which is a different problem from a
           collection being missing a field. */
        paint({
          checking: false,
          check: null,
          applied: `${result.reason}: ${result.detail || ''}`
            + (result.seen ? ` [elevate=${result.seen.elevate}, `
              + `collections=${result.seen.collections}, `
              + `keys=${(result.seen.keys || []).join('|')}]` : '')
        });
        return;
      }

      paint({ checking: false, check: result, applied: null });
    } catch (err) {
      /* The real message matters here. The usual cause is not being signed in
         as the site owner — inspectSchema is Permissions.Admin — but a
         backend that has not published yet fails the same way, and the two
         need telling apart. */
      console.error('[intake] inspectSchema failed', err);
      paint({
        checking: false,
        applied: 'Could not read the collections: '
          + ((err && err.message) || err)
          + ' — if that mentions permissions, sign in to dkdjs.com as the owner.'
      });
    }
  });

  el.on('applyschema', async () => {
    paint({ adding: true, applied: null });
    try {
      // false = do it for real. Called with no argument it only reports.
      const result = await addHoldFields(false);

      if (!result.ok) {
        paint({ adding: false, applied: result.detail || `Failed: ${result.reason}` });
        return;
      }

      const fresh = await inspectSchema().catch(() => null);
      paint({
        adding: false,
        check: fresh && fresh.ok ? fresh : state.check,
        applied: result.added && result.added.length
          ? `Added ${result.added.length} fields: ${result.added.join(', ')}`
          : 'Nothing was missing.'
      });
    } catch (err) {
      console.error('[intake] addHoldFields failed', err);
      paint({ adding: false, applied: 'The update failed. Nothing was changed.' });
    }
  });

  // 1. Read the email.
  el.on('parseintake', async (event) => {
    const detail = event.detail || {};

    /* Keep the paste and the hold id in state before anything else. If the
       request fails, the form repaints with his text still in it. */
    paint({ holdId: detail.holdId, text: detail.text, stage: 'busy', error: null, flags: [] });

    let result;
    try {
      result = await parseEnquiry(detail.text);
    } catch (err) {
      console.error('[intake] parseEnquiry failed', err);
      result = { ok: false, reason: 'network' };
    }

    if (!result.ok) {
      paint({ stage: 'idle', error: result.reason });
      return;
    }

    paint({ stage: 'review', proposal: result.proposal, flags: result.flags || [], error: null });
  });

  // 2. Save what he left on screen.
  el.on('saveintake', async (event) => {
    const patch = (event.detail && event.detail.patch) || {};

    if (!state.holdId) {
      paint({ stage: 'idle', error: 'missing-hold' });
      return;
    }

    paint({ stage: 'saving', proposal: patch, error: null });

    let result;
    try {
      result = await applyIntake(state.holdId, patch);
    } catch (err) {
      console.error('[intake] applyIntake failed', err);
      result = { ok: false, reason: 'error' };
    }

    if (!result.ok) {
      /* Back to review with HIS edits, not the original proposal — `patch` is
         already in state from the paint above. */
      paint({ stage: 'review', error: result.reason });
      return;
    }

    paint({ stage: 'saved', flags: result.flags || [], error: null });
  });
});
