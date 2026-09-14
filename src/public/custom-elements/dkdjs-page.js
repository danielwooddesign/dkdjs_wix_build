/**
 * <dkdjs-page> — the non-home DKDJS pages, one element, selected by attribute.
 *
 * Lives at src/public/custom-elements/dkdjs-page.js
 * Tag name: dkdjs-page   ·   set  page="packages"  in Set Attributes
 *
 *   IN   page      string  which page to render — currently "packages"
 *        pricing   JSON    packages, extras, add-ons, terms (page code builds it)
 *        config    JSON    phone, email, images
 *
 *   OUT  navigate  {url}
 *
 * The design system below is lifted verbatim from dkdjs-home.js so the two
 * pages cannot drift. Edit it there; this copy is regenerated from it.
 */

const FONTS = 'https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&display=swap';

const STYLES = `
:host { display: block; --bg:#07070B; --surface:#101018; --surface2:#0B0B12; --line:#22222F;
  --text:#F4F4F7; --muted:#A2A2B4; --dim:#8E8EA6; --pink:#FF2E9A; --cyan:#3FE0F0;
  color: var(--text); background: var(--bg);
  font-family:'Barlow','Helvetica Neue',system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
* { box-sizing: border-box; }
.disp { font-family:'Anton','Arial Narrow',Impact,system-ui,sans-serif; font-weight:400;
  text-transform:uppercase; line-height:.95; margin:0; }
section { padding: 56px 20px; }
.wrap { max-width: 1240px; margin: 0 auto; }
.eyebrow { display:flex; align-items:center; gap:12px; font-size:12px; letter-spacing:.24em;
  text-transform:uppercase; font-weight:600; color:var(--cyan); }
.eyebrow i { display:block; width:30px; height:2px; background:currentColor; }
.eyebrow.pink { color: var(--pink); }
p { margin:0; line-height:1.6; color:var(--muted); }
.portrait, .portrait.ph { aspect-ratio:4/5; width:100%; }
.wide, .wide.ph { aspect-ratio:16/9; width:100%; }
.card-media, .card-media.ph { aspect-ratio:4/3; width:100%; }
.ph { background-image: repeating-linear-gradient(135deg, rgba(255,255,255,.045) 0 12px, rgba(255,255,255,0) 12px 24px);
  border:1px dashed #3A3A4A; display:flex; align-items:center; justify-content:center; text-align:center;
  color:var(--dim); font-size:11px; letter-spacing:.1em; text-transform:uppercase; padding:14px; }
img.photo { width:100%; height:100%; object-fit:cover; display:block; }
.frame { position:relative; overflow:hidden; border-radius:3px; }

.btn { display:inline-flex; align-items:center; justify-content:center; min-height:52px;
  padding:0 30px; border-radius:2px; font-size:15px; font-weight:700; letter-spacing:.04em;
  border:0; cursor:pointer; font-family:inherit; text-decoration:none; }
.btn-primary { background:var(--pink); color:#0A0A0F; box-shadow:0 0 28px rgba(255,46,154,.38); }
.btn-primary:hover { background:#ff4ea9; }
.btn-ghost { background:transparent; color:var(--text); border:1px solid #43435A; }
.btn-ghost:hover { border-color:var(--cyan); color:var(--cyan); }
.btn-cyan { background:var(--cyan); color:#06131A; }

/* HERO */
.hero { position:relative; padding:0; min-height:620px; display:flex; align-items:flex-end; }
.hero-bg { position:absolute; inset:0; }
.hero-bg .ph { position:absolute; inset:0; border:none; }
.hero-scrim { position:absolute; inset:0;
  background:linear-gradient(to bottom, rgba(7,7,11,.72) 0%, rgba(7,7,11,.55) 30%, rgba(7,7,11,.96) 85%, var(--bg) 100%); }
.hero-inner { position:relative; width:100%; padding:80px 20px 44px; }
.hero h1 { font-size:clamp(38px,8.5vw,84px); color:#fff; margin:18px 0 0;
  text-shadow:0 0 60px rgba(255,46,154,.28); max-width:14ch; }
.hero .sub { margin-top:18px; font-size:clamp(16px,2.2vw,20px); max-width:60ch; color:#C4C4D2; }
.hero-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:26px; }

/* DATE CHECKER */
.checker { margin-top:26px; max-width:580px; background:rgba(16,16,24,.88); border:1px solid #2B2B3A;
  border-radius:4px; padding:20px; backdrop-filter:blur(8px); }
.checker label { display:block; font-size:12px; letter-spacing:.16em; text-transform:uppercase;
  font-weight:600; color:var(--dim); margin-bottom:10px; }
.checker-row { display:flex; flex-wrap:wrap; gap:10px; }
.checker input { flex:1 1 200px; min-height:52px; background:var(--bg); border:1px solid #33334A;
  border-radius:2px; padding:0 14px; color:var(--text); font-size:16px; font-family:inherit; }
.checker input:focus { outline:2px solid var(--cyan); outline-offset:1px; }
.checker .hint { margin-top:10px; font-size:14px; color:var(--dim); }
.result { margin-top:14px; border-radius:3px; padding:16px 18px; font-size:15px; line-height:1.5; display:none; }
.result.show { display:block; }
.result.open { background:rgba(63,224,240,.08); border:1px solid #1E5B66; }
.result.taken { background:rgba(255,46,154,.08); border:1px solid #5B2044; }
.result.neutral { background:var(--surface); border:1px solid var(--line); }
.result strong { display:block; font-size:17px; color:#fff; margin-bottom:4px; }
.alts { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
.alt { background:transparent; border:1px solid #43435A; color:var(--text); border-radius:2px;
  padding:9px 14px; font-size:14px; cursor:pointer; font-family:inherit; min-height:44px; }
.alt:hover { border-color:var(--cyan); color:var(--cyan); }

/* TRUST BAR */
.trust { background:var(--surface2); border-top:1px solid var(--line); border-bottom:1px solid var(--line);
  padding:18px 20px; }
.trust .wrap { display:flex; flex-wrap:wrap; gap:10px 28px; align-items:center; justify-content:center;
  text-align:center; }
.trust .cities { font-size:14px; color:var(--muted); letter-spacing:.04em; }
.trust ul { display:flex; flex-wrap:wrap; gap:8px 22px; list-style:none; margin:0; padding:0; }
.trust li { font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--dim); font-weight:600; }

/* SPLIT */
.split { display:grid; gap:36px; }
.stats { display:flex; flex-wrap:wrap; gap:28px 44px; margin-top:6px; }
.stat b { display:block; font-family:'Anton',Impact,sans-serif; font-size:34px; color:var(--cyan); font-weight:400; }
.stat span { font-size:13px; letter-spacing:.12em; text-transform:uppercase; color:var(--dim); }

/* CARD GRIDS */
h2.sec { font-size:clamp(30px,5vw,50px); color:#fff; margin:16px 0 0; }
.grid { display:grid; gap:18px; margin-top:34px; }
.card { background:var(--surface); border:1px solid var(--line); border-radius:3px; overflow:hidden;
  display:flex; flex-direction:column; text-align:left; cursor:pointer; padding:0;
  font-family:inherit; color:inherit; }
.card:hover { border-color:var(--pink); }
.card .frame, .card .ph { flex:0 0 auto; }
.card-body { padding:22px 20px 26px; display:flex; flex-direction:column; gap:10px; }
.card h3 { font-size:22px; color:#fff; margin:0; }
.card p { font-size:15px; }

.feat { display:flex; gap:16px; align-items:flex-start; }
.feat b { display:block; font-size:17px; font-weight:600; color:var(--text); margin-bottom:4px; }
.feat p { font-size:14px; }

/* PRICING */
.tiers { display:grid; gap:18px; margin-top:34px; }
.tier { background:var(--surface); border:1px solid var(--line); border-radius:3px; padding:30px 26px 34px;
  display:flex; flex-direction:column; gap:16px; position:relative; }
.tier.featured { background:#14101C; border-color:var(--pink); box-shadow:0 0 46px rgba(255,46,154,.16); }
.badge { position:absolute; top:-11px; left:26px; background:var(--pink); color:#0A0A0F; font-size:11px;
  font-weight:700; letter-spacing:.14em; padding:5px 12px; border-radius:2px; }
.tier .name { font-size:12px; letter-spacing:.2em; text-transform:uppercase; color:var(--dim); font-weight:600; }
.tier.featured .name { color:#FF8FC6; }
.tier .amount { display:flex; align-items:baseline; gap:8px; }
.tier .amount b { font-family:'Anton',Impact,sans-serif; font-weight:400; font-size:44px; color:#fff; }
.tier .amount span { font-size:15px; color:var(--dim); }
.tier hr { border:0; border-top:1px solid var(--line); margin:0; }
.tier ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px; }
.tier li { font-size:15px; color:#B4B4C4; }
.note { margin-top:20px; font-size:14px; color:var(--dim); }

/* BOOTH */
.booth { background:var(--surface2); border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
.uses { display:grid; gap:16px; margin-top:30px; }
.use { border-left:2px solid var(--pink); padding-left:16px; }
.use b { display:block; font-size:16px; color:#fff; margin-bottom:4px; }
.use p { font-size:14px; }

/* GALLERY */
.gallery { display:grid; gap:10px; margin-top:28px; grid-template-columns:repeat(2,1fr); }
.gallery .frame, .gallery .ph { aspect-ratio:4/3; }

/* CTA */
.cta { position:relative; overflow:hidden; background:#0E0912; border-top:1px solid #2A1626; text-align:center; }
.cta .glow { position:absolute; top:-140px; left:50%; width:560px; height:440px; margin-left:-280px;
  background:radial-gradient(circle, rgba(255,46,154,.2) 0%, rgba(255,46,154,0) 70%); pointer-events:none; }
.cta h2 { font-size:clamp(30px,6vw,56px); color:#fff; margin:0 0 16px; }
.cta p { margin:0 auto; max-width:52ch; }
.cta .hero-actions { justify-content:center; }

@media (min-width:768px) {
  section { padding:76px 32px; }
  .hero-inner { padding:120px 32px 56px; }
  .hero { min-height:700px; }
  .split { grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
  .grid { grid-template-columns:repeat(2,1fr); }
  .tiers { grid-template-columns:repeat(3,1fr); }
  .uses { grid-template-columns:repeat(2,1fr); gap:24px 36px; }
  .gallery { grid-template-columns:repeat(3,1fr); }
  .trust .wrap { justify-content:space-between; text-align:left; }
}
@media (min-width:1100px) {
  .grid { grid-template-columns:repeat(4,1fr); }
  .uses { grid-template-columns:repeat(4,1fr); }
  .features { grid-template-columns:repeat(3,1fr); }
}
.features { display:grid; gap:26px; margin-top:34px; grid-template-columns:1fr; }
@media (min-width:768px) { .features { grid-template-columns:repeat(2,1fr); } }

/* --- packages page --- */
.page-head { text-align:center; padding-top:68px; padding-bottom:10px; }
.page-head .eyebrow { justify-content:center; }
.page-head h1 { font-size:clamp(34px,7vw,64px); color:#fff; margin:16px 0 0; }
.page-head p { margin:16px auto 0; max-width:60ch; font-size:17px; }
.draft { display:inline-block; margin-top:16px; font-size:12px; letter-spacing:.14em;
  text-transform:uppercase; font-weight:600; color:var(--muted);
  border:1px solid #43435A; border-radius:2px; padding:7px 14px; }
.rows { margin-top:28px; }
.row { display:flex; align-items:center; justify-content:space-between; gap:20px;
  padding:16px 0; border-bottom:1px solid var(--line); }
.row:first-child { border-top:1px solid var(--line); }
.row .who { min-width:0; }
.row .who b { display:block; font-size:16px; font-weight:600; color:var(--text); }
.row .who span { font-size:14px; color:var(--dim); }
.row .amt { font-family:'Anton',Impact,sans-serif; font-weight:400; font-size:24px; color:#fff;
  white-space:nowrap; }
.row .amt.small { font-family:inherit; font-size:15px; font-weight:600; color:var(--cyan); }
.addon-note { display:block; font-size:13px; color:var(--dim); margin-top:3px; }
.two-col { display:grid; gap:44px; }
@media (min-width:900px) { .two-col { grid-template-columns:1fr 1fr; gap:64px; } }
.terms { display:grid; gap:26px; margin-top:8px; }
@media (min-width:768px) { .terms { grid-template-columns:repeat(3,1fr); gap:36px; } }
`;

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

