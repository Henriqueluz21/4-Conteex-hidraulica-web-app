/* ============================================================
   HSG — Acabamento profissional
   Complementa smooth-scroll.js, anime-animations.js e
   interactions.js. Não mexe em lógica de carrinho/tema/filtro.

   O que este arquivo adiciona:
   1) Barra de progresso de leitura no topo da página
   2) Botão "voltar ao topo" que aparece ao rolar
   3) Linha de destaque que "desenha" sob os títulos de seção
   4) Parallax suave no conteúdo do hero
   5) Botões do hero com efeito magnético
   6) Aviso (toast) "adicionado ao carrinho"
   7) Pulso no ícone do carrinho e no contador
   8) Imagens com fade-in ao carregar (sem "pipocar")
   9) Imagem da seção "Por que comprar" assenta ao aparecer
  10) Produtos reaparecem em cascata ao trocar de filtro
  11) Hover refinado em cards, ícones e imagens (CSS)

   A curva de easing vem de window.HSG (definido em
   smooth-scroll.js), então tudo segue a mesma curva.

   Ordem de carregamento (fim do <body>):
   js.js → anime.js → smooth-scroll.js → anime-animations.js
   → interactions.js → pro.animations.js
   ============================================================ */

(function () {
    'use strict';

    const HSG = window.HSG || {};
    const ANIME_READY = typeof anime !== 'undefined';
    const reduceMotion = typeof HSG.prefersReducedMotion === 'boolean'
        ? HSG.prefersReducedMotion
        : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canAnimate = ANIME_READY && !reduceMotion;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const EASE_INOUT = HSG.EASE_INOUT || 'cubicBezier(0.65, 0.00, 0.35, 1.00)';
    const EASE_OUT = HSG.EASE_OUT || 'cubicBezier(0.16, 1.00, 0.30, 1.00)';

    // Converte 'cubicBezier(a, b, c, d)' do anime.js para 'cubic-bezier(a, b, c, d)' do CSS
    function toCssBezier(easing, fallback) {
        const m = /\(([^)]+)\)/.exec(easing);
        return m ? 'cubic-bezier(' + m[1] + ')' : fallback;
    }

    const CSS_INOUT = toCssBezier(EASE_INOUT, 'cubic-bezier(0.65, 0, 0.35, 1)');
    const CSS_OUT = toCssBezier(EASE_OUT, 'cubic-bezier(0.16, 1, 0.3, 1)');

    /* ------------------------------------------------------------
       CSS de apoio, injetado uma única vez.
       Usa a propriedade "translate" (separada de "transform") nos
       hovers, para não brigar com os transforms inline do anime.js.
       ------------------------------------------------------------ */
    function injectStyles() {
        if (document.getElementById('hsg-pro-style')) return;

        const style = document.createElement('style');
        style.id = 'hsg-pro-style';
        style.textContent = `
            :root {
                --hsg-ease: ${CSS_INOUT};
                --hsg-ease-out: ${CSS_OUT};
            }

            /* 1) Barra de progresso */
            .hsg-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: var(--color-primary, #2563eb);
                transform: scaleX(0);
                transform-origin: 0 50%;
                pointer-events: none;
                z-index: 10001;
                will-change: transform;
            }

            /* 2) Voltar ao topo */
            .hsg-top {
                position: fixed;
                right: 24px;
                bottom: 24px;
                width: 46px;
                height: 46px;
                display: grid;
                place-items: center;
                border: 0;
                border-radius: 50%;
                background: var(--color-primary, #2563eb);
                color: #fff;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(0, 0, 0, .22);
                z-index: 900;
                opacity: 0;
                visibility: hidden;
                translate: 0 16px;
                transition:
                    opacity .4s var(--hsg-ease),
                    translate .4s var(--hsg-ease),
                    visibility 0s linear .4s;
            }
            .hsg-top.is-visible {
                opacity: 1;
                visibility: visible;
                translate: 0 0;
                transition-delay: 0s;
            }
            .hsg-top:hover { translate: 0 -3px; }
            .hsg-top:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

            /* 3) Linha de destaque sob os títulos de seção */
            .section-header__title::after {
                content: '';
                display: block;
                width: 48px;
                height: 3px;
                margin-top: 10px;
                border-radius: 3px;
                background: var(--color-primary, #2563eb);
                transform: scaleX(0);
                transform-origin: left center;
                transition: transform .9s var(--hsg-ease) .25s;
            }
            .text-center .section-header__title::after {
                margin-inline: auto;
                transform-origin: center;
            }
            .section-header__title.is-inview::after { transform: scaleX(1); }

            /* 6) Toast */
            .hsg-toasts {
                position: fixed;
                left: 0;
                right: 0;
                bottom: 24px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                pointer-events: none;
                z-index: 10000;
            }
            .hsg-toast {
                display: flex;
                align-items: center;
                gap: 10px;
                max-width: min(92vw, 420px);
                padding: 12px 18px;
                border-radius: 12px;
                background: #111827;
                color: #fff;
                font-size: 14px;
                line-height: 1.35;
                box-shadow: 0 12px 32px rgba(0, 0, 0, .28);
                opacity: 0;
                translate: 0 18px;
                transition:
                    opacity .4s var(--hsg-ease),
                    translate .4s var(--hsg-ease);
            }
            .hsg-toast.is-in { opacity: 1; translate: 0 0; }
            .hsg-toast__icon {
                flex: none;
                width: 22px;
                height: 22px;
                display: grid;
                place-items: center;
                border-radius: 50%;
                background: #22c55e;
                font-size: 13px;
                font-weight: 700;
            }

            .hsg-toast__icon.is-fav { background: #e0245e; }

            /* 11) Hover refinado */
            .product-card,
            .category-card {
                transition:
                    translate .4s var(--hsg-ease-out),
                    box-shadow .4s var(--hsg-ease-out),
                    border-color .3s ease;
            }
            .product-card__image { overflow: hidden; }
            .product-card__image img { transition: transform .8s var(--hsg-ease-out); }
            .category-card__icon svg,
            .trust-bar__item svg { transition: transform .5s var(--hsg-ease-out); }

            @media (hover: hover) {
                .product-card:hover {
                    translate: 0 -6px;
                    box-shadow: 0 18px 40px rgba(0, 0, 0, .12);
                }
                .product-card:hover .product-card__image img { transform: scale(1.06); }
                .category-card:hover {
                    translate: 0 -4px;
                    box-shadow: 0 14px 32px rgba(0, 0, 0, .10);
                }
                .category-card:hover .category-card__icon svg {
                    transform: translateY(-3px) rotate(-6deg) scale(1.08);
                }
                .trust-bar__item:hover svg { transform: translateY(-3px) scale(1.1); }
            }

            @media (max-width: 640px) {
                .hsg-top { right: 16px; bottom: 88px; }
                .hsg-toasts { bottom: 16px; }
            }

            @media (prefers-reduced-motion: reduce) {
                .product-card:hover,
                .category-card:hover { translate: none; }
                .product-card:hover .product-card__image img,
                .category-card:hover .category-card__icon svg,
                .trust-bar__item:hover svg { transform: none; }
                .section-header__title::after { transition: none; transform: scaleX(1); }
                .hsg-top, .hsg-toast { transition: none; }
            }
        `;
        document.head.appendChild(style);
    }

    /* ============================================================
       1) BARRA DE PROGRESSO DE LEITURA
       ============================================================ */
    function setupProgressBar() {
        const bar = document.createElement('div');
        bar.className = 'hsg-progress';
        bar.setAttribute('aria-hidden', 'true');
        document.body.appendChild(bar);

        let ticking = false;

        function update() {
            ticking = false;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? window.scrollY / max : 0;
            bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')';
        }

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        }, { passive: true });

        window.addEventListener('resize', update);
        update();
    }

    /* ============================================================
       2) VOLTAR AO TOPO
       ============================================================ */
    function setupBackToTop() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hsg-top';
        btn.setAttribute('aria-label', 'Voltar ao topo');
        btn.innerHTML =
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path></svg>';
        document.body.appendChild(btn);

        function toggle() {
            btn.classList.toggle('is-visible', window.scrollY > 600);
        }

        window.addEventListener('scroll', toggle, { passive: true });
        toggle();

        btn.addEventListener('click', () => {
            // Usa o scroll suave do site (mesma curva); sem ele, cai no scroll nativo
            if (window.HSG && typeof window.HSG.scrollTo === 'function') {
                window.HSG.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    /* ============================================================
       3) LINHA DE DESTAQUE SOB OS TÍTULOS
       ============================================================ */
    function setupTitleAccent() {
        const titles = document.querySelectorAll('.section-header__title');
        if (!titles.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            titles.forEach(t => t.classList.add('is-inview'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-inview');
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.6 });

        titles.forEach(t => observer.observe(t));
    }

    /* ============================================================
       4) PARALLAX SUAVE NO HERO
       ============================================================ */
    function setupHeroParallax() {
        if (reduceMotion) return;

        const hero = document.querySelector('.hero');
        const content = hero ? hero.querySelector('.container') : null;
        if (!content) return;

        content.style.willChange = 'transform, opacity';

        let ticking = false;

        function update() {
            ticking = false;
            const h = hero.offsetHeight;
            const y = window.scrollY;
            if (!h || y > h) return; // hero fora da tela

            const p = Math.min(1, Math.max(0, y / h));
            content.style.transform = 'translate3d(0, ' + (p * 60) + 'px, 0)';
            content.style.opacity = String(1 - p * 0.9);
        }

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        }, { passive: true });

        update();
    }

    /* ============================================================
       5) BOTÕES DO HERO COM EFEITO MAGNÉTICO
       ============================================================ */
    function setupMagneticButtons() {
        if (!canAnimate || !hasFinePointer) return;

        document.querySelectorAll('.hero__actions .btn').forEach(btn => {
            // Tira só o "transform" das transições do CSS, para não atrasar o movimento
            btn.style.transitionProperty =
                'background-color, color, border-color, box-shadow, opacity';

            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
                const y = (e.clientY - (r.top + r.height / 2)) * 0.35;

                anime.remove(btn);
                anime({
                    targets: btn,
                    translateX: x,
                    translateY: y,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

            btn.addEventListener('mouseleave', () => {
                anime.remove(btn);
                anime({
                    targets: btn,
                    translateX: 0,
                    translateY: 0,
                    duration: 800,
                    easing: 'easeOutElastic(1, .5)'
                });
            });
        });
    }

    /* ============================================================
       6) TOAST — "adicionado ao carrinho"
       ============================================================ */
    function setupToasts() {
        const wrap = document.createElement('div');
        wrap.className = 'hsg-toasts';
        wrap.setAttribute('aria-live', 'polite');
        document.body.appendChild(wrap);

        function show(message, kind) {
            while (wrap.children.length >= 3) wrap.firstElementChild.remove();

            const toast = document.createElement('div');
            toast.className = 'hsg-toast';

            const icon = document.createElement('span');
            icon.className = 'hsg-toast__icon' + (kind === 'fav' ? ' is-fav' : '');
            icon.textContent = kind === 'fav' ? '♥' : '✓';

            const text = document.createElement('span');
            text.textContent = message;

            toast.append(icon, text);
            wrap.appendChild(toast);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => toast.classList.add('is-in'));
            });

            setTimeout(() => {
                toast.classList.remove('is-in');
                setTimeout(() => toast.remove(), 450);
            }, 2800);
        }

        // Disponível para outros scripts (ex.: cart-favorites.js)
        window.HSG = window.HSG || {};
        window.HSG.toast = show;

        // Captura (true) para funcionar mesmo se outro script parar a propagação do clique
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart');
            if (!btn) return;

            const name = btn.dataset.name;
            show(name ? name + ' adicionado ao carrinho' : 'Produto adicionado ao carrinho');
        }, true);
    }

    /* ============================================================
       7) CARRINHO — pulso no ícone e "pop" no contador
       ============================================================ */
    function setupCartFeedback() {
        const toggle = document.getElementById('cart-toggle');
        const badge = document.getElementById('cart-count');

        // interactions.js chama esta função quando a imagem chega ao carrinho
        if (typeof window.hsgAnimateCartIcon !== 'function') {
            window.hsgAnimateCartIcon = function () {
                if (!canAnimate || !toggle) return;
                anime.remove(toggle);
                anime({
                    targets: toggle,
                    scale: [1, 1.18, 0.94, 1],
                    rotate: [0, -10, 8, 0],
                    duration: 650,
                    easing: EASE_OUT
                });
            };
        }

        if (!canAnimate || !badge || typeof MutationObserver === 'undefined') return;

        let last = badge.textContent;

        new MutationObserver(() => {
            const now = badge.textContent;
            if (now === last) return;
            last = now;

            anime.remove(badge);
            anime({
                targets: badge,
                scale: [1, 1.5, 1],
                duration: 450,
                easing: EASE_OUT
            });
        }).observe(badge, { childList: true, characterData: true, subtree: true });
    }

    /* ============================================================
       8) IMAGENS — fade-in ao carregar
       ============================================================ */
    function setupImageFade() {
        if (!canAnimate) return;

        document.querySelectorAll('.product-card__image img, .about-strip__panel img').forEach(img => {
            if (img.complete) return; // já carregada: nada a fazer

            img.style.opacity = '0';

            img.addEventListener('load', () => {
                anime({
                    targets: img,
                    opacity: [0, 1],
                    duration: 600,
                    easing: 'easeOutQuad'
                });
            }, { once: true });

            img.addEventListener('error', () => { img.style.opacity = '1'; }, { once: true });

            // Rede travada: nunca deixa a imagem invisível para sempre
            setTimeout(() => {
                if (img.style.opacity === '0') img.style.opacity = '1';
            }, 8000);
        });
    }

    /* ============================================================
       9) IMAGEM DA SEÇÃO "POR QUE COMPRAR" — assenta ao aparecer
       ============================================================ */
    function setupImageSettle() {
        if (!canAnimate || !('IntersectionObserver' in window)) return;

        const img = document.querySelector('.about-strip__panel img');
        if (!img) return;

        img.style.transform = 'scale(1.15)';

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                anime({
                    targets: img,
                    scale: [1.15, 1],
                    duration: 1400,
                    easing: EASE_OUT
                });
                obs.disconnect();
            });
        }, { threshold: 0.25 });

        observer.observe(img);
    }

    /* ============================================================
       10) FILTROS — produtos reaparecem em cascata
       Só anima cards que já tinham sido revelados, estão na tela e
       voltaram a ficar visíveis (o js.js decide quem mostra/esconde).
       ============================================================ */
    function setupFilterReentrance() {
        if (!canAnimate || typeof MutationObserver === 'undefined') return;

        const grid = document.querySelector('.products-grid');
        if (!grid) return;

        const shown = new WeakMap();
        const isShown = el => el.getClientRects().length > 0;
        const inViewport = el => {
            const r = el.getBoundingClientRect();
            return r.bottom > 0 && r.top < window.innerHeight;
        };

        grid.querySelectorAll('.product-card').forEach(card => shown.set(card, isShown(card)));

        new MutationObserver((mutations) => {
            const reappeared = new Set();

            mutations.forEach(m => {
                const el = m.target;
                if (!el.classList || !el.classList.contains('product-card')) return;

                const before = shown.get(el);
                const now = isShown(el);
                shown.set(el, now);

                // inline opacity "1" = o card já passou pela revelação ao rolar
                if (before === false && now && el.style.opacity === '1' && inViewport(el)) {
                    reappeared.add(el);
                }
            });

            if (!reappeared.size) return;

            const list = Array.from(reappeared);
            anime.remove(list);
            anime({
                targets: list,
                opacity: [0, 1],
                translateY: [24, 0],
                scale: [0.97, 1],
                duration: 600,
                delay: anime.stagger(60),
                easing: EASE_OUT
            });
        }).observe(grid, {
            attributes: true,
            attributeFilter: ['style', 'class', 'hidden'],
            subtree: true
        });
    }

    /* ============================================================
       INICIALIZAÇÃO
       Cada módulo roda isolado: se um falhar, os outros continuam.
       ============================================================ */
    function init() {
        [
            injectStyles,
            setupProgressBar,
            setupBackToTop,
            setupTitleAccent,
            setupHeroParallax,
            setupMagneticButtons,
            setupToasts,
            setupCartFeedback,
            setupImageFade,
            setupImageSettle,
            setupFilterReentrance
        ].forEach(fn => {
            try {
                fn();
            } catch (err) {
                console.warn('[HSG] ' + fn.name + ' falhou:', err);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();