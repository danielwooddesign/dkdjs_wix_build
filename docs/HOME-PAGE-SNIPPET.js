/**
 * Home page — hero date checker.
 *
 * This is a SNIPPET, not a drop-in file. Page code files are named by Wix
 * (e.g. src/pages/Home.a1b2c.js) and are created when you add the page in the
 * Studio editor — never by hand. Paste this into the real Home page file once
 * the repo is synced.
 *
 * Elements to add in the Studio canvas first, with these exact IDs:
 *   #datePicker      DatePicker
 *   #checkButton     Button       "Check it"
 *   #resultBox       Container    (hidden on load)
 *   #resultHeadline  Text
 *   #resultDetail    Text
 *   #altRepeater     Repeater     (hidden on load) — item has #altDate, #altPick
 */

import { checkDate } from 'backend/availability.web';
import { formatDateKey, toDateKey, todayKey } from 'public/dates';
import wixLocation from 'wix-location';

const COPY = {
  open: {
    headline: (d) => `${formatDateKey(d)} is open.`,
    detail: 'Nobody else has it held. Tell us about your event and we’ll keep it for you.'
  },
  taken: {
    headline: (d) => `${formatDateKey(d)} is already booked.`,
    detail: 'We only take one event a day so nobody gets half of us. Here’s what’s open nearby:'
  },
  past: {
    headline: () => 'That date has already passed.',
    detail: 'Pick a date in the future and we’ll check it.'
  },
  invalid: {
    headline: () => 'That doesn’t look like a date.',
    detail: 'Pick a day from the calendar.'
  },
  error: {
    headline: () => 'We couldn’t check that just now.',
    detail: 'Give us a call and we’ll check it by hand — it’s faster than it sounds.'
  }
};

$w.onReady(() => {
  // Never let anyone pick yesterday.
  const [y, m, d] = todayKey().split('-').map(Number);
  $w('#datePicker').minDate = new Date(y, m - 1, d);

  $w('#resultBox').collapse();
  $w('#altRepeater').collapse();

  $w('#checkButton').onClick(runCheck);
  $w('#datePicker').onChange(() => {
    // Clear a stale answer the moment they change the date.
    $w('#resultBox').collapse();
    $w('#altRepeater').collapse();
  });
});

async function runCheck() {
  const dateKey = toDateKey($w('#datePicker').value);
  if (!dateKey) return render('invalid', null, []);

  $w('#checkButton').disable();
  $w('#checkButton').label = 'Checking…';

  try {
    const result = await checkDate(dateKey);
    render(result.status, result.dateKey, result.alternatives);
  } catch (err) {
    console.error('[home] checkDate failed', err);
    render('error', dateKey, []);
  } finally {
    $w('#checkButton').enable();
    $w('#checkButton').label = 'Check it';
  }
}

function render(status, dateKey, alternatives) {
  const copy = COPY[status] || COPY.error;

  $w('#resultHeadline').text = copy.headline(dateKey);
  $w('#resultDetail').text = copy.detail;
  $w('#resultBox').expand();

  if (status === 'taken' && alternatives.length) {
    $w('#altRepeater').data = alternatives.map((key) => ({ _id: key, key }));
    $w('#altRepeater').onItemReady(($item, item) => {
      $item('#altDate').text = formatDateKey(item.key);
      $item('#altPick').onClick(() => goToBooking(item.key));
    });
    $w('#altRepeater').expand();
  } else {
    $w('#altRepeater').collapse();
  }

  // An open date should go straight on to the form while they're keen.
  if (status === 'open') {
    $w('#resultDetail').onClick(() => goToBooking(dateKey));
  }
}

function goToBooking(dateKey) {
  wixLocation.to(`/check-availability?date=${encodeURIComponent(dateKey)}`);
}
