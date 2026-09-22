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

import { readFile, writeFile, unlink } from 'fs/promises';

/**
 * Velo resolves `public/x` against the site root. Node does not, so import a
 * rewritten copy that sits beside the original — relative specifiers inside it
 * still resolve, and the copy is removed again on the way out.
 */
async function loadPublic(name) {
  const src = new URL(`../src/public/${name}.js`, import.meta.url);
  const tmp = new URL(`../src/public/.build-${name}.mjs`, import.meta.url);
  const code = (await readFile(src, 'utf8'))
    .replace(/(["'])public\/([A-Za-z0-9_-]+)\1/g, "'./$2.js'");
  await writeFile(tmp, code);
  try {
    return await import(tmp.href + '?t=' + Date.now());
  } finally {
    await unlink(tmp).catch(() => {});
  }
}

const { HOME, CITIES, TRUST, ABOUT } = await loadPublic('content');
const { getPackage, visibleIncludes, formatMoney } = await loadPublic('pricing');

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

/** Replace a marked region in a file, or fail loudly rather than silently. */
async function bake(target, begin, end, body) {
  let source = await readFile(target, 'utf8');
  const start = source.indexOf(begin);
  const stop = source.indexOf(end);
  if (start === -1 || stop === -1) {
    throw new Error(`markers missing in ${target.pathname} — refusing to guess`);
  }
  source = source.slice(0, start) + begin + '\n' + body + '\n' + end + source.slice(stop + end.length);
  await writeFile(target, source);
}

/* ---------------------------------------------------------------- home ---- */
const HOME_BEGIN = '/* === GENERATED DEFAULTS — do not edit by hand. Run tools/build-defaults.mjs === */';
const HOME_END = '/* === END GENERATED DEFAULTS === */';

await bake(
  new URL('../src/public/custom-elements/dkdjs-home.js', import.meta.url),
  HOME_BEGIN, HOME_END,
  'const DEFAULT_CONTENT = ' + JSON.stringify(content, null, 2) + ';\n'
    + 'const DEFAULT_PRICING = ' + JSON.stringify(pricing, null, 2) + ';'
);

/* --------------------------------------------------------------- about ---- */
const ABOUT_BEGIN = '/* === GENERATED ABOUT — do not edit by hand. Run tools/build-defaults.mjs === */';
const ABOUT_END = '/* === END GENERATED ABOUT === */';

await bake(
  new URL('../src/public/custom-elements/dkdjs-page.js', import.meta.url),
  ABOUT_BEGIN, ABOUT_END,
  'const DEFAULT_ABOUT = ' + JSON.stringify(ABOUT, null, 2) + ';'
);

console.log('baked defaults');
console.log('  content keys  :', Object.keys(content).length);
console.log('  tiers         :', pricing.packages.map((p) => `${p.name} ${formatMoney(p.price)}`).join(', '));
console.log('  about story   :', (ABOUT.story || []).length, 'sections');
