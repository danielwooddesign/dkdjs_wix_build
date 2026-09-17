// Bake the three legal documents into dkdjs-page.js as defaults, keyed by slug.
// Same pattern as the pricing defaults: the element must render correctly even
// if the page-code handoff never happens — and for these pages it repeatedly
// hasn't, because Wix page files have been slow to sync into the repo.
//
// Regenerate after editing public/legal.js.
import { readFileSync, writeFileSync } from 'fs';
const { LEGAL } = await import('../src/public/legal.js');

const payload = {};
for (const key of ['privacy','terms','refund']) {
  const d = LEGAL[key];
  payload[key] = { slug:d.slug, title:d.title, updated:d.updated, intro:d.intro, sections:d.sections };
}

const banner = '/* === GENERATED LEGAL DEFAULTS — do not edit by hand. Run tools/build-legal-defaults.mjs === */';
const block = `${banner}\nconst DEFAULT_LEGAL = ${JSON.stringify(payload, null, 2)};\n/* === END GENERATED LEGAL DEFAULTS === */\n`;

let src = readFileSync('src/public/custom-elements/dkdjs-page.js','utf8');
const re = new RegExp(banner.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '[\\s\\S]*?=== END GENERATED LEGAL DEFAULTS === \\*/\\n');
if (re.test(src)) src = src.replace(re, block);
else {
  const anchor = 'class DkdjsPage';
  if (!src.includes(anchor)) throw new Error('anchor missing');
  src = src.replace(anchor, block + '\n' + anchor);
}

// legal() should fall back to the baked copy, chosen by URL.
const oldFn = `    const d = (this._content && this._content.legal) || null;
    if (!d) return '';`;
const newFn = `    const path = (typeof location !== 'undefined' ? location.pathname : '').toLowerCase();
    const which = path.indexOf('refund') !== -1 ? 'refund'
                : path.indexOf('terms') !== -1 ? 'terms'
                : 'privacy';
    // Page code wins; the baked copy is the fallback so these pages are never blank.
    const d = (this._content && this._content.legal) || DEFAULT_LEGAL[which] || null;
    if (!d) return '';`;
// Idempotent: on a re-run legal() is already patched, so only patch if needed.
if (src.includes(oldFn)) src = src.replace(oldFn, newFn);
else if (!src.includes('DEFAULT_LEGAL[which]')) throw new Error('legal() body not found and not already patched');

writeFileSync('src/public/custom-elements/dkdjs-page.js', src);
console.log('baked', Object.keys(payload).join(', '), '->', src.length, 'bytes');
