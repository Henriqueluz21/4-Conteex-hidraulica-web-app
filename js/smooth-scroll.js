/* ============================================================
   HSG — Scroll suave com a curva do anime.js
   Curva: cubicBezier(0.65, 0.00, 0.35, 1.00)  (bezier inOut)

   Como funciona:
   - Cada giro de roda do mouse dispara uma animação real até o
     destino, seguindo a curva inOut: começa devagar, acelera no
     meio e desacelera macio na chegada.
   - Se o usuário continuar rolando ANTES de a animação terminar,
     o novo trecho usa uma curva "out" (já começa em movimento).
     Reiniciar a curva inOut a cada tick faria a página parar e
     arrancar de novo — era isso que deixava o scroll travado.
   - Links âncora (#secao) usam sempre a curva inOut completa.

   As constantes de easing ficam em window.HSG, para que
   anime-animations.js e interactions.js usem a MESMA curva.

   Requer anime.js carregado ANTES deste script. Sem ele, o
   scroll nativo continua funcionando. Em touch e com
   "reduzir movimento" ativo, o scroll nativo também é mantido.
   ============================================================ */

(function () {
    'use strict';

    /* ---------- Constantes compartilhadas (definidas antes de qualquer return) ---------- */
    window.HSG = window.HSG || {};
    window.HSG.EASE_INOUT = window.HSG.EASE_INOUT || 'cubicBezier(0.65, 0.00, 0.35, 1.00)';
    window.HSG.EASE_OUT = window.HSG.EASE_OUT || 'cubicBezier(0.16, 1.00, 0.30, 1.00)';
    if (typeof window.HSG.prefersReducedMotion === 'undefined') {
        window.HSG.prefersReducedMotion =
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    if (typeof anime === 'undefined') {
        console.warn(
            '[HSG] anime.js não foi encontrado — smooth-scroll.js precisa dele ' +
            'carregado antes na página. O scroll nativo continua funcionando.'
        );
        return;
    }

    const isTouchDevice = matchMedia('(hover: none), (pointer: coarse)').matches;
    if (window.HSG.prefersReducedMotion || isTouchDevice) return;

    /* Se o CSS tiver "scroll-behavior: smooth", ele brigaria com a animação
       (cada scrollTo viraria outra animação). Aqui garantimos scroll instantâneo. */
    const styleFix = document.createElement('style');
    styleFix.textContent = 'html { scroll-behavior: auto !important; }';
    document.head.appendChild(styleFix);

    const EASE_INOUT = window.HSG.EASE_INOUT;
    const EASE_OUT = window.HSG.EASE_OUT;

    const DURATION = 850;          // ms por "empurrão" da roda — maior = mais lento
    const ANCHOR_DURATION = 1100;  // ms para links âncora
    const WHEEL_MULTIPLIER = 1;    // sensibilidade da roda

    const scrollProxy = { y: window.scrollY };
    let currentAnim = null;
    let pendingTarget = window.scrollY;
    let active = false;

    function maxScroll() {
        return document.documentElement.scrollHeight - window.innerHeight;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function animateTo(targetY, duration, easing) {
        if (currentAnim) currentAnim.pause();

        scrollProxy.y = window.scrollY;
        pendingTarget = clamp(targetY, 0, maxScroll());
        active = true;

        currentAnim = anime({
            targets: scrollProxy,
            y: pendingTarget,
            duration: duration,
            easing: easing,
            update: () => window.scrollTo(0, scrollProxy.y),
            complete: () => { active = false; }
        });
    }

    function stopAnimation() {
        if (currentAnim) currentAnim.pause();
        active = false;
    }

    /* Converte o delta da roda para pixels (Firefox usa "linhas", não pixels) */
    function wheelDeltaPx(e) {
        if (e.deltaMode === 1) return e.deltaY * 32;
        if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
        return e.deltaY;
    }

    /* true se o elemento sob o mouse (ex.: lista do carrinho) ainda pode rolar
       na direção da roda — nesse caso deixamos o scroll nativo cuidar dele */
    function canScrollInside(el, deltaY) {
        while (el && el !== document.body && el !== document.documentElement) {
            if (el.nodeType === 1) {
                const overflowY = getComputedStyle(el).overflowY;
                if ((overflowY === 'auto' || overflowY === 'scroll') &&
                    el.scrollHeight > el.clientHeight) {
                    const atTop = el.scrollTop <= 0;
                    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
                    if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) return true;
                }
            }
            el = el.parentElement;
        }
        return false;
    }

    function onWheel(e) {
        if (e.ctrlKey) return; // zoom por pinça / Ctrl + roda
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // rolagem horizontal
        if (e.target.closest && e.target.closest('[data-native-scroll]')) return;

        const delta = wheelDeltaPx(e) * WHEEL_MULTIPLIER;
        if (canScrollInside(e.target, delta)) return;

        e.preventDefault();

        const base = active ? pendingTarget : window.scrollY;
        const target = clamp(base + delta, 0, maxScroll());
        if (target === base) return;

        // Primeiro empurrão: curva inOut. Empurrões seguidos: curva out (sem "arrancar" de novo)
        animateTo(target, DURATION, active ? EASE_OUT : EASE_INOUT);
    }

    function onResize() {
        pendingTarget = clamp(pendingTarget, 0, maxScroll());
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    // Teclado ou clique na barra de rolagem assumem o controle: cancela a animação em andamento
    window.addEventListener('keydown', (e) => {
        if (!active) return;
        const scrollKeys = [' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'];
        if (scrollKeys.includes(e.key)) stopAnimation();
    });

    window.addEventListener('pointerdown', (e) => {
        if (e.target === document.documentElement) stopAnimation();
    });

    // Permite que outros scripts (ex.: "voltar ao topo") rolem com a mesma curva
    window.HSG.scrollTo = (y) => animateTo(y, ANCHOR_DURATION, EASE_INOUT);

    // Links âncora usam a curva inOut completa, com duração maior
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const id = link.getAttribute('href').slice(1);
        const dest = id ? document.getElementById(id) : null;
        if (!dest) return;

        e.preventDefault();
        const destY = dest.getBoundingClientRect().top + window.scrollY;
        animateTo(destY, ANCHOR_DURATION, EASE_INOUT);
    });

})();