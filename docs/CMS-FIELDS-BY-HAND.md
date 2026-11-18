# CMS fields — the manual list

Do this in the Wix CMS. No code, no permissions, no publishing.

## The one thing that matters

Code reads and writes by **field key**, not by the label you see. When you add
a field, Wix generates the key from the name you type.

So **type the key as the field name**. Where this doc says `eventType`, type
exactly `eventType` into the Field Name box — not "Event Type".

The Add Field panel shows the generated **Field Key**. Check it as you go. If
Wix has changed it (lower-cased it, or added a suffix because something
similar exists), edit the key so it matches this list exactly. One wrong
character and that field is invisible to the code, with no error anywhere.

These are internal collections — nobody but you ever sees these labels, so a
technical-looking name costs nothing.

---

## 1. Holds — add 22 fields

| Field name (type this exactly) | Type |
|---|---|
| `eventType` | Text |
| `venue` | Text |
| `city` | Text |
| `guestCount` | Number |
| `packageId` | Text |
| `addonIds` | Tags |
| `extraHours` | Number |
| `arrivalTime` | Text |
| `ceremonyTime` | Text |
| `receptionTime` | Text |
| `startTime` | Text |
| `finishTime` | Text |
| `setting` | Text |
| `agreedItems` | Tags |
| `clientProvides` | Tags |
| `agreementSignedAt` | Date and Time |
| `agreementId` | Text |
| `paymentId` | Text |
| `paymentAmount` | Number |
| `lastPaymentStatus` | Text |
| `transactionId` | Text |
| `paymentVerified` | Boolean |

**Times are Text, not Date and Time.** Deliberate: a time with no timezone is
safer stored as the string the customer wrote than as a timestamp someone has
guessed a zone for. Same reasoning as `eventDate` being Text.

`agreementSignedAt` **is** Date and Time — that one is a real instant, written
by the server.

---

## 2. Agreements — delete it and rebuild

Your current collection has the right eighteen concepts and good labels, but
the keys were generated from those labels, so `"Signed Hold"` became
`signedHold` while the code writes `holdId`. Roughly seven of eighteen match
by luck; the rest don't.

**The collection is empty**, so there is nothing to lose. Delete it and add it
again with these names.

| Field name (type this exactly) | Type |
|---|---|
| `title` | Text |
| `holdId` | Text |
| `leadId` | Text |
| `eventDate` | Text |
| `agreementKind` | Text |
| `packageId` | Text |
| `totalAmount` | Number |
| `retainerAmount` | Number |
| `signerName` | Text |
| `consentText` | Text |
| `agreementSnapshot` | Text |
| `termsVersion` | Text |
| `signerEmail` | Text |
| `nameOnRecord` | Text |
| `nameMatchesRecord` | Boolean |
| `signedAt` | Date and Time |
| `signerIp` | Text |
| `userAgent` | Text |

Permissions on this collection: **Admin only** for read, insert, update and
delete. The backend writes with `suppressAuth`, so nothing in a browser needs
access to it — and it holds signatures.

`consentText` and `agreementSnapshot` hold a couple of thousand characters
each. If Wix offers a long-text option, take it.

**Don't hand-edit rows in here once signatures start landing.** It's the
evidence.

---

## 3. Then, for Demi

On her hold (`8178bbd4-d9bb-4ee7-9e24-fef1245e3a92`), fill in at least:

- `packageId` — the agreement will not render without it
- `eventType` — `wedding`, so she gets the wedding agreement
- times, venue and city as you know them

Then `https://www.dkdjs.com/agreement?hold=8178bbd4-d9bb-4ee7-9e24-fef1245e3a92`
renders instead of saying "we are still putting your figures together".

**Also push `expiresAt` out on both live holds.** Demi's is 19 Nov, Bess's is
20 Nov. If they lapse the links start returning "expired".
