# DKDJS.com — Redesign & Feature Plan

Written 2026-09-12, before the master brief arrived. Site map and feature
analysis still hold; **where this disagrees with `master-brief.md`, the brief
wins.**

---

## 1. Where the site was on 2026-09-12

**Pages:** Home, Check Availability. That's it.

**Home page.** Strong brand asset in the neon logo — it should drive the whole
design system. The "More Than Music" intro is good, human, on-message. But the
Services section still contains Wix template placeholder text ("This is the
space to introduce the Services section"), several image placeholders are
empty, and "What we can offer for your special event:" has nothing under it.
No pricing, gallery, testimonials, audio samples, FAQ or About page.

**Check Availability page.** A well-built Wix Form: name, email, phone, event
date, type, venue, city, guest count, start/end time, a services checklist
and free text. It is the strongest conversion asset on the site. The weakness
is everything *before* it — a visitor has no reason yet to trust or price you.

**Assessment:** skeleton and brand are right; the site was ~20% complete. The
gap to a booking-generating site is content and proof, not technology.

## 2. What wins bookings for a DJ business

Ranked by impact on a couple shopping for a wedding DJ:

1. **Proof** — photos and video of real events, reviews with names and venues.
2. **Price transparency** — couples filter out vendors who hide pricing.
3. **Personality** — the husband-and-wife angle, in your own voice.
4. **Local SEO** — city + service terms are where free leads come from.
5. **Frictionless inquiry** — already present; add instant confirmation.

## 3. Feature list, sorted by how it gets built

**Native Wix, no code — do first**

Wix Forms with conditional fields · Automations (instant auto-reply, internal
alert, 3-day follow-up nudge) · Inbox/chat widget · Bookings for consultation
calls only · SEO tools · Google reviews widget · Analytics.

**Velo / code**

1. Dynamic service-area pages from one CMS collection.
2. Live availability checker (built).
3. Package/quote estimator wired to `estimate()`.
4. Lead pipeline in the CMS (schema built).
5. Client portal — timeline, must-play, do-not-play, announcements.
6. Guest song-request page + QR at the booth.
7. `LocalBusiness` / `Service` JSON-LD per page.
8. Custom element for a mix player.

**Not worth building**

Custom checkout — use Wix's. A custom CRM — the CMS-plus-automations version
is 5% of the work for 80% of the value. Heavy animation — it hurts mobile
load times and most traffic is phones.

## 4. Design direction

Neon-on-black from the logo. Use neon as accent and edge-glow only; neon pink
on black fails contrast at body-text sizes, so paragraphs stay white or
near-white. One bold display face, one highly legible sans, fluid type scale
rather than fixed sizes.

**Photography rules the layout.** Every section assumes a real event photo.
Until real photos exist the design cannot be finished — this is the critical
path.

Mobile-first: wedding vendor shopping happens on phones, at night. Design the
390px breakpoint first. One CTA everywhere. Sticky mobile bar with call +
check date.

## 5. How the code side works

Wix Studio offers three dev environments: the built-in editor, the Wix IDE,
and a local IDE via Git integration + Wix CLI. The third is the one in use.

Requirements: Git, Node 20.11+, npm/yarn, SSH key on GitHub, `@wix/cli`.

Two caveats: once connected to GitHub, site code can **only** be edited
locally, not in the Wix editor (design still happens in the Studio canvas);
and the connection fails if the site has Velo Packages installed — npm
packages are fine.

**Division of labor.** Daniel does layout, styling and content in the Studio
canvas. Claude writes page code, backend modules, CMS schemas, custom
elements, CSS for the Studio custom-CSS panel and SEO schema, and gives
step-by-step build instructions for anything that must be done by hand.
