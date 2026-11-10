(() => {
  const hero    = document.querySelector('#expand-hero');
  const media   = document.querySelector('#expand-hero .expand-media img');
  const content = document.querySelector('#expand-hero .hero-content');
  const hint    = document.querySelector('#expand-hero .scroll-hint');

  if (!hero || !media) return;

  let frame = 0;

  const update = () => {
    cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {
      const rect     = hero.getBoundingClientRect();
      const total    = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const isMobile = window.innerWidth <= 768;

      // Tamanho do card -> tela cheia
      const startW = isMobile ? 84 : 56;
      const startH = isMobile ? 62 : 68;
      const w = startW + (100 - startW) * progress;
      const h = startH + (100 - startH) * progress;
      const radius = (isMobile ? 20 : 28) * (1 - progress);

      media.style.width       = w + 'vw';
      media.style.height      = h + 'vh';
      media.style.borderRadius = radius + 'px';

      // Conteúdo sobe e desaparece
      const fade = 1 - progress * 1.6;
      content.style.opacity   = Math.max(0, fade).toFixed(3);
      content.style.transform = `translateY(${-120 * progress}px)`;

      // Hint some rápido
      if (hint) {
        hint.style.opacity = Math.max(0, 1 - progress * 3).toFixed(3);
      }
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
