# CMS collections to create

Create these in the Wix dashboard (CMS → Create Collection) **before** the code
runs — collections are not defined in the repo, they live in the site.

Permissions matter here. Get them wrong and either the code can't write, or
anyone on the internet can read your client list.

---

## `Bookings` — confirmed events

| Field key | Type | Notes |
|---|---|---|
| `title` | Text | Auto-filled, e.g. "Booking · 2026-10-10" |
| `eventDate` | **Text** | `YYYY-MM-DD`. Text, not Date — see below. |
| `leadId` | Text | Points back to the Leads row |
| `status` | Text | `confirmed` · `cancelled` |

**Permissions:** Read — *Admin*. Write — *Admin*. The backend reads it with
`suppressAuth`, so nothing needs public access.

---

## `Holds` — provisional, expiring

| Field key | Type | Notes |
|---|---|---|
| `title` | Text | "Hold · 2026-10-10" |
| `eventDate` | **Text** | `YYYY-MM-DD` |
| `leadId` | Text | |
| `email` | Text | |
| `status` | Text | `active` · `converted` · `expired` · `cancelled` |
| `paid` | Boolean | False until the $200 clears |
| `expiresAt` | Date and Time | Now + 7 days |

**Permissions:** Read — *Admin*. Write — *Admin*.

---

## `Leads` — the pipeline

| Field key | Type | Notes |
|---|---|---|
| `title` | Text | "Sarah Kemp · 2026-10-10" |
| `name` | Text | |
| `email` | Text | |
| `phone` | Text | |
| `eventDate` | **Text** | `YYYY-MM-DD` |
| `eventType` | Text | wedding · birthday · corporate · karaoke · other |
| `venue` | Text | |
| `city` | Text | |
| `guestCount` | Number | |
| `startTime` | Text | |
| `endTime` | Text | |
| `packageId` | Text | Matches an id in `public/pricing.js` |
| `addonIds` | Tags | |
| `estimateTotal` | Number | What the estimator showed them |
| `notes` | Text | |
| `source` | Text | website · referral · the-knot · instagram |
| `status` | Text | `new` · `quoted` · `booked` · `lost` |

**Permissions:** Read — *Admin*. Write — *Admin*.

This collection is your CRM. Sort by `eventDate`, filter by `status`, and you
have a pipeline without paying for one.

---

## `ServiceAreas` — drives the city pages

| Field key | Type | Notes |
|---|---|---|
| `title` | Text | "Meridian" |
| `slug` | Text | `meridian` — becomes `/dj/meridian` |
| `heading` | Text | "Wedding DJ in Meridian, Idaho" |
| `intro` | Rich text | **Genuinely different per city.** See warning below. |
| `venues` | Tags | Local venues you'd name |
| `driveMinutes` | Number | For the travel calculation |
| `heroImage` | Image | |
| `seoDescription` | Text | |

**Permissions:** Read — *Anyone*. Write — *Admin*.

> **Do not** write one paragraph and swap the city name. Google demotes
> templated doorway pages, and it's the single most common way local service
> sites waste this technique. Each city needs real local content — venues
> you've actually played or would play, drive time, something true about
> events there.

---

## Why `eventDate` is Text, not Date

Wix stores Date fields in UTC. A wedding on Saturday 10 October in Idaho
(UTC-6) saved as a Date can come back as the 11th — or read as the 9th for
someone browsing from another timezone. A wedding date is a calendar day, not
a moment in time, so it's stored as the string `2026-10-10` and compared as a
string. `src/public/dates.js` is the only place that converts between the two.

`expiresAt` on `Holds` *is* a real Date, because a hold expiring is a genuine
instant.
