# Dropping this code into the Wix repo

These files are written against Wix CLI for Sites' repo layout, but they are
**not** a repo — they're the contents of `src/`, staged so they're ready the
moment your site populates `dkdjs_wix_build`.

## Order of operations

1. **Connect the site to GitHub from inside Wix Studio.** Code icon → Start
   Coding → GitHub Integration → Connect. Wix creates the structure and pushes
   it. Do not commit anything to the repo before this runs.

2. **Clone it and install:**
   ```bash
   git clone git@github.com:danielwooddesign/dkdjs_wix_build.git
   cd dkdjs_wix_build
   npm install
   npm install -g @wix/cli
   ```

3. **Create the CMS collections** listed in `COLLECTIONS.md`. The code will
   throw without them.

4. **Copy these files in:**
   ```
   src/public/pricing.js          → src/public/pricing.js
   src/public/dates.js            → src/public/dates.js
   src/backend/availability.web.js → src/backend/availability.web.js
   src/backend/jobs.config        → src/backend/jobs.config
   ```
   `HOME-PAGE-SNIPPET.js` is a snippet, not a file — paste it into the real
   page-code file Wix generated for the home page. Page files are named
   `{PageName}.{id}.js` and are managed by Wix; never create or rename them
   by hand.

5. **Add the elements** listed at the top of the home page snippet to the
   canvas in Studio, with those exact IDs.

6. **Test locally:**
   ```bash
   wix dev
   ```

## Things that will bite

- **`jobs.config` needs an hourly cron minimum** on every plan below Elite.
  `0 * * * *` is what's in the file — don't tighten it without checking your
  plan tier.
- **Payments need Core or above.** `requestHold` deliberately stops short of
  taking money: it records the lead and an unpaid hold. Wire Wix Pay to it
  once the plan is upgraded AND hold terms are signed off, then call
  `confirmBooking` from the success handler.
- **`POLICY` in `public/pricing.js` has deliberate nulls.** Hold amount,
  hold wording, refund window, travel allowance and balance-due timing are
  all undecided (brief §31). `policyReady(key)` tells the UI whether a value
  is safe to display. Do not fill these in to make a screen look finished.
- **`AVAILABLE` is now a kill switch, not a gate.** `ledBooth` and
  `secondUltimate` are ON per Daniel's 2026-09-14 call — the booth and the
  dual-Ultimate system are advertised. Flip one false if gear goes out for
  repair and every dependent package inclusion and add-on drops out of
  customer-facing copy automatically. `dancefloorEffects` stays OFF: brief
  §17 gates cold sparks on venue rules and insurance, not on delivery.
- **Imports are absolute**, always: `from 'public/pricing'`, `from
  'backend/availability.web'`. Relative paths silently fail in Velo.
- **Once GitHub is connected, code can only be edited locally**, not in the
  Wix editor. Design still happens in the Studio canvas.

## What this covers so far

- `public/pricing.js` — every package, add-on, the `POLICY` block and the
  estimate calculator. One source of truth; nothing hard-codes a price.
  Figures match the master brief §14-§17.
- `public/dates.js` — date handling that won't shift a wedding by a day.
- `public/equipment.js` — the full rig, the four venue configurations, and
  the LED booth use cases. Drives "Our Setup" (§23) and "What Comes With Us"
  (§11). Guest-count ranges are null pending Daniel's real coverage figures.
- `backend/availability.web.js` — `checkDate`, `requestHold`,
  `confirmBooking`, `expireStaleHolds`.
- `backend/jobs.config` — hourly hold expiry.

Not yet written: the booking-page estimator UI, the dynamic city pages, the
`LocalBusiness` JSON-LD, and the guest song-request portal.
