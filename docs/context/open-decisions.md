# DKDJS — Open decisions for Daniel

Per the master brief's rule: business decisions not defined in the brief get
flagged, never silently decided. This is that list. Add to it rather than
guessing.

Last updated 2026-09-14.

---

## A. Decisions already made that need sign-off

Live in the code right now.

| # | Decision | Where | Why |
|---|---|---|---|
| A1 | **One event per calendar day** | `POLICY.eventsPerDay = 1` | "You get the two of us, every time" can't survive two same-day events. But the brief never states it. If a Saturday morning ceremony plus an evening reception is acceptable, this is wrong. |
| A2 | **Holds expire after 7 days** | `HOLD_EXPIRY_DAYS` in `availability.web.js` | Operational only, so dates don't lock forever. Not a refund window, never shown to a customer. Needs a real number once policy exists. |
| A3 | **Event dates stored as text, not Date** | `public/dates.js` | Wix stores Dates in UTC; a 10 Oct Idaho wedding can read as the 11th. Technical, not a business call — logged for the record. |

## B. Undecided — code has `null`, nothing displays

`POLICY` keys in `public/pricing.js`. `policyReady(key)` returns false, so no
screen renders a guess.

| # | Decision | Why it matters |
|---|---|---|
| B1 | **Hold amount** | The entire primary funnel (§27) ends here. Nothing goes live without it. |
| B2 | **What it's called** — deposit / retainer / date hold | Not cosmetic. The words carry different refundability implications, and a non-refundable *deposit* is unenforceable under some readings. Worth an Idaho attorney, or at minimum a proper event-vendor contract template. Claude is not a lawyer and won't draft it. |
| B3 | **Refundable, and for how long** | Drives copy at the highest-anxiety moment in the funnel. |
| B4 | **Balance due date** | Competitors use 14 days out (SwissMixx) and "at second consultation" (Directly Driven). |
| B5 | **Travel policy** — minutes included, cost beyond | §28 lists "travel if applicable" but no policy exists. The estimator shows "Quoted" for everyone — honest but weak. |
| B6 | **What happens if one of them is ill** | "You get the two of us, every time" is a promise. Couples will ask. Needed before the FAQ page. |
| B7 | **Venue coverage per configuration** | `CONFIGURATIONS` in `public/equipment.js` has four setups with `guestRange: null`. Venue-capacity claims are on the do-not-invent list. Daniel knows what the rig actually covers. |

## C. Gaps that could block real bookings

| # | Gap | Risk |
|---|---|---|
| C1 | **Liability insurance / COI** | Many wedding venues *require* a certificate of insurance from vendors before load-in. Without it some venues refuse the booking outright, regardless of the website. Business blocker, not a website one. Highest priority on this page. |
| C2 | **Google Business Profile** | Absent from the brief entirely. For a local service business it's arguably the highest-ROI asset, and it isn't on the site — it's the map pack. Step 0, before the homepage. |
| C3 | **Contract / terms content** | §4 lists a Terms page; no decisions about contents. |
| C4 | **Power / venue requirements** | Affects quoting and the FAQ. |
| C5 | **Response-time promise** | The site should commit to something ("every inquiry answered within 24 hours"). Currently unstated. |

## D. Internal conflicts in the brief

| # | Conflict | Status |
|---|---|---|
| D1 | §12 forbids advertising equipment not yet owned; §13 writes customer-facing copy for the LED booth. | **RESOLVED 2026-09-14 — Daniel's call.** §12 restriction lifted. Booth and second JBL PartyBox Ultimate are advertised now; `AVAILABLE.ledBooth` and `AVAILABLE.secondUltimate` both `true`. The switch stays as a kill switch for gear out of service. |
| D2 | Nav (§4) has no Line Dancing, but §10 makes it a homepage card and §21 gives it a page. | **Open.** Suggest folding into Events or Karaoke, with the homepage card deep-linking to a section. |
| D3 | §17 lists "Premium dance-floor effects", then forbids advertising cold sparks until equipment, venue restrictions, insurance and operations are handled. | **Still gated.** `AVAILABLE.dancefloorEffects = false`. Different gate from the booth — insurance and venue rules, not a delivery date. |
| D4 | §26 says feature 3 homepage reviews; there are none, and §26 forbids inventing them. | Ship without the section rather than with an empty one. See F. |

## E. Pricing observation

Brief pricing is in the code as-is. Two notes:

1. **The ladder is well built.** Each tier is +$500 for roughly $1,000 of
   listed value, which pushes couples up. It works.
2. **The market position is very low.** SwissMixx publishes $3,400 for
   ceremony+reception; Directly Driven is $2,300 for 5 hours. The Full Day at
   $1,595 with ceremony audio *and* the LED booth is less than half of
   SwissMixx. With no reviews yet, price is the only quality signal a couple
   has — and being dramatically cheapest repels a real segment of the wedding
   market rather than attracting it. It also under-monetizes the booth, the
   one thing no local competitor appears to have.

   Suggested: keep these as a **time-boxed founding-season rate** ("booking
   now through [date]") rather than the standing price. Same cash flow, no
   permanent low anchor, clean reason to raise later.

## F. Launch credibility with no reviews

Instead of an empty testimonials slot:

- A founding-client offer, stated plainly.
- Named venue and vendor references, if any exist.
- Photos of real setups — the equipment is real even if the roster is short.

Do not use stock "happy couple" imagery in a slot that reads as social proof.

## G. Equipment as advertised from 2026-09-14

Held in `public/equipment.js`.

- **Main sound:** JBL PartyBox Ultimate ×2, 1100W each
- **Room fill:** JBL PartyBox Stage 320 ×2, JBL PartyBox Encore ×2 (~100W each)
- **Lighting:** JBL PartyLight Stick ×4, JBL PartyLight Beam ×2
- **Booth:** curved LED video DJ booth
- **Mics:** JBL wireless microphones
- **Support:** professional speaker stands, backup mics/cables/critical audio

Setup scales by venue — four named configurations, guest ranges pending (B7).
`BRAND_NOTE`: DKDJS owns and operates JBL equipment and is not sponsored by,
affiliated with or endorsed by JBL or Harman.
