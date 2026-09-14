# DKDJS build log

Running record of what's been built and what's blocked. Newest first.

---

## 2026-09-14 — master brief received; moving to Claude Code

**Brief.** Daniel delivered the full 41-section master build brief. All
pricing, positioning, navigation, equipment and priority decisions now come
from it. Saved to `docs/context/master-brief.md`.

**Code updated to match the brief**

- `public/pricing.js` rewritten: brief pricing ($1,095 / $1,595 / $2,095),
  full LED booth add-on family, non-wedding rates, restaurant residency as
  custom-priced.
- Added `POLICY` block. Hold amount, hold terminology, refund window, travel
  allowance and balance-due timing are all `null` — undecided per §31, and
  `policyReady()` stops any of them rendering as a guess.
- Added `AVAILABLE` flags. Per Daniel's 2026-09-14 call the LED booth and
  the second JBL PartyBox Ultimate are advertised now, so both are ON. Cold
  sparks stay OFF — that gate is insurance and venue rules, not delivery.
- New `public/equipment.js`: full rig inventory, four venue configurations
  (Intimate / Standard reception / Large venue / Ceremony + reception), LED
  booth use cases, and the JBL brand-safety line. Guest ranges left `null` —
  venue-capacity claims are on the brief's do-not-invent list.
- `availability.web.js` now reads `POLICY.eventsPerDay` and no longer implies
  any refund terms.

**Flagged to Daniel, not decided**

- Brief pricing sits below half of SwissMixx's published $3,400 and well
  under Directly Driven's $2,300/5hr. Suggested keeping it as a time-boxed
  founding-season rate rather than the standing price.
- Liability insurance / COI — many venues require it before load-in. Business
  blocker, not a website one.
- Google Business Profile absent from the brief entirely; it's the map pack
  and arguably the highest-ROI item for a local service business.
- SEO at priority §40 #18 is too late — titles, meta and schema should be
  written as each page is built.
- Restaurant karaoke residencies are treated as secondary; they're recurring
  revenue with a one-week sales cycle versus 18 months for weddings.

**Moved to Claude Code.** Cowork session was bound to the laptop, so the
desktop's `G:\DKDJS` was unreachable. Handoff bundle created with `CLAUDE.md`
plus `docs/context/`.

---

## 2026-09-12 — audit, plan, design concept, first code

- Audited dkdjs.com: two pages, Wix placeholder copy still in the Services
  block, no pricing, gallery, reviews or About page.
- Redesign plan → `redesign-plan.md`.
- Imagery / pricing / plan-tier / SEO decisions → `decisions.md`.
- Design concept published as a Claude artifact: desktop home, mobile home,
  packages & pricing, booking flow step 2. Neon-on-black from the existing
  logo; Anton + Barlow.
- First Velo code: `pricing.js`, `dates.js`, `availability.web.js`,
  `jobs.config`, CMS schema spec, hero date-checker page code. Pricing and
  date modules unit-tested; `jobs.config` validated.
- Repo `dkdjs_wix` was empty; replaced by `dkdjs_wix_build`.
