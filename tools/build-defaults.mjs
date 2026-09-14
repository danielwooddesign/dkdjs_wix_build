/**
 * Bakes the current content and pricing into the custom elements as defaults.
 *
 *   node tools/build-defaults.mjs
 *
 * Why: a custom element that renders nothing until page code feeds it is blank
 * in the editor canvas, and blank on the live site if anything breaks the
 * handoff. So each element carries a baked-in copy of the content.
 *
 * public/content.js and public/pricing.js remain the single source of truth —
 * the baked copies are GENERATED, never hand-edited. Run this after changing
 * either module, and the element, the page and the SEO markup all move together.
 */

import { readFile, writeFile } from 'fs/promises';
import { HOME, CITIES, TRUST } from '../src/public/content.js';
import { getPackage, visibleIncludes, formatMoney } from '../src/public/pricing.js';

const WEDDING_TIERS = ['reception', 'full-day', 'whole-night'];

const content = { ...HOME, cities: CITIES, trust: TRUST };

const pricing = {
  packages: WEDDING_TIERS.map(getPackage).filter(Boolean).map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    hours: pkg.hours,
    featured: Boolean(pkg.featured),
    badge: pkg.badge || '',
    includes: visibleIncludes(pkg)
  })),
  otherLine: ['private-party', 'karaoke-night', 'corporate']
    .map(getPackage).filter(Boolean)
    .map((pkg) => `${pkg.name} from ${formatMoney(pkg.price)}`)
    .join(' · ') + ' · See all packages and add-ons'
};

const BEGIN = '/* === GENERATED DEFAULTS — do not edit by hand. Run tools/build-defaults.mjs === */';
const END = '/* === END GENERATED DEFAULTS === */';

const block = [
  BEGIN,
  'const DEFAULT_CONTENT = ' + JSON.stringify(content, null, 2) + ';',
  'const DEFAULT_PRICING = ' + JSON.stringify(pricing, null, 2) + ';',
  END
].join('\n');

const target = new URL('../src/public/custom-elements/dkdjs-home.js', import.meta.url);
let source = await readFile(target, 'utf8');

if (source.includes(BEGIN)) {
  const start = source.indexOf(BEGIN);
  const stop = source.indexOf(END) + END.length;
  source = source.slice(0, start) + block + source.slice(stop);
} else {
  // First run: drop it in just above the class definition.
  source = source.replace('class DkdjsHome extends HTMLElement', block + '\n\nclass DkdjsHome extends HTMLElement');
}

await writeFile(target, source);
console.log('baked defaults into dkdjs-home.js');
console.log('  content keys :', Object.keys(content).length);
console.log('  tiers        :', pricing.packages.map((p) => `${p.name} ${formatMoney(p.price)}`).join(', '));
