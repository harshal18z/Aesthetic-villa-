/* Aesthetic Villa Dental — scroll film engine.
   Deterministic render(p): every chapter is a pure function of scroll progress p (0..1).
   GSAP/ScrollTrigger/Lenis enhance it when available; native scroll works without them. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const outBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const fade = (p, a, b, c, d) => (p < a || p > d) ? 0 : p < b ? seg(p, a, b) : p <= c ? 1 : 1 - seg(p, c, d);
const lerp = (a, b, t) => a + (b - a) * t;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width:700px)').matches;
const root = document.documentElement;
if (reduce) { root.classList.add('static'); $('#loader')?.classList.add('done'); initBrand(); return; }

/* ---------- frame sequences ---------- */
class Seq {
  constructor(key, n, cv) { this.key = key; this.n = n; this.cv = cv; this.ctx = cv.getContext('2d'); this.img = new Array(n); this.last = -1; }
  url(i) { return `frames/${this.key}/${small ? 'm' : 'd'}/${String(i + 1).padStart(3, '0')}.webp`; }
  order() { const st = small ? 2 : 1; const a = []; for (let i = 0; i < this.n; i++) if (i % st === 0 || i === this.n - 1) a.push(i); return a; }
  load(i) { return new Promise(r => { if (this.img[i]) return r(); const im = new Image(); im.decoding = 'async'; im.onload = () => { this.img[i] = im; r(); }; im.onerror = () => r(); im.src = this.url(i); }); }
  async loadList(list, conc = 6, each) { const q = list.slice(); const w = async () => { while (q.length) { await this.load(q.shift()); each && each(); } }; await Promise.all(Array.from({ length: conc }, w)); }
  resize() { const dpr = Math.min(devicePixelRatio || 1, 2); const w = Math.round(this.cv.clientWidth * dpr), h = Math.round(this.cv.clientHeight * dpr); if (w && (this.cv.width !== w || this.cv.height !== h)) { this.cv.width = w; this.cv.height = h; this.last = -1; } }
  draw(f) {
    const i = clamp(Math.round(f), 0, this.n - 1); if (i === this.last) return;
    let im = null; for (let d = 0; d < this.n; d++) { if (this.img[i - d]) { im = this.img[i - d]; break; } if (this.img[i + d]) { im = this.img[i + d]; break; } }
    if (!im) return; this.last = i;
    const c = this.ctx, W = this.cv.width, H = this.cv.height; c.fillStyle = '#F6F2EC'; c.fillRect(0, 0, W, H);
    const s = Math.min(W / im.naturalWidth, H / im.naturalHeight); const w = im.naturalWidth * s, h = im.naturalHeight * s;
    c.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
  }
}
const seqA = new Seq('A', 96, $('#cvA')), seqC = new Seq('C', 120, $('#cvC')), seqB = new Seq('B', 96, $('#cvB'));
const seqs = [seqA, seqC, seqB];

/* ---------- element handles ---------- */
const g = id => document.getElementById(id);
const stage = g('stage'), film = g('film');
const setVis = (el, v) => { el.style.opacity = v; el.style.visibility = v > .005 ? 'visible' : 'hidden'; };
const T = (el, v, dy = 26) => { setVis(el, v); el.style.transform = `translateY(${(1 - v) * dy}px)`; };
const BL = (el, v) => { el.style.opacity = v; el.style.filter = `blur(${((1 - v) * 14).toFixed(1)}px)`; el.style.transform = `translateY(${(1 - v) * 10}px)`; };
const L = { A: g('lA'), S0: g('lS0'), S2: g('lS2'), Hero: g('lHero'), Asm: g('lAsm'), Rot: g('lRot'), Mac: g('lMac'), J: g('lJ'), Plan: g('lPlan'), Arch: g('lArch'), Seal: g('lSeal'), Well: g('lWell'), Close: g('lClose') };

