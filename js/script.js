/* ═══════════════════════════════════════
   HIDRÁULICA SÃO GABRIEL — Scroll Premium
   Estilo Cip Harvin (Lenis + ScrollTrigger)
   Split de texto 100% manual (sem plugin pago)
   ═══════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ── 1. Scroll suave (Lenis) ── */
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ── 2. Topbar fica escura ao rolar ── */
const topbar = document.querySelector('.topbar');
if (topbar) {
  ScrollTrigger.create({
    start: 40,
    onUpdate: (self) => topbar.classList.toggle('scrolled', self.scroll() > 40)
  });
}

/* ── 3. Split manual: transforma título em letras ── */
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

/* ── 4. Títulos revelando letra por letra ao rolar ── */
document.querySelectorAll('.heading').forEach(el => {
  const chars = splitChars(el);
  if (!chars.length) return;
  gsap.set(chars, { yPercent: 120, opacity: 0 });
  gsap.to(chars, {
    yPercent: 0, opacity: 1,
    stagger: 0.02, duration: 0.9, ease: 'power4.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

/* ── 5. Fade-up nos elementos de apoio ── */
gsap.utils.toArray('.eyebrow, .number, .text, .cta').forEach(el => {
  gsap.from(el, {
    opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 92%' }
  });
});

/* ── 6. Fade-up nas imagens (split) ── */
gsap.utils.toArray('.split__media').forEach(el => {
  gsap.from(el, {
    opacity: 0, y: 80, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});

/* ── 7. Parallax no fundo ── */
gsap.utils.toArray('.bg').forEach(bg => {
  gsap.fromTo(bg, { yPercent: -12 }, {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: bg.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
  });
});

/* ── 8. Hero: entrada ao carregar ── */
window.addEventListener('load', () => {
  const heroHeading = document.querySelector('.hero-heading');
  const chars = splitChars(heroHeading);
  if (!chars.length) return;
  gsap.timeline()
    .from('.hero-sec .eyebrow', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from(chars, { yPercent: 120, opacity: 0, stagger: 0.025, duration: 1, ease: 'power4.out' }, '-=0.3')
    .from('.hero-sec .text', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.hero-sec .cta', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.scroll-hint', { opacity: 0, duration: 1 }, '-=0.3');
});
/* ── 9. Contadores animados (seção incêndio) ── */
document.querySelectorAll('.fire-stat [data-count]').forEach(el => {
  const target = +el.getAttribute('data-count');
  const obj = { val: 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top 88%', once: true,
    onEnter: () => gsap.to(obj, {
      val: target, duration: 2, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.val); }
    })
  });
});

/* ── 10. Cards de incêndio: fade-up em cascata ── */
gsap.utils.toArray('.fire-card').forEach((card, i) => {
  gsap.from(card, {
    opacity: 0, y: 60, duration: 0.9, ease: 'power3.out', delay: i * 0.12,
    scrollTrigger: { trigger: card, start: 'top 90%' }
  });
});
/* =====================================================================
   Hidráulica São Gabriel — script.js
   Lenis (scroll suave) + GSAP ScrollTrigger + Scroll Expansion Hero
   ===================================================================== */

(() => {
  'use strict';

  /* ═══════════════ 1. LENIS — SCROLL SUAVE ═══════════════ */
  let lenis = null;

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Sincroniza o Lenis com o ScrollTrigger do GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ═══════════════ 2. SCROLL EXPANSION HERO ═══════════════ */
  const hero    = document.querySelector('#expand-hero');
  const media   = document.querySelector('#expand-hero .expand-media img');
  const content = document.querySelector('#expand-hero .hero-content');
  const hint    = document.querySelector('#expand-hero .scroll-hint');

  if (hero && media) {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const rect     = hero.getBoundingClientRect();
        const total    = Math.max(1, rect.height - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        const isMobile = window.innerWidth <= 768;

        // Card começa pequeno e expande até tela cheia
        const startW = isMobile ? 84 : 56;
        const startH = isMobile ? 62 : 68;
        const w      = startW + (100 - startW) * progress;
        const h      = startH + (100 - startH) * progress;
        const radius = (isMobile ? 20 : 28) * (1 - progress);

        media.style.width        = w + 'vw';
        media.style.height       = h + 'vh';
        media.style.borderRadius = radius + 'px';

        // Título sobe e desaparece
        if (content) {
          const fade = Math.max(0, 1 - progress * 1.6);
          content.style.opacity   = fade.toFixed(3);
          content.style.transform = `translateY(${-120 * progress}px)`;
        }

        // "Role para explorar" some logo
        if (hint) {
          hint.style.opacity = Math.max(0, 1 - progress * 3).toFixed(3);
        }
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ═══════════════ 3. ANIMAÇÕES GSAP (opcional) ═══════════════ */
  // Reveal suave das seções ao rolar
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const sections = document.querySelectorAll('.bg-sec, .fire-sec, .cta-sec');

    sections.forEach((section) => {
      const inner = section.querySelector('.container, .fire-wrap');

      if (!inner) return;

      gsap.fromTo(
        inner,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 40%',
            scrub: false,
          },
        }
      );
    });
  }

})();
