# Test run — agreement, signature, payment

Work top to bottom. Everything down to step 6 is free.

---

## 1. Prepare the test hold

Find the Hold your form submission created (`Holds`, status `active`, newest).
Copy its **ID**. Then set on that row:

- `eventType` → `wedding`
- `packageId` → `full-day`

The wedding agreement has the most sections, so it's the better one to test.

**Before signing**, you can preview the other template free: change
`eventType` to `party`, reload the agreement page, look, then change it back.
No signature, no cost.

---

## 2. Read the agreement

Open `https://www.dkdjs.com/agreement?hold=<ID>`

Check, as a customer would:

- [ ] Parties — DKDJS LLC, Idaho, 715 N Synergy Way. Your details, not placeholder
- [ ] Event section shows the date in words, not `2028-01-01`
- [ ] "What you are booking" lists the package and every add-on
- [ ] Total is right, retainer is $200, balance is total minus 200
- [ ] "due 14 days before your event"
- [ ] The three policy links open the real pages
- [ ] Nothing promises something you don't do

If anything reads wrong, stop. That text is what gets stored as the signed
record, and it's what a dispute would turn on.

---

## 3. Sign it

Type your full name, tick the consent box, submit.

Try these first — both should be refused, in the page, not silently:

- [ ] One word in the name box → asks for first and last name
- [ ] Name filled, box unticked → asks you to tick it

Then sign properly.

---

## 4. Check the signature landed

In `Agreements`, a new row:

- [ ] `signerName` — what you typed
- [ ] `signedAt` — server time
- [ ] `signerIp` — **not empty.** This is the one that proves the HTTP
      function is doing its job; a web module cannot see an IP
- [ ] `agreementSnapshot` — the **whole** agreement as plain text
- [ ] `consentText` — the exact sentence you ticked
- [ ] `termsVersion` — November 15, 2026
- [ ] `nameMatchesRecord` — true or false, either is fine

In `Holds`, the same row now has:

- [ ] `agreementSignedAt`
- [ ] `agreementId` pointing at the Agreements row

---

## 5. Reload the agreement link

- [ ] It shows the signed version, not the form again
- [ ] The whole agreement is still displayed
- [ ] "Print or save a copy" works — this is the retention requirement
- [ ] It does **not** offer to sign a second time

---

## 6. The pay page — cancel first

You should have been sent to `/pay?hold=<ID>` automatically.

- [ ] Shows your date and **$200**
- [ ] Says the retainer is non-refundable and comes off the total
- [ ] Mentions the 14-day balance

Press **Pay $200**, let the Wix payment window open, then **cancel it**.

Now check the Hold — this is a negative test and it matters:

- [ ] `paymentId` is set, `paymentAmount` is 200
- [ ] `status` is still `active`, `paid` still false
- [ ] **No new row in `Bookings`**

A cancelled payment must never book the date. If a Bookings row appeared,
stop and tell me.

---

## 7. The real payment

Press **Pay $200** again and pay with your own card.

- [ ] Page shows "That date is yours."

Then check `Holds`:

- [ ] `status` → `converted`, `paid` → true
- [ ] `lastPaymentStatus` → `Successful`
- [ ] `transactionId` populated
- [ ] `paymentVerified` → **false**

That last one is correct and deliberate. Velo has no server-side payment
webhook, so the only word that money arrived comes back through the browser,
and a browser can lie. The flag means *you* confirm it against the Wix
Payments dashboard. It is the one manual step in the whole flow, and it is
there on purpose.

`Bookings` should have a new row:

- [ ] `status` `confirmed`, `eventDate` right, `retainerPaid` 200

And the `Leads` row should now read `booked`.

---

## 8. Reconcile

Wix dashboard → payments. Find the $200 and confirm it's really there. That's
the habit `paymentVerified` exists to create.

---

## 9. Clean up — don't skip this

**Refunding does not undo any of the above.** The CMS rows stay exactly as
they are, and the Booking will block that date forever.

1. Refund the $200 in the Wix dashboard
2. Delete the test row from `Bookings` — **this one matters most**
3. Delete the test `Holds` row
4. Delete the test `Leads` row
5. Delete the test `Agreements` row

Then confirm the test date is bookable again on `/check-availability`.
