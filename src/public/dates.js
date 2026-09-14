/**
 * Date helpers for DKDJS.
 *
 * Event dates are stored as plain 'YYYY-MM-DD' strings, NOT as Date objects.
 *
 * Why: Wix stores Date fields in UTC. An event on Saturday Oct 10 in Idaho
 * (UTC-6) saved as a Date can come back as Oct 11 — or read as Oct 9 for a
 * visitor in another timezone. A wedding date is a calendar day, not an
 * instant, so it gets stored as one. Every date that crosses the
 * front-end/back-end boundary goes through toDateKey() first.
 */

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** Accepts a Date or a 'YYYY-MM-DD' string; returns 'YYYY-MM-DD' or null. */
export function toDateKey(value) {
  if (!value) return null;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return DATE_KEY.test(trimmed) ? trimmed : null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    // Local calendar parts — the day the user picked, not the UTC day.
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return null;
}

export function isValidDateKey(key) {
  if (!DATE_KEY.test(key || '')) return false;
  const [y, m, d] = key.split('-').map(Number);
  const probe = new Date(y, m - 1, d);
  return probe.getFullYear() === y && probe.getMonth() === m - 1 && probe.getDate() === d;
}

/** '2026-10-10' -> 'Saturday, October 10, 2026' */
export function formatDateKey(key) {
  if (!isValidDateKey(key)) return '';
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

/** 'Sat' */
export function weekdayShort(key) {
  if (!isValidDateKey(key)) return '';
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' });
}

export function isSaturday(key) {
  return weekdayShort(key) === 'Sat';
}

/** Shift a date key by N days. addDays('2026-10-10', 7) -> '2026-10-17' */
export function addDays(key, days) {
  if (!isValidDateKey(key)) return null;
  const [y, m, d] = key.split('-').map(Number);
  const probe = new Date(y, m - 1, d);
  probe.setDate(probe.getDate() + days);
  return toDateKey(probe);
}

/** Today in the given IANA zone, as a date key. Defaults to Mountain time. */
export function todayKey(timeZone = 'America/Boise') {
  // en-CA gives YYYY-MM-DD directly.
  return new Date().toLocaleDateString('en-CA', { timeZone });
}

export function isPast(key, timeZone = 'America/Boise') {
  return isValidDateKey(key) ? key < todayKey(timeZone) : true;
}

/**
 * The nearest Saturdays either side of a date, closest first, for the
 * "that one's taken" fallback. Returns date keys only — the caller checks
 * availability. Past dates are never suggested.
 *
 * @param {string} key
 * @param {number} perSide how many to look for on each side
 */
export function nearbySaturdays(key, perSide = 2) {
  if (!isValidDateKey(key)) return [];

  const found = [];
  for (let offset = 1; offset <= 28 && found.length < perSide * 2; offset += 1) {
    [addDays(key, -offset), addDays(key, offset)].forEach((candidate) => {
      if (!candidate || !isSaturday(candidate) || isPast(candidate)) return;
      if (found.some((f) => f.key === candidate)) return;
      found.push({ key: candidate, distance: offset });
    });
  }

  // Closest first, and when a date before and after tie, prefer the later one:
  // a couple who lost their date is usually willing to move back, not forward.
  return found
    .sort((a, b) => (a.distance - b.distance) || (a.key < b.key ? 1 : -1))
    .map((f) => f.key);
}