/* split characters */
const h2 = g('h2split'); const h2txt = h2.textContent; h2.setAttribute('aria-label', h2txt); h2.textContent = '';
const chars = []; h2txt.split(' ').forEach((wd, wi, arr) => { const w = document.createElement('span'); w.style.cssText = 'display:inline-block;white-space:nowrap'; w.setAttribute('aria-hidden', 'true'); [...wd].forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; w.appendChild(s); chars.push(s); }); h2.appendChild(w); if (wi < arr.length - 1) h2.appendChild(document.createTextNode(' ')); });

/* assembly parts: translate in % of own height */
const PARTS = [
  { el: g('pCro'), h: 257, d: 224, a: .62, b: 1.0 },
  { el: g('pAbu'), h: 233, d: 199, a: .30, b: .70 },
  { el: g('pScr'), h: 153, d: 170, a: 0, b: .38, fadeA: .22, fadeB: .42 },
  { el: g('pFix'), h: 357, d: 0, a: 0, b: 1 }
];

/* journey */
const JIMG = [0, 1, 2, 3, 4, 5].map(i => g('j' + i));
const JSTEP = [
  { t: 'Consultation', c: 'A conversation about your goals, history and questions.', cap: 'Your consultation' },
  { t: 'Digital scan', c: 'A digital scan to capture the shape of your teeth and bite.', cap: 'Digital scan' },
  { t: 'Placement', c: 'Treatment carried out according to the plan agreed with you.', cap: 'Treatment' },
  { t: 'Healing', c: 'Time to settle in, with follow-up visits as advised.', cap: 'Healing' },
  { t: 'Final smile', c: 'The finishing restoration is fitted and checked.', cap: 'Final smile' }
];
const J0 = .580, JS = .035; // step i starts at J0 + i*JS
const jStart = [J0, J0 + JS, J0 + 2 * JS, J0 + 2.55 * JS, J0 + 3 * JS, J0 + 4 * JS]; // j3 (treatment room) wipes in mid-step 3
const tc = '<span class="tc">[TO CONFIRM]</span>';

