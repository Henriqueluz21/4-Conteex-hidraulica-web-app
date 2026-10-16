/* ═══════════════════════════════════════════
   HIDRÁULICA SÃO GABRIEL — Scroll Premium
   Estilo Cip Harvin (Lenis + ScrollTrigger)
   Split de texto 100% manual (sem plugin pago)
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ── 1. Scroll suave (Lenis) ── */
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ── 2. Split manual: texto vira letras ── */
function splitChars(el) {
  if (!el || el.dataset.splitDone) return [];
  el.dataset.splitDone = 'true';
  const text = el.textContent.trim();
  const words = text.split(/\s+/);
  el.textContent = '';
  el.setAttribute('aria-label', text);
  words.forEach((word, wi) => {
    const w = document.createElement('span');
    w.className = 'sp-word';
    [...word].forEach(ch => {
      const c = document.createElement('span');
      c.className = 'sp-char';
      c.textContent = ch;
      w.appendChild(c);
    });
    el.appendChild(w);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
  return el.querySelectorAll('.sp-char');
}

/* ── 3. Títulos: revelação letra por letra ── */
document.querySelectorAll('.section-header__title, .hsg-video-header h2, .about-strip__title')
  .forEach(el => {
    const chars = splitChars(el);
    if (!chars.length) return;
    gsap.set(chars, { yPercent: 120, opacity: 0 });
    gsap.to(chars, {
      yPercent: 0, opacity: 1,
      stagger: 0.02, duration: 0.9, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

/* ── 4. Elementos: fade-up ao rolar ── */
gsap.utils.toArray(
  '.trust-bar__item, .category-card, .about-strip__text, .about-strip__list li, ' +
  '.hsg-video-header p, .hsg-video-wrapper, .hsg-video-bottom, .section-header__sub'
).forEach(el => {
  gsap.from(el, {
    opacity: 0, y: 60, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 90%' }
  });
});

/* ── 5. Hero: entrada ao carregar ── */
window.addEventListener('load', () => {
  const title = document.querySelector('.hero__title');
  const chars = splitChars(title);
  if (!chars.length) return;
  gsap.timeline()
    .from('.hero__eyebrow', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from(chars, { yPercent: 120, opacity: 0, stagger: 0.03, duration: 1, ease: 'power4.out' }, '-=0.3')
    .from('.hero__subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.hero__actions', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
});

/* ── 6. Âncoras com scroll suave ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.4 }); }
  });
});