function money(n) {
  return '$' + Number(n || 0).toLocaleString('en-US');
}

function media(config, key, label, extraClass) {
  const src = (config.images || {})[key];
  const cls = extraClass ? ` ${extraClass}` : '';
  return src
    ? `<div class="frame${cls}"><img class="photo" src="${esc(src)}" alt="${esc(label)}" loading="lazy"></div>`
    : `<div class="ph${cls}">[ ${esc(label)} ]</div>`;
}

class DkdjsPage extends HTMLElement {
  static get observedAttributes() { return ['page', 'pricing', 'config']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._page = 'packages';
    this._pricing = { tiers: [], extras: [], addons: [], terms: [] };
    this._config = { images: {} };
  }

  connectedCallback() {
    if (!document.querySelector('link[data-dkdjs-fonts]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONTS;
      link.setAttribute('data-dkdjs-fonts', '');
      document.head.appendChild(link);
    }
    this.render();
  }

  attributeChangedCallback(name, _old, value) {
    if (value == null) return;
    if (name === 'page') { this._page = value; this.render(); return; }
    try {
      const parsed = JSON.parse(value);
      if (name === 'pricing') this._pricing = parsed;
      if (name === 'config') this._config = Object.assign({ images: {} }, parsed);
      this.render();
    } catch (err) { /* half-written attribute; the next one wins */ }
  }

  go(url) {
    this.dispatchEvent(new CustomEvent('navigate', { detail: { url }, bubbles: true, composed: true }));
  }

  render() {
    const html = this._page === 'packages' ? this.packages() : '';
    this.shadowRoot.innerHTML = `<style>${STYLES}</style>${html}`;
    this.shadowRoot.querySelectorAll('[data-go]').forEach((el) => {
      el.addEventListener('click', () => this.go(el.getAttribute('data-go')));
    });
  }

  packages() {
    const p = this._pricing;
    const cfg = this._config;

    return `
      <section class="page-head">
        <div class="wrap">
          <div class="eyebrow"><i></i>Packages &amp; pricing</div>
          <h1 class="disp">Here\u2019s what it costs.</h1>
          <p>Every package includes both of us, all the gear, setup and teardown, backup
            equipment, and a planning call. No surprise line items on the invoice.</p>
          ${p.draft ? '<span class="draft">Draft rates</span>' : ''}
        </div>
      </section>

      <section style="padding-top:18px">
        <div class="wrap">
          <div class="tiers">
            ${(p.tiers || []).map((t) => `
              <div class="tier${t.featured ? ' featured' : ''}">
                ${t.badge ? `<div class="badge">${esc(t.badge)}</div>` : ''}
                <div class="name">${esc(t.name)}</div>
                <div class="amount"><b>${money(t.price)}</b><span>/ ${esc(t.hours)} hours</span></div>
                <hr>
                <ul>${(t.includes || []).map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
                <button class="btn ${t.featured ? 'btn-primary' : 'btn-ghost'}" type="button"
                  data-go="/check-availability?package=${esc(t.id)}">Check my date</button>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <section style="background:var(--surface2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
        <div class="wrap two-col">
          <div>
            <h2 class="disp sec">Not a wedding?</h2>
            <div class="rows">
              ${(p.extras || []).map((e) => `
                <div class="row">
                  <div class="who"><b>${esc(e.name)}</b><span>${esc(e.detail)}</span></div>
                  <div class="amt${e.custom ? ' small' : ''}">${esc(e.price)}</div>
                </div>`).join('')}
            </div>
          </div>
          <div>
            <h2 class="disp sec">Add anything</h2>
            <div class="rows">
              ${(p.addons || []).map((a) => `
                <div class="row">
                  <div class="who">
                    <b>${esc(a.name)}</b>
                    ${a.note ? `<span class="addon-note">${esc(a.note)}</span>` : ''}
                  </div>
                  <div class="amt small">${esc(a.price)}</div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </section>

      <section class="booth">
        <div class="wrap">
          <div class="eyebrow pink"><i></i>DKDJS visual experience</div>
          <h2 class="disp sec">The booth is part of the package.</h2>
          <p style="margin-top:16px;max-width:62ch">Names, monograms, photos, event colors, logos,
            drink specials, themed animations \u2014 the curved LED video booth displays custom content
            through your whole event. It comes with The Full Day and The Whole Night, and can be added
            to any other package.</p>
          <div style="margin-top:28px">${media(cfg, 'booth', 'LED VIDEO BOOTH \u2014 2400\u00d71350', 'wide')}</div>
        </div>
      </section>

      ${(p.terms || []).length ? `
      <section>
        <div class="wrap">
          <div class="terms">
            ${p.terms.map((t) => `<div class="feat"><div><b>${esc(t.title)}</b><p>${esc(t.copy)}</p></div></div>`).join('')}
          </div>
        </div>
      </section>` : ''}

      <section class="cta">
        <div class="glow"></div>
        <div class="wrap">
          <h2 class="disp">Still deciding? Check the date anyway.</h2>
          <p>Saturdays in June through September go first. Tell us your date and we\u2019ll tell you
            straight away whether it\u2019s open.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" type="button" data-go="/check-availability">Check your date</button>
            ${cfg.phone ? `<a class="btn btn-ghost" href="tel:${esc(cfg.phone)}">Call ${esc(cfg.phone)}</a>` : ''}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('dkdjs-page', DkdjsPage);
