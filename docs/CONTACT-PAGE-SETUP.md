# Creating the Contact page — step by step

**Read the order first.** It runs opposite to how we've been working, and getting
it backwards is what will waste your time.

Everywhere else this session, `wix dev` was the enemy — it kept reverting files I
wrote. Here you *need* it, because creating a page is an editor action and
`wix dev` is what syncs the new page file down into your repo. So:

> **Start `wix dev` → create the page → let it sync → stop `wix dev` → add the code → commit.**

---

## 1. Start the Local Editor

```powershell
Set-Location "C:\dev\dkdjs_wix_build"
wix dev
```

Open the Local Editor link it prints. Leave this terminal running.

## 2. Add the page

1. Open the **Pages** panel (left sidebar, the pages icon).
2. Click **+ Add Page** → a blank page.
3. Name it **Contact**.

## 3. Set the URL slug

Still in the Pages panel, click the **⋯** next to Contact → **SEO Basics**.

- **URL slug:** `contact` — so the address is `dkdjs.com/contact`

Set it now. Changing a slug after the page is indexed means a redirect to
maintain, and there is no reason to take that on.

While you're in SEO Basics, fill these in — Wix's defaults are generic:

- **Page title:** `Contact DKDJS — Wedding & Event DJs in Boise`
- **Meta description:** `Call or email Daniel & Kathy directly. Mobile DJ and MC
  services for weddings, parties and karaoke across Boise and the Treasure Valley.`

## 4. Clear the page

A new Wix page usually arrives with a placeholder section or two. Delete
everything on the canvas. The element renders the entire page, and anything left
behind will stack above or below it.

## 5. Add the Custom Element

**Add → Embed Code → Custom Element.**

Then, in its settings panel:

| Setting | Value |
|---|---|
| **Tag name** | `dkdjs-page` |
| **Source** | **Velo File** (not Server URL) |
| **File** | `public/custom-elements/dkdjs-page.js` |

> **If `dkdjs-page.js` is not in the dropdown**, the editor's file list is stale —
> it indexes at startup and the file has changed since. Stop `wix dev`, start it
> again, and open the *new* link it prints rather than reusing the old tab.

## 6. Set the element ID

Open the **Properties / ID** panel with the element selected and set the ID to:

```
dkdjsPage
```

Exactly that, capital P. This is what `$w('#dkdjsPage')` in the page code looks
for. Wrong ID means the page code finds nothing and the element renders its
built-in defaults with no phone number or cities.

## 7. Set the `page` attribute

In the element's **Set Attributes** panel, add one attribute:

| Name | Value |
|---|---|
| `page` | `contact` |

**This is the step people miss.** Without it the element falls back to rendering
the packages page, and you'll get a pricing table on your contact page.

## 8. Size and position

Matching the home and packages pages:

- **Size → Responsive behavior:** Stretch (not *Relative width*)
- **Position:** X = `0`, Y = `0`, margins `0`
- **Height:** start around `1100` and adjust once you can see it. The contact
  page is short; if there's dead black space at the bottom, reduce it.
- **The section holding it:** horizontal padding `0`

## 9. Add it to the menu

Pages panel → drag **Contact** into your main menu where you want it. Sensible
order: Home · Weddings · Events · Karaoke · Packages · About · Contact.

## 10. Save, then find the generated file

Click **Save** in the Local Editor. Watch the `wix dev` terminal — it should log
something like `Synced pages for your local UI version …`.

Now find the file Wix created:

```powershell
Set-Location "C:\dev\dkdjs_wix_build"
Get-ChildItem src\pages\Contact*.js
```

You should see something like `Contact.a1b2c.js`. **The five characters are
random and unique to your site** — that's why I can't create this file for you.

## 11. Stop `wix dev`

Ctrl+C in that terminal. Do not skip this — if it's running when the code goes
in, it will revert the file and `git status` will show nothing to commit. That
happened four times today.

## 12. Add the code

Open `docs\CONTACT-PAGE-SNIPPET.js`, copy everything, and paste it into
`src\pages\Contact.{your-id}.js`, replacing the stub Wix generated.

Or tell me the filename and I'll write it directly — faster and no copy/paste
risk.

## 13. Commit

```powershell
Set-Location "C:\dev\dkdjs_wix_build"
git status
```

You should see the new `Contact.{id}.js` as untracked.

```powershell
Set-Location "C:\dev\dkdjs_wix_build"
git add src/pages
git commit -m "Add contact page"
git push
```

## 14. Publish and check

Restart `wix dev`, Save in the Local Editor, then publish — from **Remote —
origin/main**, and Save *before* publishing so you don't ship against an old UI
version.

Then load `dkdjs.com/contact` and confirm:

- Phone reads **(208) 972-1308** and is tappable
- Email reads **contact@dkdjs.com**
- All eight cities appear as chips
- The map loads and shows the Treasure Valley
- "Check your date" goes to `/check-availability`

If the phone and email are missing but the layout is right, the element rendered
but the page code didn't run — check the element ID is `dkdjsPage`.

---

## Why this can't be automated from my side

Wix owns page file names. The `{id}` is generated when *you* create the page, and
Wix rejects a page file it didn't name. I can write into a file once it exists —
that part is easy — but the page itself has to be born in the editor.

Same reason the collections in `docs/COLLECTIONS.md` are still yours to create.
