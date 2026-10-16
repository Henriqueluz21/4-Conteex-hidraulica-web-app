// slider.js — Slider infinito de produtos
(function () {
    const track = document.getElementById('slider-track');
    if (!track) return;

    // Segurança contra execução dupla (crash de redeclaração de const)
    if (track.dataset.duplicated === 'true') return;
    track.dataset.duplicated = 'true';

    // 1) Duplica o conteúdo para o loop ficar perfeito
    const cards = track.innerHTML;
    track.innerHTML = cards + cards;

    // 2) Anima de forma infinita (só se GSAP carregado E sem preferência de reduzir movimento)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof gsap !== 'undefined' && !prefersReduced) {
        const tween = gsap.to(track, {
            xPercent: -50,
            duration: 30,
            ease: 'none',
            repeat: -1
        });

        track.addEventListener('mouseenter', () => tween.pause());
        track.addEventListener('mouseleave', () => tween.resume());
    }

    // 3) Re-linka os cards E reaplica o estado de favoritos após a duplicação
    if (typeof linkProductCards === 'function') linkProductCards();
    if (typeof loadFavoriteButtons === 'function') loadFavoriteButtons();
})();
