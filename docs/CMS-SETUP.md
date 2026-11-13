# Creating the CMS collections

Three collections unblock the booking form. A fourth is for later.

**This is the last thing between your form and real enquiries.** Everything else
is built, tested and live. Right now a visitor who fills in your form gets
"call or text us" and you get nothing — the form is talking to a database that
does not exist.

Budget about 20 minutes.

---

## Before you start: two things that will silently break it

**1. Field keys, not field names.** When you add a field, Wix asks for a
*Name* ("Event Date") and derives a *Key* (`eventDate`). **The code matches on
the key.** Wix usually derives it correctly, but not always — it sometimes
produces `event-date` or `eventDate2` if a similar field existed. Every field
below lists the exact key. Check each one as you create it; there is usually a
small "Edit key" or field-settings option.

A wrong key does not throw an error. It writes the row with that field empty,
and you find out weeks later when a lead has no email address.

**2. `eventDate` is Text, not Date.** This looks wrong and is deliberate.

Wix stores Date fields in UTC. A wedding on Saturday 10 October in Idaho
(UTC-6) saved as a Date can come back as the 11th, or read as the 9th for a
visitor in another timezone. A wedding date is a calendar day, not an instant,
so it is stored as the string `2026-10-10` and compared as a string.
`src/public/dates.js` is the only place that converts between the two.

`expiresAt` on Holds **is** a real Date, because a hold expiring genuinely is a
moment in time.

---

## Where to do this

Wix dashboard → **CMS** → **+ Create Collection** → start from scratch.

Sandbox is off by default on new sites, so what you create is live. If you do
see a Sandbox toggle, leave it off — otherwise your form writes to live while
you are looking at sandbox, and it will seem like nothing is being saved.

---

## 1. `Leads` — do this one first

Collection name: **Leads**. This is the one that catches enquiries, and the
form is useless without it.

| Field name | Type | **Key must be** |
|---|---|---|
| Title | Text | `title` (Wix creates this automatically) |
| Name | Text | `name` |
| Email | Text | `email` |
| Phone | Text | `phone` |
| Event Date | **Text** | `eventDate` |
| Event Type | Text | `eventType` |
| Venue | Text | `venue` |
| City | Text | `city` |
| Guest Count | Number | `guestCount` |
| Start Time | Text | `startTime` |
| End Time | Text | `endTime` |
| Package Id | Text | `packageId` |
| Addon Ids | Tags | `addonIds` |
| Estimate Total | Number | `estimateTotal` |
| Notes | Text | `notes` |
| Source | Text | `source` |
| Status | Text | `status` |

**Permissions:** Settings → Permissions & Privacy → **Advanced**, then set
View, Add, Update and Delete all to **Admin**.

That looks too locked down for a form the public submits. It is correct. The
backend writes with `suppressAuth`, which runs as the site rather than as the
visitor. Setting Add to "Everyone" would let anyone on the internet write rows
directly into your database.

## 2. `Holds`

Collection name: **Holds**.

| Field name | Type | **Key must be** |
|---|---|---|
| Title | Text | `title` |
| Event Date | **Text** | `eventDate` |
| Lead Id | Text | `leadId` |
| Email | Text | `email` |
| Status | Text | `status` |
| Paid | Boolean | `paid` |
| Expires At | **Date and Time** | `expiresAt` |

**Permissions:** all four to **Admin**.

## 3. `Bookings`

Collection name: **Bookings**.

| Field name | Type | **Key must be** |
|---|---|---|
| Title | Text | `title` |
| Event Date | **Text** | `eventDate` |
| Lead Id | Text | `leadId` |
| Status | Text | `status` |

**Permissions:** all four to **Admin**.

## 4. `ServiceAreas` — not yet

Only needed when we build the city pages. Skip it for now; there is a spec in
`docs/COLLECTIONS.md` when the time comes.

---

## Test it properly

Creating the collections is not the same as them working. Do this:

1. Publish the site (collections are live immediately, but publish anyway).
2. Go to **dkdjs.com/check-availability**.
3. Pick a date well in the future — say a Saturday next year.
   **The date result should appear within a second or two**: "That date is
   open." If it still says "We could not check that just now", `Bookings` or
   `Holds` is missing or misnamed.
4. Fill in a name and your own email. Submit.
5. You should see **"Got it."** and the form should disappear.
6. Wix dashboard → CMS → **Leads**. There should be one row.

**Then check the row, field by field.** This is the step worth not skipping:

- Is `email` filled in, or empty?
- Is `eventDate` the date you picked, in `YYYY-MM-DD` form?
- Is `status` set to `new`?
- Is `guestCount` a number?

Any field that is empty when you typed something into it means that field's
**key is wrong**. Fix the key in the collection; no code change needed.

7. Check **Holds** — there should be a matching row with `status` = `active`,
   `paid` = false, and `expiresAt` about seven days out.

8. Delete both test rows.

---

## What still will not work, and why that is fine

**Taking payment.** `requestHold` deliberately records an unpaid hold and stops.
Hold amount, terminology and refund policy are still `null` in
`public/pricing.js`, and the code refuses to display or charge a figure you have
not decided. Once you settle those and upgrade the Wix plan, we wire Wix Pay to
it and call `confirmBooking` from the success handler.

**Hold expiry** runs hourly from `src/backend/jobs.config`, calling
`expireStaleHolds`. That starts working the moment `Holds` exists.

---

## If something goes wrong

**"We could not check that just now"** — `Bookings` or `Holds` is missing, or a
name is misspelled. The names are case-sensitive.

**Form submits but no row appears** — `Leads` is missing or misnamed.

**Row appears but fields are empty** — field keys do not match. Most common
problem, and the least obvious.

**Nothing at all happens on submit** — open the browser console on that page.
The page code logs `[availability] requestHold failed` with the real reason.
Send me what it says.
