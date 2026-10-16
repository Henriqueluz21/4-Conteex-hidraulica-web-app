/* ============================================================
   HSG — ANIMAÇÕES DE ENTRADA E REVELAÇÃO AO ROLAR
   Usa a biblioteca anime.js (já carregada via CDN no HTML)

   Novidades desta versão:
   - Elementos que entram juntos (ex.: uma fileira de cards)
     aparecem em cascata, da esquerda para a direita.
   - A revelação ao rolar usa a mesma curva bezier inOut do
     scroll suave (window.HSG.EASE_INOUT, de smooth-scroll.js).
   ============================================================ */

function hsgRevealFallback(selector) {
    // Se o anime.js não carregar por algum motivo, garante que o
    // conteúdo continue visível em vez de sumir para sempre.
    document.querySelectorAll(selector).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

function setupHeroEntrance() {
    anime.timeline({ easing: 'easeOutExpo' })
        .add({
            targets: '.hero__eyebrow',
            opacity: [0, 1],
            translateY: [25, 0],
            duration: 600
        })
        .add({
            targets: '.hero__title',
            opacity: [0, 1],
            translateY: [70, 0],
            duration: 900
        }, '-=300')
        .add({
            targets: '.hero__subtitle',
            opacity: [0, 1],
            translateY: [35, 0],
            duration: 700
        }, '-=500')
        .add({
            targets: '.hero__actions',
            opacity: [0, 1],
            translateY: [25, 0],
            duration: 600
        }, '-=400');
}

function setupScrollReveal() {
    const revealSelector =
        '.product-card, .category-card, .trust-bar__item, ' +
        '.section-header, .about-strip, .hsg-video-wrapper, .hsg-video-header';

    const revealEls = document.querySelectorAll(revealSelector);
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
        hsgRevealFallback(revealSelector);
        return;
    }

    // Mesma curva do scroll suave
    const ease = (window.HSG && window.HSG.EASE_INOUT) || 'easeInOutCubic';

    const observer = new IntersectionObserver((entries, obs) => {
        // Ordena por fileira (de cima para baixo) e depois da esquerda para a direita
        const entering = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => {
                const rowA = Math.round(a.boundingClientRect.top / 16);
                const rowB = Math.round(b.boundingClientRect.top / 16);
                return rowA !== rowB
                    ? rowA - rowB
                    : a.boundingClientRect.left - b.boundingClientRect.left;
            });

        entering.forEach((entry, i) => {
            anime({
                targets: entry.target,
                opacity: [0, 1],
                translateY: [40, 0],
                duration: 800,
                delay: Math.min(i, 6) * 90,
                easing: ease
            });
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
}

function initHSGAnimations() {
    // Respeita quem prefere menos movimento na tela
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof anime === 'undefined') {
        console.warn('anime.js não foi carregado — pulando animações e mantendo o conteúdo visível.');
        hsgRevealFallback(
            '.hero__eyebrow, .hero__title, .hero__subtitle, .hero__actions, ' +
            '.product-card, .category-card, .trust-bar__item, .section-header, ' +
            '.about-strip, .hsg-video-wrapper, .hsg-video-header'
        );
        return;
    }

    if (reduceMotion) {
        hsgRevealFallback(
            '.hero__eyebrow, .hero__title, .hero__subtitle, .hero__actions, ' +
            '.product-card, .category-card, .trust-bar__item, .section-header, ' +
            '.about-strip, .hsg-video-wrapper, .hsg-video-header'
        );
        return;
    }

    setupHeroEntrance();
    setupScrollReveal();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHSGAnimations);
} else {
    initHSGAnimations();
}