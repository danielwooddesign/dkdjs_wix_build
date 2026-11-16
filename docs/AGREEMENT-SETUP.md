# Booking agreements + e-signature — setup

Two agreements, one signing page, everything stored in your own CMS.

The customer gets **one link**. It shows their booking in writing, takes their
signature, and sends them straight on to the retainer. Nothing leaves Wix.

```
/agreement?hold=<holdId>   →  read, sign  →  /pay?hold=<holdId>  →  booked
```

---

## 1. Why there are only two agreements, and why they're short

**Wedding Booking Agreement** and **Event Booking Agreement** (parties,
corporate, karaoke). Their legal weight is identical. They differ only in
which event facts get pinned down — a wedding needs a ceremony time and a
reception time; a karaoke night needs a start time and a curfew.

Neither one restates your terms. Both say, in one section:

> This booking is governed by the DKDJS LLC Terms & Conditions and
> Cancellation & Refund Policy published at dkdjs.com, in the version dated
> November 15, 2026 … They are part of this agreement.

Your Terms page already contains the whole commercial agreement — what you
provide, what you need from the client, timings and overtime, travel, music,
photos, conduct, force majeure, liability, Idaho governing law. It already
says *"The terms that apply to your booking are the ones published when you
booked."* So the agreement incorporates it rather than duplicating it.

That buys you two things. A one-page agreement actually gets read. And the
contract can never contradict the website, because there's only one copy of
the terms.

---

## 2. CMS fields you have to add first

**This is not optional and it fails silently.** Wix drops fields that aren't
defined in the collection, with no error anywhere. If you skip these,
signatures will appear to save and simply won't be there.

### New collection: `Agreements`

Permissions: **Admin only** for read and write. The backend writes with
`suppressAuth`, so nobody needs browser access to it.

| Field key | Type | What it is |
|---|---|---|
| `title` | Text | Auto-built label |
| `holdId` | Text | Which hold was signed |
| `leadId` | Text | Links back to the enquiry |
| `eventDate` | Text | `YYYY-MM-DD` — **Text, not Date** |
| `agreementKind` | Text | `wedding` or `event` |
| `packageId` | Text | What they booked |
| `totalAmount` | Number | The total they agreed to |
| `retainerAmount` | Number | $200 |
| `signerName` | Text | What they typed. This is the signature |
| `consentText` | Text | The exact sentence they ticked |
| `agreementSnapshot` | Text | The whole agreement as plain text |
| `termsVersion` | Text | Which version of your Terms applied |
| `signerEmail` | Text | |
| `nameOnRecord` | Text | The name on the enquiry |
| `nameMatchesRecord` | Boolean | False is normal — see §5 |
| `signedAt` | Date and Time | Server time, not the browser's |
| `signerIp` | Text | Observed by your server |
| `userAgent` | Text | Their browser. Corroborating only |

Set `agreementSnapshot` and `consentText` to a **long text** field if Wix
offers the choice — the snapshot runs to a couple of thousand characters.

### Add to the existing `Holds` collection

| Field key | Type | Why |
|---|---|---|
| `packageId` | Text | **The agreement will not render without this** |
| `addonIds` | Tags | Add-ons you quoted |
| `extraHours` | Number | |
| `ceremonyTime` | Text | Weddings |
| `receptionTime` | Text | Weddings |
| `startTime` | Text | Everything else |
| `finishTime` | Text | |
| `agreementSignedAt` | Date and Time | |
| `agreementId` | Text | |
| `arrivalTime` | Text | When you arrive to set up |
| `setting` | Text | Indoors / Outdoors / Both |
| `agreedItems` | Tags | **Prints into the contract as promises** |
| `clientProvides` | Tags | Prints as things you are not bringing |
| `eventType` | Text | Decides which agreement they get |
| `venue` | Text | |
| `city` | Text | |
| `guestCount` | Number | |

The last four also exist on `Leads`. The hold's value wins when both are set,
because the hold is what you corrected.

And, if you haven't added them from the payments work: `paymentId` (Text),
`paymentAmount` (Number), `lastPaymentStatus` (Text), `transactionId` (Text),
`paymentVerified` (Boolean).

---

## 3. Pages to create in the editor

### `/agreement`

1. New page, slug **`agreement`**
2. SEO panel → **turn indexing OFF**. This page shows a customer's name,
   venue and price. It must never reach Google.
3. Add the custom element:
   - Velo file `dkdjs-page.js`
   - Tag name `dkdjs-page`
   - **ID `dkdjsPage`** — a missing ID has silently broken a page twice on
     this build. The element falls back to its baked defaults and shows the
     wrong thing with no error anywhere.
4. Paste `docs/AGREEMENT-PAGE-SNIPPET.js` into the page's code file.

### `/pay`

Still not created. Same three steps, slug `pay`, indexing off, ID
`dkdjsPage`, paste `docs/PAY-PAGE-SNIPPET.js`.

### HTTP function

`src/backend/http-functions.js` is new. It publishes automatically — no
editor step. After publishing, the endpoint is:

```
POST https://www.dkdjs.com/_functions/sign
```

Test it's live by visiting `https://www.dkdjs.com/_functions/sign` in a
browser — a GET should return an error, not a 404. A 404 means the backend
file didn't publish.

