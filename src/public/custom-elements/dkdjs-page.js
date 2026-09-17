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
:host { display: block; box-sizing: border-box; --bg:#07070B; --surface:#101018; --surface2:#0B0B12; --line:#22222F;
  --text:#F4F4F7; --muted:#A2A2B4; --dim:#8E8EA6; --pink:#FF2E9A; --cyan:#3FE0F0;
  color: var(--text); background: var(--bg);
  font-family:'Barlow','Helvetica Neue',system-ui,sans-serif; -webkit-font-smoothing:antialiased;
  /* Without this the shadow tree inherits the host page's base font-size. Wix
     sets 10px on this site, which rendered body copy at 10px and any heading
     without an explicit size at 20px. Anchor it here. */
  font-size:16px; line-height:1.5; }
* { box-sizing: border-box; }
.disp { font-family:'Anton','Arial Narrow',Impact,system-ui,sans-serif; font-weight:400;
  text-transform:uppercase; line-height:.95; margin:0; }
section { padding: 56px 20px; }
.wrap { max-width: 1240px; margin: 0 auto; }
.eyebrow { display:flex; align-items:center; gap:12px; font-size:12px; letter-spacing:.24em;
  text-transform:uppercase; font-weight:600; color:var(--cyan); }
.eyebrow i { display:block; width:30px; height:2px; background:currentColor; }
.eyebrow.pink { color: var(--pink); }
p { margin:0; line-height:1.6; color:var(--muted); font-size:17px; }
.body  { font-size:17px; line-height:1.6; color:var(--muted); }
.lead  { font-size:clamp(17px,1.4vw,20px); line-height:1.5; color:#C4C4D2; }
.small { font-size:14px; line-height:1.55; color:var(--dim); }
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
h1.sec, h2.sec { font-size:clamp(30px,5vw,50px); color:#fff; margin:16px 0 0; }
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

/* ---------------------------------------------------------------- FORMS --- */
.form { margin-top:28px; max-width:760px; }
.field { margin-bottom:18px; }
.field label { display:block; font-size:12px; letter-spacing:.16em; text-transform:uppercase;
  font-weight:600; color:var(--dim); margin-bottom:8px; }
.field .opt { color:#5F5F72; letter-spacing:.06em; }
.field input, .field select, .field textarea {
  width:100%; min-height:52px; background:var(--bg); border:1px solid #33334A; border-radius:2px;
  padding:0 14px; color:var(--text); font-size:16px; font-family:inherit; }
.field textarea { min-height:120px; padding:14px; line-height:1.5; resize:vertical; }
.field select { appearance:none; cursor:pointer;
  background-image:linear-gradient(45deg,transparent 50%,#8E8EA6 50%),linear-gradient(135deg,#8E8EA6 50%,transparent 50%);
  background-position:calc(100% - 20px) 23px, calc(100% - 14px) 23px;
  background-size:6px 6px, 6px 6px; background-repeat:no-repeat; }
.field input:focus, .field select:focus, .field textarea:focus {
  outline:2px solid var(--cyan); outline-offset:1px; }
.field .err { margin-top:7px; font-size:13px; color:#FF8FC6; display:none; }
.field.invalid input, .field.invalid select { border-color:var(--pink); }
.field.invalid .err { display:block; }
.grid2 { display:grid; grid-template-columns:1fr; gap:0 16px; }
.formnote { font-size:13px; color:var(--dim); line-height:1.5; margin:4px 0 20px; }
.submitrow { display:flex; flex-wrap:wrap; align-items:center; gap:14px; margin-top:8px; }
.formstate { font-size:14px; color:var(--dim); }
.formstate.bad { color:#FF8FC6; }
.done { background:rgba(63,224,240,.08); border:1px solid #1E5B66; border-radius:3px;
  padding:26px 24px; margin-top:28px; }
.done h3 { font-family:'Anton','Arial Narrow',Impact,sans-serif; font-weight:400;
  text-transform:uppercase; font-size:26px; color:#fff; margin:0 0 10px; }

/* ------------------------------------------------------------ CONTACT ----- */
.contactgrid { display:grid; grid-template-columns:1fr; gap:28px; margin-top:28px; align-items:start; }
.infocard { background:var(--surface); border:1px solid var(--line); border-radius:3px; padding:26px 24px; }
.infocard + .infocard { margin-top:16px; }
.infocard .lbl { font-size:12px; letter-spacing:.2em; text-transform:uppercase;
  color:var(--dim); font-weight:600; margin-bottom:8px; }
.infocard a { color:var(--cyan); text-decoration:none; font-size:20px; }
.infocard a:hover { text-decoration:underline; }
.mapwrap { border:1px solid var(--line); border-radius:3px; overflow:hidden; background:var(--surface); }
.mapwrap iframe { width:100%; height:340px; border:0; display:block; filter:grayscale(.35) contrast(1.05); }
.citylist { display:flex; flex-wrap:wrap; gap:8px; margin-top:16px; }
.citylist span { font-size:13px; letter-spacing:.06em; color:#B4B4C4;
  border:1px solid var(--line); border-radius:2px; padding:6px 11px; }

/* -------------------------------------------------------------- ABOUT ----- */
.split { display:grid; grid-template-columns:1fr; gap:28px; align-items:center; margin-top:28px; }
.split .body { max-width:62ch; }
.valuegrid { display:grid; grid-template-columns:1fr; gap:18px; margin-top:28px; }
.value { background:var(--surface); border:1px solid var(--line); border-radius:3px; padding:22px 20px; }
.value b { display:block; font-size:17px; color:#fff; margin-bottom:6px; }
.value p { font-size:14px; }

@media (min-width:768px) {
  .grid2 { grid-template-columns:repeat(2,1fr); }
  .valuegrid { grid-template-columns:repeat(2,1fr); }
}
@media (min-width:900px) {
  .contactgrid { grid-template-columns:1fr 1fr; }
  .split { grid-template-columns:5fr 7fr; gap:36px; }
}
@media (min-width:1100px) {
  .valuegrid { grid-template-columns:repeat(3,1fr); }
}

/* ---------------------------------------------------------------- FAQ ----- */
.faq { display:grid; grid-template-columns:1fr; gap:0; margin-top:28px; }
.qa { border-top:1px solid var(--line); padding:22px 0; }
.qa:last-child { border-bottom:1px solid var(--line); }
.qa b { display:block; font-size:18px; color:#fff; margin-bottom:8px; }
.qa p { font-size:16px; max-width:70ch; }
@media (min-width:900px) {
  .faq { grid-template-columns:repeat(2,1fr); column-gap:40px; }
  .qa:nth-last-child(2):nth-child(odd) { border-bottom:1px solid var(--line); }
}
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

/* === PAGE COPY — defaults. Page code may override via the `content` attribute. */
const DEFAULT_PAGE_CONTENT = {
  availability: {
    eyebrow: 'Check your date',
    h1: 'Is your date still open?',
    intro: 'We only take one event a day, so the answer is always a straight yes or no. '
         + 'Tell us about your event and we will come back to you personally — not with an automated quote.',
    note: 'Sending this does not commit you to anything and does not take a payment. '
        + 'It tells us you are interested and puts your date on our radar while we talk.',
    submit: 'Send it over',
    doneTitle: 'Got it.',
    doneBody: 'We have your details and we will be in touch shortly. '
            + 'If your event is close, call or text and you will hear back faster.'
  },
  contact: {
    eyebrow: 'Get in touch',
    h1: 'Talk to the people who show up.',
    intro: 'Call, text or email and you reach Daniel or Kathy directly. '
         + 'There is no office, no account manager, and no call centre.',
    areaBody: 'We cover Boise and the Treasure Valley. If your venue is a little further out, '
            + 'ask anyway — we travel for the right event.',
    cta: 'Check your date',
    ctaBody: 'The quickest route is to check whether your date is free. It takes a few seconds.',
    mapQuery: 'Boise, Idaho',
    mapZoom: 9,
    mapTitle: 'Map of the Treasure Valley service area',
    mapNote: 'We are a mobile service — we come to your venue. '
           + 'The map shows the area we cover rather than a shopfront.'
  },
  about: {
    eyebrow: 'More than music',
    h1: 'You get the two of us. Every time.',
    body: [
      'We are Daniel and Kathy, a husband-and-wife DJ team serving Boise and the Treasure Valley.',
      'Most DJ companies sell you a brand and send whoever is free that Saturday. '
        + 'You will not meet a stranger on your wedding day. The people you plan with are the '
        + 'people who turn up, unload the van and read your dance floor.',
      'Working as a pair changes what we can do. While one of us is on music, sound and '
        + 'announcements, the other is free to handle requests, cue the next moment, help a '
        + 'nervous speaker find the microphone, or run karaoke — without the music stopping.',
      'That is also why we only take one event a day. Nobody gets the tired half of us.'
    ],
    valuesEyebrow: 'How we work',
    valuesH2: 'What you can count on.',
    values: [
      { title: 'Two of us, always',
        copy: 'Every booking includes both of us. It is not an upgrade and it is not conditional on the package.' },
      { title: 'One event a day',
        copy: 'We never double-book a date. Your event gets the whole day, including setup and teardown.' },
      { title: 'Backup gear on site',
        copy: 'Spare microphones, cables and critical audio equipment travel to every single event.' },
      { title: 'Straight pricing',
        copy: 'Every package is published on the site. No "contact us for a quote" and no surprise line items.' },
      { title: 'We plan with you',
        copy: 'A planning call and a music questionnaire come with every package, so nothing is improvised.' },
      { title: 'Treasure Valley local',
        copy: 'We live here. We know the venues, the drive times and which rooms need what.' }
    ],
    ctaH2: 'Let us know what you are planning.',
    ctaBody: 'Tell us the date and we will tell you straight away whether we are free.',
    cta: 'Check your date'
  }
};

/* === GENERATED DEFAULTS — do not edit by hand. Run tools/build-page-defaults.mjs === */
const DEFAULT_PRICING = {
  "tiers": [
    {
      "id": "reception",
      "name": "The Reception",
      "price": 1095,
      "hours": 4,
      "featured": false,
      "badge": "",
      "includes": [
        "Daniel & Kathy",
        "DJ + MC",
        "Professional sound",
        "Dance floor lighting",
        "Wireless microphone",
        "Planning consultation",
        "Music questionnaire",
        "Backup equipment"
      ]
    },
    {
      "id": "full-day",
      "name": "The Full Day",
      "price": 1595,
      "hours": 6,
      "featured": true,
      "badge": "MOST BOOKED",
      "includes": [
        "Everything in The Reception",
        "Ceremony audio",
        "Officiant microphone",
        "Cocktail-hour music",
        "Two wireless microphones",
        "Timeline coordination",
        "Curved LED Video DJ Booth",
        "Basic personalized visuals"
      ]
    },
    {
      "id": "whole-night",
      "name": "The Whole Night",
      "price": 2095,
      "hours": 8,
      "featured": false,
      "badge": "",
      "includes": [
        "Everything in The Full Day",
        "Enhanced lighting / uplighting",
        "Karaoke hour",
        "Guest song-request portal",
        "Extended coverage",
        "Premium send-off music",
        "Full Custom LED Visual Experience"
      ]
    }
  ],
  "extras": [
    {
      "name": "Private Party",
      "detail": "3 hours",
      "price": "$595",
      "custom": false
    },
    {
      "name": "Karaoke Night",
      "detail": "3 hours",
      "price": "$450",
      "custom": false
    },
    {
      "name": "Corporate / Holiday Event",
      "detail": "4 hours",
      "price": "$895",
      "custom": false
    },
    {
      "name": "Ceremony Audio Only",
      "detail": "2 hours",
      "price": "$395",
      "custom": false
    },
    {
      "name": "Restaurant / Venue Residency",
      "detail": "",
      "price": "Custom recurring pricing",
      "custom": true
    }
  ],
  "addons": [
    {
      "name": "Extra hour (each)",
      "price": "$175",
      "note": ""
    },
    {
      "name": "Karaoke hour",
      "price": "$150",
      "note": "Included in The Whole Night and above"
    },
    {
      "name": "Enhanced uplighting",
      "price": "$295",
      "note": "Included in The Whole Night and above"
    },
    {
      "name": "Custom monogram projection",
      "price": "$195",
      "note": ""
    },
    {
      "name": "Ceremony audio + officiant microphone",
      "price": "$395",
      "note": "Included in The Full Day and above"
    },
    {
      "name": "Curved LED Video Booth",
      "price": "$349",
      "note": "Included in The Full Day and above"
    },
    {
      "name": "Custom Animated Visual Package",
      "price": "$250",
      "note": "Included in The Whole Night and above"
    },
    {
      "name": "Full Booth + Custom Visual Experience",
      "price": "$599",
      "note": ""
    },
    {
      "name": "Corporate / Branded Visual Package",
      "price": "Starting at $595",
      "note": ""
    },
    {
      "name": "Restaurant promotional content updates",
      "price": "Starting at $150/month",
      "note": ""
    }
  ],
  "terms": [],
  "draft": true
};
/* === END GENERATED DEFAULTS === */

/**
 * Which page to render, when the `page` attribute has not been set.
 *
 * The attribute is set in two places — the editor's Set Attributes panel and the
 * page code — and if BOTH are missed the element used to silently fall back to
 * the packages page, putting a pricing table on /contact. Reading the URL is a
 * third safety net: the one thing that is always right.
 */
function pageFromPath() {
  const path = (typeof location !== 'undefined' ? location.pathname : '').toLowerCase();
  if (path.indexOf('check-availability') !== -1) return 'availability';
  if (path.indexOf('contact') !== -1) return 'contact';
  if (path.indexOf('about') !== -1) return 'about';
  if (path.indexOf('packages') !== -1) return 'packages';
  if (path.indexOf('wedding') !== -1) return 'weddings';
  if (path.indexOf('karaoke') !== -1) return 'karaoke';
  if (path.indexOf('event') !== -1) return 'events';
  return null;
}

class DkdjsPage extends HTMLElement {
  static get observedAttributes() { return ['page', 'pricing', 'config', 'content', 'availability', 'submission']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._page = null;
    this._pricing = DEFAULT_PRICING;
    this._config = { images: {} };
    this._content = DEFAULT_PAGE_CONTENT;
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

    this.fitToViewport();

    // Identical to dkdjs-home.js: Wix sizes the container with 100vw, which
    // includes the scrollbar, so content centres slightly off. Measure the real
    // overhang and pad it away. Re-run on resize.
    this._onResize = () => {
      clearTimeout(this._fitTimer);
      this._fitTimer = setTimeout(() => this.fitToViewport(), 120);
    };
    window.addEventListener('resize', this._onResize);
  }

  disconnectedCallback() {
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    clearTimeout(this._fitTimer);
  }

  /** Trim any overhang past the right edge of the visible viewport. */
  fitToViewport() {
    const visible = document.documentElement.clientWidth;
    if (!visible) return;
    this.style.paddingRight = '0px';
    const rect = this.getBoundingClientRect();
    const overhang = Math.round((rect.left + rect.width) - visible);
    this.style.paddingRight = (overhang > 0 && overhang <= 60) ? overhang + 'px' : '0px';
  }

  attributeChangedCallback(name, _old, value) {
    if (value == null) return;
    if (name === 'page') { this._page = value; this.render(); return; }
    try {
      const parsed = JSON.parse(value);
      if (name === 'pricing') this._pricing = parsed;
      if (name === 'config') this._config = Object.assign({ images: {} }, parsed);
      if (name === 'content') this._content = parsed;
      // These paint in place — repainting the whole page would wipe what the
      // visitor has typed into the form.
      if (name === 'availability') { this.paintDate(parsed); return; }
      if (name === 'submission')   { this.paintSubmission(parsed); return; }
      this.render();
    } catch (err) { /* half-written attribute; the next one wins */ }
  }

  go(url) {
    this.dispatchEvent(new CustomEvent('navigate', { detail: { url }, bubbles: true, composed: true }));
  }

  render() {
    const pages = {
      packages: () => this.packages(),
      availability: () => this.availability(),
      contact: () => this.contact(),
      about: () => this.about(),
      weddings: () => this.service(),
      events: () => this.service(),
      karaoke: () => this.service()
    };
    const wanted = this._page || pageFromPath() || 'packages';
    const build = pages[wanted] || pages.packages;
    this._resolvedPage = wanted;
    this.shadowRoot.innerHTML = `<style>${STYLES}</style>${build()}`;
    this.shadowRoot.querySelectorAll('[data-go]').forEach((el) => {
      el.addEventListener('click', () => this.go(el.getAttribute('data-go')));
    });
    if (wanted === 'availability') this.wireForm();
  }



  /* ------------------------------------------------- AVAILABILITY FORM --- */

  /**
   * The element never talks to the backend itself. It validates, then emits:
   *   checkdate    { date }    — page code replies by setting the `availability` attribute
   *   requesthold  { details } — page code calls requestHold() and sets `submission`
   * Same contract as dkdjs-home.js, so the backend stays server-side.
   */
  wireForm() {
    const root = this.shadowRoot;
    const form = root.getElementById('holdForm');
    if (!form) return;

    const dateInput = root.getElementById('fDate');
    // Never let anyone pick yesterday.
    dateInput.min = new Date().toLocaleDateString('en-CA');

    dateInput.addEventListener('change', () => {
      this.paintDate(null);
      const v = dateInput.value;
      if (v) this.emit('checkdate', { date: v });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this._sending) return;

      const invalid = this.validate();
      if (invalid) {
        invalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = invalid.querySelector('input, select, textarea');
        if (input) input.focus();
        return;
      }

      this.setSending(true);
      this.emit('requesthold', { details: this.collect() });
    });
  }

  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }

  /** Returns the first invalid .field, or null when everything required is present. */
  validate() {
    const root = this.shadowRoot;
    let first = null;
    const check = (id, ok) => {
      const field = root.getElementById(id).closest('.field');
      field.classList.toggle('invalid', !ok);
      if (!ok && !first) first = field;
    };
    const email = root.getElementById('fEmail').value.trim();
    check('fDate', Boolean(root.getElementById('fDate').value));
    check('fName', root.getElementById('fName').value.trim().length > 0);
    // Deliberately loose: a real address check is the server's job, and an
    // over-strict pattern rejects valid addresses and loses the enquiry.
    check('fEmail', email.includes('@') && email.indexOf('@') > 0 && email.lastIndexOf('.') > email.indexOf('@'));
    return first;
  }

  collect() {
    const root = this.shadowRoot;
    const val = (id) => {
      const el = root.getElementById(id);
      return el ? String(el.value || '').trim() : '';
    };
    const guests = parseInt(val('fGuests'), 10);
    return {
      eventDate: val('fDate'),
      name: val('fName'),
      email: val('fEmail').toLowerCase(),
      phone: val('fPhone'),
      eventType: val('fType'),
      venue: val('fVenue'),
      city: val('fCity'),
      guestCount: Number.isFinite(guests) ? guests : null,
      packageId: val('fPkg'),
      notes: val('fNotes'),
      source: 'check-availability'
    };
  }

  setSending(on) {
    const root = this.shadowRoot;
    this._sending = on;
    const btn = root.getElementById('holdSubmit');
    const state = root.getElementById('formState');
    if (btn) btn.disabled = on;
    if (state) {
      state.className = 'formstate';
      state.textContent = on ? 'Sending…' : '';
    }
  }

  /** Page code sets the `availability` attribute; this paints the answer. */
  paintDate(result) {
    const box = this.shadowRoot.getElementById('dateResult');
    if (!box) return;
    if (!result || !result.status) { box.className = 'result'; box.innerHTML = ''; return; }

    const copy = {
      open:    ['That date is open.', 'Nobody else has it held. Fill this in and we will keep it for you.', 'open'],
      taken:   ['That date is already booked.', 'We only take one event a day so nobody gets half of us. Send the form anyway and we will suggest what is close.', 'taken'],
      past:    ['That date has already passed.', 'Pick a date in the future and we will check it.', 'neutral'],
      invalid: ['That does not look like a date.', 'Pick a day from the calendar.', 'neutral'],
      error:   ['We could not check that just now.', 'Send the form anyway, or call us and we will check by hand.', 'neutral']
    };
    const row = copy[result.status] || copy.error;
    box.className = 'result show ' + row[2];
    box.innerHTML = `<strong>${esc(row[0])}</strong>${esc(row[1])}`;
  }

  /** Page code sets `submission` to {ok:true} or {ok:false, reason}. */
  paintSubmission(result) {
    const root = this.shadowRoot;
    const form = root.getElementById('holdForm');
    const done = root.getElementById('holdDone');
    this.setSending(false);
    if (!form || !done) return;

    if (result && result.ok) {
      form.hidden = true;
      done.hidden = false;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const state = root.getElementById('formState');
    if (state) {
      state.className = 'formstate bad';
      const reasons = {
        'invalid-date': 'That date did not look right — check it and try again.',
        'invalid-email': 'That email address did not look right.',
        taken: 'That date was taken while you were filling this in. Change the date and resend.',
        error: 'Something went wrong on our end. Call or text us and we will sort it out.'
      };
      state.textContent = reasons[(result && result.reason)] || reasons.error;
    }
  }


  /* =============================================================== SERVICE == */

  /**
   * Weddings, Events and Karaoke share one layout and differ only in copy and
   * which packages apply. Copy arrives in the `content` attribute from
   * public/content.js SERVICES, which is the same source the page code uses to
   * build seoMarkup.
   */
  service() {
    const c = (this._content && this._content.service) || null;
    if (!c) {
      // The page code has not handed over copy yet. Render nothing rather than
      // a half page — the attribute lands a moment later and repaints.
      return '';
    }
    const cfg = this._config || {};
    const tiers = (this._pricing && this._pricing.tiers) || [];
    const addons = (this._pricing && this._pricing.addons) || [];
    const also = (this._pricing && this._pricing.also) || [];

    return `
      <section>
        <div class="wrap">
          <div class="eyebrow"><i></i>${esc(c.eyebrow)}</div>
          <h1 class="disp sec">${esc(c.h1)}</h1>
          <p class="lead" style="margin-top:16px;max-width:62ch">${esc(c.lead)}</p>
          ${cfg.images && cfg.images.hero
            ? `<div style="margin-top:32px">${media(cfg, 'hero', esc(c.h1), 'wide')}</div>` : ''}
          <div style="margin-top:28px;max-width:66ch">
            ${(c.intro || []).map((t) => `<p class="body" style="margin-bottom:16px">${esc(t)}</p>`).join('')}
          </div>
        </div>
      </section>

      <section class="band">
        <div class="wrap">
          <div class="eyebrow"><i></i>${esc(c.stepsEyebrow)}</div>
          <h2 class="disp sec">${esc(c.stepsH2)}</h2>
          <div class="valuegrid">
            ${(c.steps || []).map((st) => `
              <div class="value"><b>${esc(st.title)}</b><p>${esc(st.copy)}</p></div>`).join('')}
          </div>
        </div>
      </section>

      ${tiers.length ? `
      <section>
        <div class="wrap">
          <div class="eyebrow"><i></i>Straight pricing</div>
          <h2 class="disp sec">What it costs.</h2>
          <div class="tiers">
            ${tiers.map((t) => `
              <div class="tier${t.featured ? ' featured' : ''}">
                ${t.badge ? `<div class="badge">${esc(t.badge)}</div>` : ''}
                <div class="name">${esc(t.name)}</div>
                <div class="amount"><b>${money(t.price)}</b>${t.hours ? `<span>/ ${esc(t.hours)} hours</span>` : ''}</div>
                <ul>${(t.includes || []).map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
                <button class="btn ${t.featured ? 'btn-primary' : 'btn-ghost'}" type="button"
                  data-go="/check-availability?package=${esc(t.id)}">Check my date</button>
              </div>`).join('')}
          </div>
          ${also.length ? `
          <p class="small" style="margin-top:20px">Also available: ${also.map((a) =>
            `${esc(a.name)} — ${esc(a.price)}${a.hours ? ` for ${esc(a.hours)} hours` : ''}`).join(' · ')}.</p>` : ''}
          ${addons.length ? `
          <p class="small" style="margin-top:8px">Add-ons: ${addons.map((a) => esc(a.name)).join(' · ')}.</p>` : ''}
          <div class="hero-actions" style="margin-top:20px">
            <button class="btn btn-ghost" type="button" data-go="/packages">See every package and add-on</button>
          </div>
        </div>
      </section>` : ''}

      <section class="band">
        <div class="wrap">
          <div class="eyebrow"><i></i>${esc(c.faqEyebrow)}</div>
          <h2 class="disp sec">${esc(c.faqH2)}</h2>
          <div class="faq">
            ${(c.faq || []).map((f) => `
              <div class="qa">
                <b>${esc(f.q)}</b>
                <p>${esc(f.a)}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <section>
        <div class="wrap" style="text-align:center">
          <h2 class="disp sec">${esc(c.ctaH2)}</h2>
          <p class="lead" style="margin:16px auto 24px;max-width:52ch">${esc(c.ctaBody)}</p>
          <button class="btn btn-primary" type="button" data-go="/check-availability">Check your date</button>
        </div>
      </section>`;
  }

  /* =================================================== CHECK AVAILABILITY == */

  availability() {
    const c = (this._content && this._content.availability) || DEFAULT_PAGE_CONTENT.availability;
    const cfg = this._config || {};
    const types = [
      ['', 'Select one'], ['wedding', 'Wedding'], ['birthday', 'Birthday'],
      ['anniversary', 'Anniversary'], ['graduation', 'Graduation'],
      ['corporate', 'Corporate / holiday party'], ['karaoke', 'Karaoke night'],
      ['private', 'Private party'], ['other', 'Something else']
    ];
    const pkgs = (this._pricing && this._pricing.tiers) || [];

    return `
      <section>
        <div class="wrap">
          <div class="eyebrow"><i></i>${esc(c.eyebrow)}</div>
          <h1 class="disp sec">${esc(c.h1)}</h1>
          <p class="lead" style="margin-top:16px;max-width:62ch">${esc(c.intro)}</p>

          <form class="form" id="holdForm" novalidate>
            <div class="field">
              <label for="fDate">Event date</label>
              <input type="date" id="fDate" name="eventDate" required>
              <div class="err">Pick the date of your event.</div>
            </div>

            <div class="result" id="dateResult"></div>

            <div class="grid2">
              <div class="field">
                <label for="fName">Your name</label>
                <input type="text" id="fName" name="name" autocomplete="name">
                <div class="err">Tell us who you are.</div>
              </div>
              <div class="field">
                <label for="fEmail">Email</label>
                <input type="email" id="fEmail" name="email" autocomplete="email" required>
                <div class="err">We need an email to reply to.</div>
              </div>
              <div class="field">
                <label for="fPhone">Phone <span class="opt">optional</span></label>
                <input type="tel" id="fPhone" name="phone" autocomplete="tel">
              </div>
              <div class="field">
                <label for="fType">Event type</label>
                <select id="fType" name="eventType">
                  ${types.map((t) => `<option value="${esc(t[0])}">${esc(t[1])}</option>`).join('')}
                </select>
              </div>
              <div class="field">
                <label for="fVenue">Venue <span class="opt">if you know it</span></label>
                <input type="text" id="fVenue" name="venue">
              </div>
              <div class="field">
                <label for="fCity">City</label>
                <input type="text" id="fCity" name="city" list="cityOptions">
                <datalist id="cityOptions">
                  ${(cfg.cities || []).map((n) => `<option value="${esc(n)}"></option>`).join('')}
                </datalist>
              </div>
              <div class="field">
                <label for="fGuests">Roughly how many guests <span class="opt">optional</span></label>
                <input type="number" id="fGuests" name="guestCount" min="1" max="2000">
              </div>
              <div class="field">
                <label for="fPkg">Package you're looking at <span class="opt">optional</span></label>
                <select id="fPkg" name="packageId">
                  <option value="">Not sure yet</option>
                  ${pkgs.map((p) => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="field">
              <label for="fNotes">Anything else <span class="opt">optional</span></label>
              <textarea id="fNotes" name="notes" placeholder="Timings, must-play songs, questions — whatever helps."></textarea>
            </div>

            <p class="formnote">${esc(c.note)}</p>

            <div class="submitrow">
              <button class="btn btn-primary" type="submit" id="holdSubmit">${esc(c.submit)}</button>
              <span class="formstate" id="formState"></span>
            </div>
          </form>

          <div class="done" id="holdDone" hidden>
            <h3>${esc(c.doneTitle)}</h3>
            <p>${esc(c.doneBody)}</p>
          </div>
        </div>
      </section>`;
  }

  /* ================================================================ CONTACT = */

  contact() {
    const c = (this._content && this._content.contact) || DEFAULT_PAGE_CONTENT.contact;
    const cfg = this._config || {};
    const cities = cfg.cities || [];
    // Service area, deliberately not a pinned home address.
    const mapSrc = 'https://www.google.com/maps?q=' + encodeURIComponent(c.mapQuery)
      + '&z=' + encodeURIComponent(c.mapZoom || 10) + '&output=embed';

    return `
      <section>
        <div class="wrap">
          <div class="eyebrow"><i></i>${esc(c.eyebrow)}</div>
          <h1 class="disp sec">${esc(c.h1)}</h1>
          <p class="lead" style="margin-top:16px;max-width:60ch">${esc(c.intro)}</p>

          <div class="contactgrid">
            <div>
              ${cfg.phone ? `
              <div class="infocard">
                <div class="lbl">Call or text</div>
                <a href="tel:${esc(String(cfg.phone).replace(/[^0-9+]/g, ''))}">${esc(cfg.phone)}</a>
              </div>` : ''}
              ${cfg.email ? `
              <div class="infocard">
                <div class="lbl">Email</div>
                <a href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a>
              </div>` : ''}
              <div class="infocard">
                <div class="lbl">Where we work</div>
                <p>${esc(c.areaBody)}</p>
                <div class="citylist">${cities.map((n) => `<span>${esc(n)}</span>`).join('')}</div>
              </div>
              <div class="infocard">
                <div class="lbl">Fastest way to book</div>
                <p style="margin-bottom:16px">${esc(c.ctaBody)}</p>
                <button class="btn btn-primary" type="button" data-go="/check-availability">${esc(c.cta)}</button>
              </div>
            </div>
            <div>
              <div class="mapwrap">
                <iframe src="${esc(mapSrc)}" loading="lazy" title="${esc(c.mapTitle)}"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
              <p class="small" style="margin-top:12px">${esc(c.mapNote)}</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  /* ================================================================== ABOUT = */

  about() {
    const c = (this._content && this._content.about) || DEFAULT_PAGE_CONTENT.about;
    const cfg = this._config || {};

    return `
      <section>
        <div class="wrap">
          <div class="eyebrow pink"><i></i>${esc(c.eyebrow)}</div>
          <h1 class="disp sec">${esc(c.h1)}</h1>
          <div class="split">
            <div>${media(cfg, 'danielKathy', 'DANIEL & KATHY — 1600×2000', 'portrait')}</div>
            <div>
              ${(c.body || []).map((t) => `<p class="body" style="margin-bottom:16px">${esc(t)}</p>`).join('')}
            </div>
          </div>
        </div>
      </section>

      <section class="band">
        <div class="wrap">
          <div class="eyebrow"><i></i>${esc(c.valuesEyebrow)}</div>
          <h2 class="disp sec">${esc(c.valuesH2)}</h2>
          <div class="valuegrid">
            ${(c.values || []).map((v) => `
              <div class="value"><b>${esc(v.title)}</b><p>${esc(v.copy)}</p></div>`).join('')}
          </div>
        </div>
      </section>

      <section>
        <div class="wrap" style="text-align:center">
          <h2 class="disp sec">${esc(c.ctaH2)}</h2>
          <p class="lead" style="margin:16px auto 24px;max-width:52ch">${esc(c.ctaBody)}</p>
          <button class="btn btn-primary" type="button" data-go="/check-availability">${esc(c.cta)}</button>
        </div>
      </section>`;
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
