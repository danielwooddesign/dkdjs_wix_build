/**
 * <dkdjs-home> — the entire DKDJS home page as one custom element.
 *
 * Lives at src/public/custom-elements/dkdjs-home.js
 * Tag name: dkdjs-home   ·   element ID: dkdjsHome
 *
 * Holds NO copy of its own. Every string arrives in the `content` attribute
 * from public/content.js, which is the same source the page code uses to build
 * `seoMarkup`. That's deliberate: if the element carried its own copy, the
 * visible page and the crawlable markup could drift apart, and Wix's docs
 * warn that a mismatch is cloaking.
 *
 *   IN   content      JSON  all page copy (public/content.js HOME + CITIES + TRUST)
 *        pricing      JSON  wedding tiers and the summary line
 *        config       JSON  phone, image URLs
 *        availability JSON  {status, dateKey, alternatives}
 *
 *   OUT  checkdate    {date}
 *        navigate     {url}
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
`;

function icon(paths, color) {
  return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

/** A real photo when config supplies one, an honest labelled box when it doesn't. */
function media(config, key, label, extraClass) {
  const src = (config.images || {})[key];
  const cls = extraClass ? ` ${extraClass}` : '';
  return src
    ? `<div class="frame${cls}"><img class="photo" src="${esc(src)}" alt="${esc(label)}" loading="lazy"></div>`
    : `<div class="ph${cls}">[ ${esc(label)} ]</div>`;
}

function money(n) {
  return '$' + Number(n || 0).toLocaleString('en-US');
}

