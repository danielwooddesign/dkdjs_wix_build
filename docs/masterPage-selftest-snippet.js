// TEMPORARY — paste into src/pages/masterPage.js, run once, then delete.
import { runSelfTest } from 'backend/diagnostics.web';

$w.onReady(async () => {
  const report = await runSelfTest('dkdjs-selftest');
  console.log('=== DKDJS SELF TEST ===');
  console.log(JSON.stringify(report, null, 2));
});
