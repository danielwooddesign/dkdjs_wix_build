# DKDJS — Decisions: Imagery, Plan Tier, SEO

Written 2026-09-12.

> **Pricing section superseded.** The draft ladder below ($1,295 / $1,895 /
> $2,495) was my proposal before Daniel's brief. **Live pricing is
> $1,095 / $1,595 / $2,095 per `master-brief.md` §14** and lives in
> `src/public/pricing.js`. The competitor research is kept because it is the
> evidence behind the "your pricing is low" note in `open-decisions.md` §E.

---

## 1. Imagery

Two very different uses of AI imagery, and only one is safe for a wedding
vendor:

| Safe | Not safe |
|---|---|
| Real equipment shot better — clean background, dramatic lighting, grade | Fake crowds on a fake dance floor presented as "our events" |
| Background removal, extending a cramped frame, fixing a blown ceiling | AI-generated "couples" implying real clients |
| Abstract atmosphere — light beams, bokeh, texture, hero backdrops | Any venue DKDJS hasn't actually worked |

Couples compare the site to the Google photos and the Instagram. A gap
between a packed 300-person ballroom on the site and a 90-person barn in the
review photos costs the booking. **AI-enhance real gear and use AI for
atmosphere. Do not manufacture events.**

**Workflow for equipment shots.** Shoot the gear in a dark room with the
lights on — phone is fine, tripod better. Then: **Adobe Firefly** is the most
defensible for commercial use (built around provenance and licensing);
**Google Gemini** is strongest at editing an existing photo; **ChatGPT** is
good for iterative back-and-forth. Midjourney and FLUX make the prettiest
pictures but are the wrong shape for "edit *this* photo of *my* speaker".

**Prompt pattern:** subject → lighting → atmosphere → camera language.
*"Professional DJ booth with LED facade, isolated on seamless black, single
hard rim light from camera left, haze in the air, magenta and cyan accent
lighting, 50mm, shallow depth of field, commercial product photography."*
Then iterate one variable at a time.

**Highest-impact shot not yet taken:** the two of them. An hour with a local
photographer at golden hour plus twenty minutes behind the booth does more
for bookings than any generated imagery, because the husband-and-wife angle
is the whole differentiator and cannot be faked.

## 2. Competitor pricing (evidence, not the plan)

| Competitor | Published rate |
|---|---|
| Directly Driven DJ | $2,300 / 5 hrs, +$150/hr, $500 non-refundable retainer |
| SwissMixx Audio (Nampa) | $2,500 reception-only (5 hr) · $3,400 ceremony+reception (7 hr) · $5,750 full day; 25% retainer, $500 min |
| The Knot (Meridian) | Most local DJs in the "$$ affordable" band; a handful "$$$$" |

The new-business problem: with no reviews, a couple choosing between two
vendors at the same price picks the one with sixty reviews. Price is the only
quality signal available — which cuts both ways, and is why pricing far below
the market can repel rather than attract.

## 3. Wix plan — upgrade required

| | Light | **Core** | Business |
|---|---|---|---|
| Accept online payments | No | Yes | Yes |
| Wix Bookings | No | Yes | Yes |
| Storage | 2 GB | 50 GB | 100 GB |

**Core is the minimum.** The hold/deposit step cannot exist on Light at all,
and 2 GB will not hold a photo- and video-heavy DJ site. Business tier only
matters if real ecommerce gets added. Scheduled jobs run hourly at best below
Elite — fine for follow-up email, not a reason to upgrade further. Verify in
the dashboard before paying; annual prepay saves 13–22%.

## 4. Local SEO

Ranking for a local service business is roughly: Google Business Profile >
reviews > location pages > everything else. Most of the work isn't on the
website.

**Off-site, do first**

- **Google Business Profile** — claim it, service-area business (not a
  storefront), list every city, categories "DJ" + "Wedding Service", post
  photos weekly. This is the map pack, and the map pack is most of local
  search.
- **Reviews** — ask after every event, with a direct link, within 24 hours.
  Target 10 in the first season.
- **Directories** — The Knot, WeddingWire, Zola, GigSalad, WeDJ, Yelp,
  Facebook. Identical name, address and phone everywhere; Google checks
  consistency. Couples genuinely shop there.

**On-site**

City pages, one per target, each with genuinely different content — local
venues named, local specifics. Google demotes the swap-the-noun version.
Venue pages later (`/venues/<venue>`) — couples search their booked venue
plus "DJ", and almost nobody in the Treasure Valley does this well.
`LocalBusiness` + `Service` JSON-LD with service area. Titles that name the
city and the service. Compress every image before upload.

**Timeline:** local SEO takes 3–6 months to move. Directories and GBP produce
leads in weeks. Do both; expect the listings to carry the first season.