/** '2026-10-10' -> 'Saturday, October 10, 2026', without touching timezones. */
function formatKey(key) {
  const parts = String(key).split('-').map(Number);
  if (parts.length !== 3) return key;
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

class DkdjsHome extends HTMLElement {
  static get observedAttributes() { return ['content', 'pricing', 'config', 'availability']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._content = null;
    this._pricing = { packages: [] };
    this._config = { images: {} };
    this._availability = null;
    this._painted = false;
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
    let parsed;
    try { parsed = JSON.parse(value); } catch (err) { return; }

    if (name === 'content') { this._content = parsed; this.render(); }
    if (name === 'pricing') { this._pricing = parsed; this.render(); }
    if (name === 'config') { this._config = Object.assign({ images: {} }, parsed); this.render(); }
    // Availability changes on every click — repaint that panel only.
    if (name === 'availability') { this._availability = parsed; this.paintResult(); }
  }

  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }

  go(url) { this.emit('navigate', { url }); }

  render() {
    const c = this._content;
    if (!c || !c.hero) {
      // No copy yet. Render nothing rather than a half-page of empty headings.
      this.shadowRoot.innerHTML = `<style>${STYLES}</style>`;
      this._painted = false;
      return;
    }

    const cfg = this._config;
    const tiers = this._pricing.packages || [];

    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>

      <section class="hero">
        <div class="hero-bg">
          ${media(cfg, 'heroDesktop', 'HERO PHOTO — 2400×1350, PACKED DANCE FLOOR')}
          <div class="hero-scrim"></div>
        </div>
        <div class="hero-inner wrap">
          <div class="eyebrow"><i></i>${esc(c.hero.eyebrow)}</div>
          <h1 class="disp">${esc(c.hero.h1)}</h1>
          <p class="sub">${esc(c.hero.sub)}</p>

          <div class="checker">
            <label for="dateInput">${esc(c.hero.checkerLabel)}</label>
            <div class="checker-row">
              <input id="dateInput" type="date" aria-label="Event date">
              <button class="btn btn-cyan" id="checkBtn" type="button">${esc(c.hero.checkerButton)}</button>
            </div>
            <p class="hint">${esc(c.hero.checkerHint)}</p>
            <div class="result" id="result" role="status" aria-live="polite"></div>
          </div>

          <div class="hero-actions">
            <button class="btn btn-primary" type="button" data-go="/check-availability">${esc(c.hero.primaryCta)}</button>
            <button class="btn btn-ghost" type="button" data-go="/packages">${esc(c.hero.secondaryCta)}</button>
          </div>
        </div>
      </section>

      <div class="trust">
        <div class="wrap">
          <div class="cities">Serving ${esc((c.cities || []).join(' · '))}</div>
          <ul>${(c.trust || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        </div>
      </div>

      <section>
        <div class="wrap split">
          ${media(cfg, 'danielKathy', 'DANIEL & KATHY — 1200×1500', 'portrait')}
          <div>
            <div class="eyebrow pink"><i></i>${esc(c.about.eyebrow)}</div>
            <h2 class="disp sec">${esc(c.about.h2)}</h2>
            <p style="margin-top:18px">${esc(c.about.body)}</p>
            <div class="stats">
              ${(c.about.stats || []).map((s) => `
                <div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="wrap">
          <div class="eyebrow"><i></i>${esc(c.services.eyebrow)}</div>
          <h2 class="disp sec">${esc(c.services.h2)}</h2>
          <div class="grid">
            ${(c.services.items || []).map((s) => `
              <button class="card" type="button" data-go="${esc(s.url)}">
                ${media(cfg, s.img, s.title.toUpperCase() + ' PHOTO — 1200×900', 'card-media')}
                <span class="card-body">
                  ${icon(s.icon, '#FF2E9A')}
                  <h3 class="disp">${esc(s.title)}</h3>
                  <p>${esc(s.copy)}</p>
                </span>
              </button>`).join('')}
          </div>
        </div>
      </section>

      <section style="background:var(--surface2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
        <div class="wrap">
          <div class="eyebrow"><i></i>${esc(c.included.eyebrow)}</div>
          <h2 class="disp sec">${esc(c.included.h2)}</h2>
          <div class="features">
            ${(c.included.items || []).map((f) => `
              <div class="feat">
                ${icon(f.icon, '#3FE0F0')}
                <div><b>${esc(f.title)}</b><p>${esc(f.copy)}</p></div>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <section>
        <div class="wrap">
          <div class="eyebrow"><i></i>${esc(c.pricing.eyebrow)}</div>
          <h2 class="disp sec">${esc(c.pricing.h2)}</h2>
          <p style="margin-top:14px;max-width:56ch">${esc(c.pricing.intro)}</p>
          <div class="tiers">
            ${tiers.map((t) => `
              <div class="tier${t.featured ? ' featured' : ''}">
                ${t.badge ? `<div class="badge">${esc(t.badge)}</div>` : ''}
                <div class="name">${esc(t.name)}</div>
                <div class="amount"><b>${money(t.price)}</b><span>/ ${esc(t.hours)} hours</span></div>
                <hr>
                <ul>${(t.includes || []).map((line) => `<li>${esc(line)}</li>`).join('')}</ul>
                <button class="btn ${t.featured ? 'btn-primary' : 'btn-ghost'}" type="button"
                  data-go="/check-availability?package=${esc(t.id)}">Check my date</button>
              </div>`).join('')}
          </div>
          <p class="note">${esc(this._pricing.otherLine || '')}</p>
        </div>
      </section>

      <section class="booth">
        <div class="wrap">
          <div class="eyebrow pink"><i></i>${esc(c.booth.eyebrow)}</div>
          <h2 class="disp sec">${esc(c.booth.h2)}</h2>
          <p style="margin-top:16px;max-width:62ch">${esc(c.booth.body)}</p>
          <div class="uses">
            ${(c.booth.uses || []).map((u) => `<div class="use"><b>${esc(u.label)}</b><p>${esc(u.copy)}</p></div>`).join('')}
          </div>
          <div style="margin-top:28px">${media(cfg, 'booth', 'LED VIDEO BOOTH — 2400×1350', 'wide')}</div>
        </div>
      </section>

      <section>
        <div class="wrap">
          <div class="eyebrow"><i></i>${esc(c.gallery.eyebrow)}</div>
          <h2 class="disp sec">${esc(c.gallery.h2)}</h2>
          <div class="gallery">
            ${[1, 2, 3, 4, 5, 6].map((n) => media(cfg, 'gallery' + n, 'GALLERY ' + n + ' — 1600×1200')).join('')}
          </div>
          <div class="hero-actions"><button class="btn btn-ghost" type="button" data-go="/gallery">${esc(c.gallery.cta)}</button></div>
        </div>
      </section>

      <section class="cta">
        <div class="glow"></div>
        <div class="wrap">
          <h2 class="disp">${esc(c.cta.h2)}</h2>
          <p>${esc(c.cta.body)}</p>
          <div class="hero-actions">
            <button class="btn btn-primary" type="button" data-go="/check-availability">${esc(c.cta.button)}</button>
            ${cfg.phone ? `<a class="btn btn-ghost" href="tel:${esc(cfg.phone)}">Call ${esc(cfg.phone)}</a>` : ''}
          </div>
        </div>
      </section>
    `;

    this.wire();
    this._painted = true;
    this.paintResult();
  }

  wire() {
    const root = this.shadowRoot;

    root.querySelectorAll('[data-go]').forEach((el) => {
      el.addEventListener('click', () => this.go(el.getAttribute('data-go')));
    });

    const input = root.getElementById('dateInput');
    const btn = root.getElementById('checkBtn');
    if (!input || !btn) return;

    input.min = new Date().toLocaleDateString('en-CA');

    const ask = () => {
      if (!input.value) return;
      btn.disabled = true;
      btn.textContent = 'Checking…';
      this.emit('checkdate', { date: input.value });
    };

    btn.addEventListener('click', ask);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') ask(); });
    input.addEventListener('change', () => { this._availability = null; this.paintResult(); });
  }

  paintResult() {
    if (!this._painted) return;
    const box = this.shadowRoot.getElementById('result');
    const btn = this.shadowRoot.getElementById('checkBtn');
    if (!box || !btn) return;

    btn.disabled = false;
    btn.textContent = (this._content && this._content.hero.checkerButton) || 'Check it';

    const r = this._availability;
    if (!r || !r.status) { box.className = 'result'; box.innerHTML = ''; return; }

    const pretty = r.dateKey ? formatKey(r.dateKey) : '';
    const COPY = {
      open: ['open', `<strong>${esc(pretty)} is open.</strong>Nobody else has it held. Tell us about your event and we’ll keep it for you.`],
      taken: ['taken', `<strong>${esc(pretty)} is already booked.</strong>We only take one event a day so nobody gets half of us.`],
      past: ['neutral', `<strong>That date has already passed.</strong>Pick a date in the future and we’ll check it.`],
      invalid: ['neutral', `<strong>That doesn’t look like a date.</strong>Pick a day from the calendar.`],
      error: ['neutral', `<strong>We couldn’t check that just now.</strong>Give us a call and we’ll check it by hand.`]
    };

    const [tone, html] = COPY[r.status] || COPY.error;
    box.className = `result show ${tone}`;
    box.innerHTML = html;

    if (r.status === 'taken' && (r.alternatives || []).length) {
      const alts = document.createElement('div');
      alts.className = 'alts';
      alts.innerHTML = `<div style="width:100%;font-size:14px;color:var(--muted)">Here’s what’s open nearby:</div>` +
        r.alternatives.map((k) => `<button class="alt" type="button" data-alt="${esc(k)}">${esc(formatKey(k))}</button>`).join('');
      box.appendChild(alts);
      alts.querySelectorAll('[data-alt]').forEach((b) => {
        b.addEventListener('click', () => this.go('/check-availability?date=' + b.getAttribute('data-alt')));
      });
    }

    if (r.status === 'open') {
      const go = document.createElement('div');
      go.className = 'hero-actions';
      go.innerHTML = `<button class="btn btn-primary" type="button">Request this date</button>`;
      box.appendChild(go);
      go.querySelector('button').addEventListener('click', () => {
        this.go('/check-availability?date=' + r.dateKey);
      });
    }
  }
}

customElements.define('dkdjs-home', DkdjsHome);