/* ---------- render ---------- */
let lastStep = -1;
function render(p) {
  p = clamp(p);
  g('pbar').style.width = (p * 100).toFixed(2) + '%';
  g('hint').style.opacity = p < .012 ? 1 : 0;
  const film_done = p > .9985; document.body.classList.toggle('film-done', film_done);

  /* ch1 arrival */
  seqA.draw(seg(p, 0, .09) * (seqA.n - 1));
  setVis(L.A, 1 - seg(p, .085, .095));
  const s0 = seg(p, .085, .095) * (1 - seg(p, .120, .130));
  setVis(L.S0, s0); L.S0.style.transform = `translate(-50%,-50%) scale(${lerp(1.04, 1.12, seg(p, .085, .13))}) translateX(${lerp(-1.6, 1.6, seg(p, .085, .13))}%)`;
  const s2 = seg(p, .120, .130) * (1 - seg(p, .160, .175));
  setVis(L.S2, s2); L.S2.style.transform = `translate(-50%,-50%) scale(${lerp(1.04, 1.12, seg(p, .12, .165))}) translateX(${lerp(1.6, -1.6, seg(p, .12, .165))}%)`;
  T(g('t1'), fade(p, -.05, -.04, .07, .085));
  T(g('t1b'), fade(p, .095, .104, .115, .125));
  T(g('t1c'), fade(p, .132, .14, .155, .168));

  /* ch2 hero implant */
  const h = fade(p, .170, .188, .232, .250); setVis(L.Hero, h);
  const hl = seg(p, .178, .245);
  g('heroImg').style.transform = `scale(${lerp(.94, 1.04, hl)})`;
  g('rim').style.opacity = h;
  const ht = seg(p, .182, .212);
  chars.forEach((c, i) => { const v = clamp(ht * 1.6 - (i / chars.length) * .6); c.style.opacity = v; c.style.transform = `translateY(${(1 - v) * 105}%)`; });
  T(g('t2'), h);

  /* ch3 assembly */
  const asmOp = fade(p, .240, .256, .322, .336); setVis(L.Asm, asmOp);
  const a = seg(p, .262, .314);
  PARTS.forEach(o => {
    const k = ease(seg(a, o.a, o.b)); o.el.style.transform = `translateY(${(k * o.d / o.h * 100).toFixed(2)}%)`;
    o.el.style.opacity = o.fadeA != null ? 1 - seg(a, o.fadeA, o.fadeB) : 1;
    const lab = o.el.querySelector('.lab'); lab.style.opacity = 1 - seg(a, 0, .22);
  });
  g('asmGlow').style.opacity = Math.sin(Math.PI * seg(a, .55, 1)) * .8;
  T(g('t3a'), fade(p, .246, .258, .285, .296) * asmOp);
  T(g('t3b'), fade(p, .290, .302, .322, .334) * asmOp);

  /* ch4 rotation — one sequence shared across two sections */
  const rot = fade(p, .326, .340, .462, .476); setVis(L.Rot, rot);
  seqC.draw(seg(p, .332, .470) * (seqC.n - 1));
  T(g('t4a'), fade(p, .336, .346, .390, .400) * rot);
  T(g('t4b'), fade(p, .404, .414, .458, .468) * rot);
  BL(g('c1'), fade(p, .344, .356, .392, .400)); BL(g('c2'), fade(p, .356, .368, .392, .400));
  BL(g('c3'), fade(p, .412, .424, .458, .468)); BL(g('c4'), fade(p, .424, .436, .458, .468));

  /* ch5 macro → healed smile */
  const mac = fade(p, .466, .478, .592, .602); setVis(L.Mac, mac);
  seqB.draw(seg(p, .472, .545) * (seqB.n - 1));
  const w = ease(seg(p, .545, .575)); g('wS14').style.clipPath = `circle(${(w * 75).toFixed(1)}% at 50% 55%)`;
  T(g('t5a'), fade(p, .482, .494, .526, .540) * mac);
  T(g('t5b'), fade(p, .552, .560, .566, .574) * mac);

  /* ch6 patient journey */
  const jo = fade(p, .572, .578, .750, .762); setVis(L.J, jo);
  JIMG.forEach((el, i) => { const r = ease(seg(p, jStart[i] - .009, jStart[i] + .007)); el.style.clipPath = `circle(${(r * 78).toFixed(1)}% at 50% 45%)`; el.style.visibility = r > 0 ? 'visible' : 'hidden'; });
  const st = clamp(Math.floor((p - J0) / JS), 0, 4);
  g('jpath').style.strokeDashoffset = 1 - clamp((st + ease(seg(p, J0 + st * JS + .004, J0 + st * JS + JS * .8))) / 4, 0, 1);
  $$('.nd').forEach((n, i) => { n.classList.toggle('on', i === st); n.classList.toggle('past', i < st); });
  if (st !== lastStep) {
    lastStep = st; const s = JSTEP[st];
    g('jnum').textContent = '0' + (st + 1); g('jtitle').textContent = s.t; g('jcopy').innerHTML = s.c + ' ' + tc; g('jcap').textContent = s.cap;
  }

  /* ch7 digital planning (dark) */
  const pl = fade(p, .756, .768, .832, .842); setVis(L.Plan, pl);
  const dk = fade(p, .752, .766, .830, .842); // darkness of stage
  stage.style.background = mix('#F6F2EC', '#1A140E', dk);
  const q = seg(p, .768, .836); const spot = g('spot');
  let sx, sy, sr = 24;
  if (q < .15) { const k = ease(q / .15); sx = lerp(30, 49, k); sy = lerp(40, 60.5, k); }
  else if (q < .42) { sx = 49; sy = 60.5; }
  else if (q < .56) { const k = ease((q - .42) / .14); sx = lerp(49, 58.5, k); sy = lerp(60.5, 35.5, k); }
  else if (q < .8) { sx = 58.5; sy = 35.5; }
  else { const k = ease((q - .8) / .2); sx = 58.5; sy = 35.5; sr = lerp(24, 70, k); }
  spot.style.setProperty('--sx', sx + '%'); spot.style.setProperty('--sy', sy + '%'); spot.style.setProperty('--sr', sr + '%');
  const c1 = ease(seg(q, .2, .4)), c2 = ease(seg(q, .58, .78));
  g('cn1').style.strokeDashoffset = 1 - c1; g('cn2').style.strokeDashoffset = 1 - c2;
  g('pl1').style.opacity = seg(q, .34, .44); g('pl2').style.opacity = seg(q, .72, .82);
  T(g('t7'), fade(p, .772, .782, .826, .838) * pl);

  /* ch8 smile arch */
  const ar = fade(p, .842, .852, .884, .894); setVis(L.Arch, ar);
  g('archPath').style.strokeDashoffset = 1 - ease(seg(p, .850, .874));
  const bl = seg(p, .872, .890); g('bloom').style.opacity = Math.sin(Math.PI * bl) * .9; g('bloom').style.transform = `translateX(${lerp(-70, 70, bl)}%)`;
  T(g('t8'), fade(p, .850, .860, .880, .892) * ar);

  /* ch9 seal stamp */
  const se = fade(p, .890, .898, .920, .930); setVis(L.Seal, se);
  const sk = seg(p, .894, .908); const sc = sk < 1 ? lerp(1.7, 1, outBack(sk)) : 1; const squash = sk > .55 && sk < .85 ? 1 - .06 * Math.sin(Math.PI * seg(sk, .55, .85)) : 1;
  g('seal').style.transform = `scale(${sc * (1 + (1 - squash) * .5)},${sc * squash})`; g('seal').style.opacity = seg(p, .892, .9);
  const rk = seg(p, .906, .928); const ring = g('ring'); ring.style.opacity = rk > 0 && rk < 1 ? .8 * (1 - rk) : 0; ring.style.transform = `translate(-50%,-50%) scale(${lerp(.5, 1.8, ease(rk))})`;
  T(g('t9'), fade(p, .902, .912, .920, .930) * se);

  /* ch10 wellness */
  const we = fade(p, .924, .934, .958, .970); setVis(L.Well, we);
  L.Well.querySelector('.fit').style.transform = `translate(-50%,-50%) scale(${lerp(1.02, 1.09, seg(p, .924, .97))})`;
  g('shafts').style.transform = `translateX(${lerp(-4, 4, seg(p, .924, .97))}%)`;
  T(g('t10'), fade(p, .932, .942, .956, .968) * we);

  /* ch11 close: warm bloom → CTA */
  const cl = seg(p, .960, 1); setVis(L.Close, seg(p, .958, .966));
  g('bloomfull').style.transform = `translate(-50%,-50%) scale(${ease(seg(p, .962, .99)).toFixed(3)})`;
  T(g('t11'), seg(p, .978, .995));
  g('t11').style.pointerEvents = cl > .9 ? 'auto' : 'none';
}
function mix(a, b, t) { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`; }

/* ---------- progress source ---------- */
let P = 0, ticking = false;
const calc = () => clamp((scrollY - film.offsetTop) / (film.offsetHeight - innerHeight));
function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; P = calc(); render(P); brandTick(); }); }
addEventListener('scroll', onScroll, { passive: true });
function resize() { seqs.forEach(s => s.resize()); seqs.forEach(s => s.last = -1); render(calc()); }
addEventListener('resize', resize);
window.__p = v => { scrollTo(0, film.offsetTop + v * (film.offsetHeight - innerHeight)); render(v); }; // debug / verification helper

/* ---------- loader + progressive loading ---------- */
async function boot() {
  seqs.forEach(s => s.resize());
  const total = Math.ceil(seqA.order().length * .15);
  let done = 0; const bar = g('lbar');
  const tick = () => { done++; bar.style.width = Math.min(100, done / (total + 1) * 100) + '%'; };
  const firstA = seqA.order().slice(0, total);
  const hero = new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = 'img/hero.webp'; });
  await Promise.all([seqA.loadList(firstA, 6, tick), hero.then(tick)]);
  bar.style.width = '100%';
  render(calc()); setTimeout(() => g('loader').classList.add('done'), 250);
  // lazy: rest of A, then rotation, then macro
  await seqA.loadList(seqA.order().slice(total), 6, () => seqA.last = -1);
  await seqC.loadList(seqC.order(), 6, () => seqC.last = -1);
  await seqB.loadList(seqB.order(), 6, () => seqB.last = -1);
  resize();
}

/* ---------- enhancements (GSAP / ScrollTrigger / Lenis if loaded) ---------- */
function enhance() {
  const G = window.gsap, ST = window.ScrollTrigger;
  if (G && ST) {
    G.registerPlugin(ST);
    ST.create({ trigger: film, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => { P = s.progress; render(P); } });
    G.to('#heroImg', { y: -14, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });      // idle float
    G.to('#rim', { rotation: 0, duration: 0 });
    if (window.Lenis) {
      const lenis = new Lenis({ lerp: .1, smoothWheel: true });
      lenis.on('scroll', ST.update);
      G.ticker.add(t => lenis.raf(t * 1000)); G.ticker.lagSmoothing(0);
      document.documentElement.classList.add('lenis');
    }
    // magnetic CTA
    const btn = g('cta'), bx = G.quickTo(btn, 'x', { duration: .4, ease: 'power3' }), by = G.quickTo(btn, 'y', { duration: .4, ease: 'power3' });
    btn.addEventListener('mousemove', e => { const r = btn.getBoundingClientRect(); bx((e.clientX - r.left - r.width / 2) * .35); by((e.clientY - r.top - r.height / 2) * .35); });
    btn.addEventListener('mouseleave', () => { bx(0); by(0); });
  }
}

/* ---------- brand page ---------- */
let words = [];
function initBrand() {
  const m = g('mani'); if (m) { m.innerHTML = m.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' '); words = $$('.w', m); }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
  const nav = g('nav'); const brand = g('brand');
  new IntersectionObserver(es => es.forEach(e => nav.classList.toggle('show', e.boundingClientRect.top < innerHeight * .9)), { threshold: [0, .01] }).observe(brand);
  const f = g('form'); f.addEventListener('submit', e => { e.preventDefault(); const ok = g('fn').value.trim() && g('fp').value.trim(); g('fmsg').textContent = ok ? 'Thank you. The booking endpoint is not connected yet [TO CONFIRM: where requests are sent], so nothing has been submitted.' : 'Please add your name and phone number.'; });
  // cursor (desktop)
  const cur = g('cursor');
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    let x = 0, y = 0, cx = 0, cy = 0;
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; cur.classList.add('on'); });
    (function loop() { cx = lerp(cx, x, .22); cy = lerp(cy, y, .22); cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
    $$('a,button,input').forEach(el => { el.addEventListener('mouseenter', () => cur.classList.add('big')); el.addEventListener('mouseleave', () => cur.classList.remove('big')); });
  }
}
function brandTick() {
  if (!words.length) return; const m = g('mani').getBoundingClientRect();
  const k = clamp((innerHeight * .85 - m.top) / (m.height + innerHeight * .3));
  words.forEach((w, i) => w.classList.toggle('on', i / words.length < k * 1.05));
}

initBrand();
render(calc());
boot();
window.addEventListener('load', () => { enhance(); resize(); brandTick(); });
})();
