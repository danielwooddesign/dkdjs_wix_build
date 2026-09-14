# DKDJS.com — project context

Website build for **Daniel & Kathy DJs** (DKDJS.com), a husband-and-wife DJ
and event entertainment business serving Boise and the Treasure Valley, Idaho.

Platform: **Wix Studio**, developed through **Git integration + Wix CLI for
Sites**. Visual design happens in the Studio canvas; code happens here.

Owner: Daniel Wood · webmaster@danielwooddesign.com
Repo: `github.com/danielwooddesign/dkdjs_wix_build`

---

## The one rule that overrides everything

**Do not invent customer-facing policies, services, equipment, pricing,
booking rules, cancellation rules, refund terms, venue-capacity claims,
travel policies, insurance claims, or technical capabilities** — not even
when inventing one would make the build easier or a screen look finished.

If a business decision isn't defined in `docs/context/`, **flag it for Daniel
rather than silently deciding it.** Open items live in
`docs/context/open-decisions.md`; add to that file rather than guessing.

This rule comes from Daniel's master brief and it is the single most
important instruction in this repo.

---

## Where things are

| Path | What |
|---|---|
| `src/public/pricing.js` | Every package, add-on, and the `POLICY` block. **Single source of truth for money.** |
| `src/public/equipment.js` | The rig, the four venue configurations, LED booth use cases. |
| `src/public/dates.js` | Date handling. |
| `src/backend/availability.web.js` | `checkDate`, `requestHold`, `confirmBooking`, `expireStaleHolds`. |
| `src/backend/jobs.config` | Hourly hold expiry. |
| `docs/context/` | The master brief, the redesign plan, decisions, open questions, build log. **Read these first.** |
| `docs/COLLECTIONS.md` | The CMS collections and their permissions. Create in the Wix dashboard, not in code. |
| `docs/SETUP.md` | Order of operations for wiring this into the Wix repo. |

---

## Conventions that matter

**Never hard-code a price.** Every dollar figure on the site comes from
`PACKAGES` / `ADDONS` in `public/pricing.js`. This is an explicit requirement
(brief §14), not a style preference.

**Undecided policy is `null`, not a plausible default.** `POLICY` in
`pricing.js` holds hold amount, hold terminology, refund window, travel
allowance and balance-due timing. Several are `null` on purpose. Use
`policyReady(key)` to decide whether a value is safe to display. Filling one
in to make a screen look complete violates the rule above.

**Event dates are `YYYY-MM-DD` strings, never Date objects.** Wix stores Date
fields in UTC; a 10 October Idaho wedding can come back as the 11th, or read
as the 9th for a visitor in another timezone. A wedding date is a calendar
day, not an instant. `public/dates.js` is the only place that converts.

**`AVAILABLE` in `pricing.js` is a kill switch.** Flip a flag false and every
package inclusion and add-on that depends on that gear drops out of
customer-facing copy automatically. `ledBooth` and `secondUltimate` are ON.
`dancefloorEffects` (cold sparks) is OFF — gated on venue rules and
insurance, not on delivery.

**Imports are absolute.** `from 'public/pricing'`, `from
'backend/availability.web'`. Relative paths silently fail in Velo.

**Page code files are managed by Wix.** `src/pages/{PageName}.{id}.js` is
created when a page is added in the Studio editor. Never create, rename or
delete one by hand.

**Availability is answered server-side.** The Bookings collection is private;
a visitor learns only "open" or "taken" — never who booked a date or how full
the calendar is.

---

## Brand voice

"Fun, professional music and entertainment without the nightclub-DJ
attitude." The differentiator is that clients get **both Daniel and Kathy**,
every event, from planning through the last song.

Should feel: professional, modern, fun, personal, dependable, premium without
being pretentious.

Should not feel: nightclub promoter, EDM production company, faceless
multi-DJ booking agency, bargain DJ site, technical AV catalog.

Never write copy attacking other DJ companies.

Palette: near-black ground, white body text, hot pink `#FF2E9A` primary
accent (CTAs), cyan `#3FE0F0` secondary. One bold display face for headings,
one highly readable sans for body. Mobile-first — most traffic is phones.

---

## Current state

Built: pricing/policy module, equipment module, date handling, availability
backend, hourly hold-expiry job, CMS schema spec, hero date-checker page code.

Not built: booking-page estimator UI, dynamic city pages, `LocalBusiness`
JSON-LD, guest song-request portal, client portal.

Blocked: payments need the Wix plan upgraded from Light to **Core** (Light
cannot accept payments at all, and its 2 GB storage won't hold a photo-heavy
DJ site). Hold amount and terminology are undecided, so the booking flow
cannot go live.

Highest-priority non-website item: **liability insurance / certificate of
insurance.** Many wedding venues require a COI from vendors before load-in.

---

## Working with Daniel

**Windows / PowerShell.** Daniel works on a Windows laptop (`surfacepro11`).
**Every command he needs to run goes in a fenced `powershell` code block,
ready to copy and paste** — never inline in prose, never bash syntax, never a
command split across explanatory sentences. Use PowerShell idioms
(`Set-Location`, `New-Item -ItemType Directory -Force`, `$env:VAR`), not
`cd && mkdir -p`.

**Every block is self-contained and starts with an explicit `Set-Location`.**
PowerShell opens at `C:\WINDOWS\system32`, and Daniel pastes blocks
individually — sometimes out of order, sometimes into a fresh window. Never
assume the working directory left behind by an earlier block. If a block
needs a directory that may not exist yet, create it in the same block
(`New-Item -ItemType Directory -Force -Path <path> | Out-Null`) before
changing into it.

He runs the commands; this session can read and write files on the laptop but
cannot execute anything there. When something fails, work from the terminal
output he pastes back.

## Working here

```powershell
Set-Location C:\dev\dkdjs_wix_build
npm install
npm install -g '@wix/cli'
wix dev
```

Scheduled jobs run hourly at best on every plan below Elite — don't tighten
the cron in `jobs.config` without checking the tier.

Keep the cloned repo **outside OneDrive**. OneDrive plus `node_modules` means
sync churn, occasional `.git` lock conflicts, and Files On-Demand leaving
files cloud-only that the CLI expects on disk.
