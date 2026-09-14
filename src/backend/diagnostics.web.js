/**
 * TEMPORARY — collection self-test. Delete this file before going live.
 *
 * Proves the CMS collections match what the code expects, by exercising the
 * exact insert-then-query path availability.web.js uses. A wrong field key or
 * collection ID fails silently in normal use — every date reads as available
 * and nothing errors. This makes that failure loud.
 *
 * It only ever touches rows it creates itself (all marked SELFTEST, dated
 * 2999-12-31) and deletes them again.
 */

import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';
import { PACKAGES, ADDONS, POLICY, AVAILABLE, estimate, formatMoney } from 'public/pricing';
import { toDateKey, formatDateKey, isSaturday } from 'public/dates';

/** Change this, then pass the same string from masterPage.js. */
const KEY = 'dkdjs-selftest';

/** Far-future sentinel so a probe can never collide with a real event. */
const PROBE_DATE = '2999-12-31';
const OPTS = { suppressAuth: true };

async function cleanup(collection) {
  try {
    const stale = await wixData.query(collection).eq('eventDate', PROBE_DATE).find(OPTS);
    await Promise.all(stale.items.map((item) => wixData.remove(collection, item._id, OPTS)));
    return stale.items.length;
  } catch (err) {
    return 0;
  }
}

/**
 * Insert a probe row, then find it by the same query the real code runs.
 * Returns which expected field keys survived the round trip.
 */
async function probe(collection, row, queryField) {
  const result = { collection, exists: false, canWrite: false, canQuery: false, missingFields: [], error: null };

  try {
    await wixData.query(collection).limit(1).find(OPTS);
    result.exists = true;
  } catch (err) {
    result.error = `Collection not found or unreadable: ${err.message}`;
    return result;
  }

  let inserted;
  try {
    inserted = await wixData.insert(collection, row, OPTS);
    result.canWrite = true;
  } catch (err) {
    result.error = `Insert failed: ${err.message}`;
    return result;
  }

  try {
    const readBack = await wixData.get(collection, inserted._id, OPTS);
    result.missingFields = Object.keys(row).filter((key) => readBack[key] === undefined);

    // The real test: can we find it by the field the live code queries on?
    const found = await wixData.query(collection).eq(queryField, row[queryField]).find(OPTS);
    result.canQuery = found.items.some((item) => item._id === inserted._id);
    if (!result.canQuery) {
      result.error = `Inserted, but querying .eq('${queryField}', …) did not find it — check the field key and its type.`;
    }
  } catch (err) {
    result.error = `Read/query failed: ${err.message}`;
  } finally {
    try {
      await wixData.remove(collection, inserted._id, OPTS);
    } catch (err) {
      result.error = (result.error ? result.error + ' ' : '') + `Could not delete probe row ${inserted._id} — remove it by hand.`;
    }
  }

  return result;
}

export const runSelfTest = webMethod(Permissions.Anyone, async (key) => {
  if (key !== KEY) return { ok: false, error: 'bad key' };

  const report = { collections: [], modules: {}, verdict: '' };

  await Promise.all(['Bookings', 'Holds', 'Leads'].map(cleanup));

  report.collections.push(await probe('Bookings', {
    title: 'SELFTEST', eventDate: PROBE_DATE, leadId: 'selftest', status: 'cancelled'
  }, 'eventDate'));

  report.collections.push(await probe('Holds', {
    title: 'SELFTEST',
    eventDate: PROBE_DATE,
    leadId: 'selftest',
    email: 'selftest@example.com',
    status: 'expired',
    paid: false,
    expiresAt: new Date('2999-12-31T00:00:00Z')
  }, 'eventDate'));

  report.collections.push(await probe('Leads', {
    title: 'SELFTEST',
    name: 'Self Test',
    email: 'selftest@example.com',
    phone: '',
    eventDate: PROBE_DATE,
    eventType: 'wedding',
    venue: '',
    city: '',
    guestCount: 1,
    startTime: '',
    endTime: '',
    packageId: 'full-day',
    addonIds: ['uplighting'],
    estimateTotal: 0,
    notes: '',
    source: 'selftest',
    status: 'lost'
  }, 'eventDate'));

  try {
    await wixData.query('ServiceAreas').limit(1).find(OPTS);
    report.collections.push({ collection: 'ServiceAreas', exists: true, canWrite: null, canQuery: true, missingFields: [], error: null });
  } catch (err) {
    report.collections.push({ collection: 'ServiceAreas', exists: false, error: err.message });
  }

  // Confirm the shared modules loaded and agree with the brief.
  const sample = estimate({ packageId: 'full-day', addonIds: ['uplighting'], extraHours: 1 });
  report.modules = {
    packages: PACKAGES.length,
    addons: ADDONS.length,
    sellableAddons: ADDONS.filter((a) => !a.requires || AVAILABLE[a.requires]).length,
    fullDayPrice: formatMoney(sample.lines[0] ? sample.lines[0].amount : 0),
    sampleTotal: formatMoney(sample.total),
    holdAmountSet: POLICY.holdAmount !== null,
    ledBoothOn: AVAILABLE.ledBooth,
    dateRoundTrip: toDateKey(new Date(2026, 9, 10)),
    dateFormatted: formatDateKey('2026-10-10'),
    oct10IsSaturday: isSaturday('2026-10-10')
  };

  const broken = report.collections.filter((c) => !c.exists || c.error || (c.missingFields && c.missingFields.length));
  report.verdict = broken.length === 0
    ? 'PASS — collections match the code.'
    : `FAIL — problems in: ${broken.map((c) => c.collection).join(', ')}`;

  return { ok: true, ...report };
});
