/**
 * Packages page (/packages) — renders entirely from public/pricing.js.
 *
 * Paste into src/pages/Packages.<id>.js once wix dev syncs the page down.
 * Never type a price into the canvas: every figure here comes from the
 * pricing module, so changing a rate is a one-line edit in one file.
 *
 * ---------------------------------------------------------------------------
 * ELEMENTS TO ADD IN THE LOCAL EDITOR — IDs must match exactly
 * ---------------------------------------------------------------------------
 *
 * Wedding tiers
 *   #packageRepeater      Repeater
 *     #pkgBadge           Text        ("MOST BOOKED" — collapsed unless featured)
 *     #pkgName            Text
 *     #pkgPrice           Text
 *     #pkgHours           Text
 *     #pkgIncludes        Text        (multi-line, set line spacing ~1.6)
 *     #pkgCta             Button      ("Check my date")
 *
 * Everything else
 *   #otherRepeater        Repeater
 *     #otherName          Text
 *     #otherDetail        Text
 *     #otherPrice         Text
 *
 * Add-ons
 *   #addonRepeater        Repeater
 *     #addonName          Text
 *     #addonPrice         Text
 *
 * Terms strip — these collapse on their own while policy is undecided
 *   #termsHold            Text
 *   #termsBalance         Text
 *   #termsSetup           Text
 *
 * A repeater needs a non-empty `data` array with unique `_id` values, and
 * every `_id` must be a string of letters, digits or dashes.
 */

import wixLocation from 'wix-location';
import {
  PACKAGES,
  POLICY,
  policyReady,
  packagesFor,
  sellableAddons,
  visibleIncludes,
  formatMoney,
  priceLabel
} from 'public/pricing';

const CHECK_DATE_URL = '/check-availability';

/** Wedding tiers, in the order the brief presents them. */
const WEDDING_TIERS = ['reception', 'full-day', 'whole-night'];

/** Everything that isn't one of the three wedding tiers. */
const OTHER_IDS = ['private-party', 'karaoke-night', 'corporate', 'ceremony-only', 'residency'];

$w.onReady(() => {
  renderWeddingTiers();
  renderOther();
  renderAddons();
  renderTerms();
});

function renderWeddingTiers() {
  const tiers = WEDDING_TIERS
    .map((id) => PACKAGES.find((p) => p.id === id))
    .filter(Boolean);

  $w('#packageRepeater').data = tiers.map((pkg) => ({ ...pkg, _id: pkg.id }));

  $w('#packageRepeater').onItemReady(($item, pkg) => {
    $item('#pkgName').text = pkg.name;
    $item('#pkgPrice').text = formatMoney(pkg.price);
    $item('#pkgHours').text = `${pkg.hours} hours`;

    // visibleIncludes() strips anything gated on gear that's flagged off,
    // so the page can never advertise equipment DKDJS doesn't have.
    $item('#pkgIncludes').text = visibleIncludes(pkg).join('\n');

    if (pkg.badge) {
      $item('#pkgBadge').text = pkg.badge;
      $item('#pkgBadge').expand();
    } else {
      $item('#pkgBadge').collapse();
    }

    $item('#pkgCta').onClick(() => {
      wixLocation.to(`${CHECK_DATE_URL}?package=${encodeURIComponent(pkg.id)}`);
    });
  });
}

function renderOther() {
  const rows = OTHER_IDS
    .map((id) => PACKAGES.find((p) => p.id === id))
    .filter(Boolean)
    .map((pkg) => ({
      _id: pkg.id,
      name: pkg.name,
      detail: pkg.hours ? `${pkg.hours} hours` : '',
      price: priceLabel(pkg)
    }));

  $w('#otherRepeater').data = rows;
  $w('#otherRepeater').onItemReady(($item, row) => {
    $item('#otherName').text = row.name;
    $item('#otherDetail').text = row.detail;
    $item('#otherPrice').text = row.price;
  });
}

function renderAddons() {
  // Add-ons bundled into every wedding tier aren't sold separately here —
  // showing "Ceremony audio $395" next to three packages that all include it
  // reads as a trap rather than an option.
  const bundledEverywhere = WEDDING_TIERS
    .map((id) => PACKAGES.find((p) => p.id === id))
    .filter(Boolean)
    .map((pkg) => pkg.bundledAddons || [])
    .reduce((shared, list) => shared.filter((id) => list.includes(id)));

  const rows = sellableAddons()
    .filter((addon) => !bundledEverywhere.includes(addon.id))
    .map((addon) => ({
      _id: addon.id,
      name: addon.name + (addon.perUnit ? ' (each)' : ''),
      price: priceLabel(addon)
    }));

  $w('#addonRepeater').data = rows;
  $w('#addonRepeater').onItemReady(($item, row) => {
    $item('#addonName').text = row.name;
    $item('#addonPrice').text = row.price;
  });
}

/**
 * Terms only appear once Daniel has actually decided them. While
 * POLICY.holdAmount and friends are null these stay collapsed rather than
 * showing a plausible-looking number nobody agreed to.
 */
function renderTerms() {
  if (policyReady('holdAmount') && policyReady('holdTerm')) {
    const refund = policyReady('holdRefundDays')
      ? ` Refundable for ${POLICY.holdRefundDays} days.`
      : '';
    $w('#termsHold').text = `${formatMoney(POLICY.holdAmount)} ${POLICY.holdTerm} holds any date.${refund}`;
    $w('#termsHold').expand();
  } else {
    $w('#termsHold').collapse();
  }

  if (policyReady('balanceDueDays')) {
    $w('#termsBalance').text = `Balance due ${POLICY.balanceDueDays} days before your event.`;
    $w('#termsBalance').expand();
  } else {
    $w('#termsBalance').collapse();
  }

  // Not a policy — it's just true, and it's the kind of detail that wins trust.
  $w('#termsSetup').text = 'Load-in, sound check and teardown are never counted in your hours.';
  $w('#termsSetup').expand();
}