---

## 4. How you send a booking

1. The enquiry lands in `Leads`.
2. You create the `Holds` row for the date (you're already doing this).
3. **Fill in `packageId`** on that row, plus any `addonIds` and the times.
4. Copy the hold's `_id` and send:
   `https://www.dkdjs.com/agreement?hold=<that id>`
5. They read, sign, and land on the pay page. When the retainer clears, the
   hold becomes a confirmed `Bookings` row automatically.

If you send the link before step 3, the page tells them *"We are still
putting your figures together"* rather than showing a contract with a blank
total. That's deliberate — an agreement whose only real content is the price
shouldn't render without one.

---

## 5. What's stored, and why those fields

ESIGN (federal) and Idaho's UETA both make an electronic signature as good as
ink, provided four things are true. Each one maps to a stored field:

- **Intent to sign** — `signerName`, typed by them, under a label saying
  "This is your signature."
- **Consent to sign electronically** — `consentText`, the exact sentence they
  ticked. The tick is a hard stop; an unticked box is refused server-side.
- **Association with the record** — `agreementSnapshot`, the full agreement as
  it appeared to them. Six months from now the question isn't "what do our
  terms say" but "what did *this person* agree to." This answers it even if
  the website has changed since.
- **Retention** — the signed page re-renders the whole agreement with a
  **Print or save a copy** button.

`nameMatchesRecord: false` is **normal, not a red flag.** The person who
fills in the enquiry form is often not the person whose legal name goes on
the agreement — for weddings that's the usual case. The name you already had
is stored next to the typed one so you can see the difference rather than the
system blocking a legitimate signer.

**Don't hand-edit rows in `Agreements`.** It's the evidence. If something's
wrong, add a note elsewhere and leave the row alone.

---

## 6. Things still open — your call

1. **No attorney has read any of this.** You decided that on 15 Nov and
   that's a reasonable call at this stage. What it means concretely: the
   plumbing is sound and the four ESIGN requirements are met, but whether
   your Terms actually protect you in a dispute is a different question from
   whether the signature is valid. Worth $200–400 of a local attorney's time
   once money is flowing.

2. **The customer signs; you don't countersign.** Normal for vendor
   contracts — your acceptance is evidenced by taking the retainer. Say the
   word if you want a countersignature step.

3. **No email copy is sent.** The print button covers the retention
   requirement, but most people won't use it. If you want them emailed a
   copy, that's a Wix triggered email you build in the dashboard — tell me
   and I'll wire the send into the sign flow.

4. **Custom-quoted packages can't use this page.** The residency has no
   computable total, so `buildAgreement` refuses it. Those stay manual.

5. **A forged payment callback remains possible.** Unchanged from the
   payments work: Velo has no server-side webhook, so a reported success is
   written with `paymentVerified: false` for you to match against the Wix
   Payments dashboard. Signing doesn't change that.

---

## 7. The intake page — reading emails into a booking

`/intake` lets you paste a customer email and get the contract fields back,
instead of retyping them. It proposes; it never saves on its own.

### Before it works

1. Get an API key from `console.anthropic.com`.
2. Wix dashboard → **Settings → Secrets Manager** → add a secret named
   exactly **`anthropicApiKey`**.
3. Create the page: slug `intake`, indexing **OFF**, element ID `dkdjsPage`,
   paste `docs/INTAKE-PAGE-SNIPPET.js`.

You don't need to make it a members-only page. Both backend methods are
`Permissions.Admin`, so anyone else who finds the URL gets a form where every
button fails. You do need to be logged in to your own site as the owner.

Cost is roughly a cent or two per email.

### What it will and won't do

**It extracts facts** — date, venue, city, guests, times, indoor/outdoor —
and suggests a package and add-ons when the email is unambiguous.

**It never touches money.** There is no price, total or discount field in the
schema it fills. Prices come from the pricing module and nowhere else. If a
customer writes a figure, it comes back as a line of text for you to read,
flagged.

**It extracts requests, not agreements.** Everything the customer asked for
arrives in its own list with the tickbox **unticked**. A request becomes a
promise in the contract only when you tick it. That default is deliberate —
the alternative is a system whose resting state is promising everything
anyone asks for.

**It can't change the date.** The hold date is what the calendar, the
availability check and the booking all key on. If the email disagrees with
the hold, you get a warning and the hold is left alone.

### Why you still read every field

The email is written by a stranger, and anything a stranger writes can
contain instructions aimed at the parser — deliberately, or because they
forwarded a thread containing something odd. Three things stand between that
and your contract:

1. The model is told the message is data, not instructions.
2. **Every field is checked against what you actually sell.** An unknown
   package id, an add-on that isn't available yet, a time it couldn't read, a
   guest count over 5,000 — all dropped, all reported in the warnings box.
3. **Nothing is written until you press Save**, and the save re-runs every
   check from scratch rather than trusting what the browser sends back.

That's three layers, and they're good ones, but none of them knows what you
meant to agree to. Read the proposal against the email. It takes thirty
seconds and it's the only step that catches a plausible-but-wrong field.

### The flow end to end

```
email  →  /intake  →  check and tick  →  save to hold
                                            ↓
                          /agreement?hold=<id>  →  sign  →  /pay  →  booked
```
