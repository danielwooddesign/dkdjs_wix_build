# DKDJS — Meta Titles & Descriptions

For the Wix **SEO Settings** panel on each page: *Page → SEO Basics → Title Tag / Meta Description*.

Limits used: title ≤ 60 characters, description ≤ 160. Google truncates past roughly that and the checklist flags it. Every one below is inside the limit — counts are shown so you can see the headroom if you want to edit.

---

## 1. Home — `/`

**Title** (52)
```
Wedding DJ & MC in Boise, Idaho | Daniel & Kathy DJs
```

**Description** (143)
```
A husband-and-wife DJ and MC team serving Boise and the Treasure Valley. Two of us at every event, one event a day, pricing published up front.
```

> Leads with `wedding DJ Boise` — your highest-value keyword — instead of the broader "Treasure Valley DJ Services" currently in place. The description front-loads the three things no competitor can copy.

---

## 2. Packages — `/packages`

**Title** (55)
```
DJ Packages & Pricing | Boise & Treasure Valley | DKDJS
```

**Description** (135)
```
Wedding DJ packages from $1,095 and party packages from $450. Every price, hour count and add-on is listed — no quote request required.
```

> Prices in the description are a click-through lever. Most Boise DJ sites hide pricing behind a form; saying you don't wins the click.

---

## 3. Check Availability — `/check-availability`

**Title** (52)
```
Check Your Date | Boise & Treasure Valley DJ | DKDJS
```

**Description** (135)
```
Tell us your date and we'll confirm whether it's open. We take one event per day across Boise, Eagle, Meridian and the Treasure Valley.
```

> No response-time promise, since that isn't a policy you've set.

---

## 4. About — `/about`

**Title** (53)
```
About Daniel & Kathy | Husband-and-Wife DJ Duo, Boise
```

**Description** (138)
```
Meet Daniel and Kathy, a married DJ and MC team based in Eagle, Idaho. Both of us work every event, start to finish, for one client a day.
```

---

## 5. Contact — `/contact`

**Title** (56)
```
Contact DKDJS | DJ & MC in Eagle, Idaho | (208) 972-1308
```

**Description** (133)
```
Call (208) 972-1308 or email contact@dkdjs.com. Daniel & Kathy DJs serve Boise, Eagle, Meridian, Nampa and the wider Treasure Valley.
```

> Phone number in the title is deliberate: it shows in the search result and some people call straight from it.

---

## 6. Weddings — `/weddings`

**Title** (50)
```
Wedding DJ & MC in Boise & Meridian, Idaho | DKDJS
```

**Description** (137)
```
Ceremony audio, introductions, dinner and a dance floor that fills. Wedding packages from $1,095 across Boise, Eagle, Meridian and Nampa.
```

> Carries two of your five checklist keywords (`wedding DJ Boise`, `wedding DJ Meridian Idaho`). This is the page that should rank for both.

---

## 7. Events — `/events`

**Title** (53)
```
Event & Party DJ in Boise, Idaho | Daniel & Kathy DJs
```

**Description** (139)
```
Birthdays, anniversaries, graduations and company parties. Private party packages from $595 and corporate from $895 in the Treasure Valley.
```

---

## 8. Karaoke — `/karaoke`

**Title** (54)
```
Karaoke DJ & Host in Boise, Idaho | Daniel & Kathy DJs
```

**Description** (142)
```
Hosted karaoke with wireless mics, on-screen lyrics and a host who keeps the list moving. Karaoke nights from $450 across the Treasure Valley.
```

> Least-contested keyword you own. Worth checking the slug is spelled `/karaoke` and not `/karoake` before this gets indexed.

---

## 9. Privacy Policy — `/privacy-policy`

**Title** (43)
```
Privacy Policy | Daniel & Kathy DJs | DKDJS
```

**Description** (137)
```
How DKDJS collects, uses and protects the information you share when you request a date hold or contact us. Effective September 17, 2026.
```

---

## 10. Terms & Conditions — `/terms`

**Title** (47)
```
Terms & Conditions | Daniel & Kathy DJs | DKDJS
```

**Description** (144)
```
The terms that apply when you book Daniel & Kathy DJs: retainers, balances, performance conditions and cancellations. New Ad City LLC DBA DKDJS.
```

---

## 11. Refund Policy — `/refund-policy`

**Title** (42)
```
Refund Policy | Daniel & Kathy DJs | DKDJS
```

**Description** (136)
```
How retainers, balance payments and cancellations are handled by New Ad City LLC DBA DKDJS. The $200 booking retainer is non-refundable.
```

---

## Notes

**Three legal pages should be set to "Hide from search results."** They have titles here because Wix's checklist wants every page filled in, and because a person occasionally does search "DKDJS refund policy." But they add nothing to rankings and they dilute how Google reads the site. Your call — either way the tags above are ready.

**Nothing here is invented.** Every price comes from `src/public/pricing.js`, the retainer terms from `POLICY`, the effective date from `LEGAL_CONFIG`, and the city list from `CITIES` in `content.js`. If you change a package price, the description on Packages, Weddings, Events or Karaoke goes stale — those four are the ones to revisit.

**Em dashes and the `|` character** are fine in Wix SEO fields. Curly apostrophes are fine too, but I used straight ones to avoid any copy-paste mangling.

**This does not replace the title tag the custom element sets.** If any page code calls `wixSeoFrontend` to set a title, that wins over the panel. Right now none of them do — they only set `seoMarkup` and structured data — so the panel is the single source. Worth remembering if that ever changes.
