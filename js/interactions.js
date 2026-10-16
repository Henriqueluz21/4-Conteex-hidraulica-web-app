/* ============================================================
   HSG — Microinterações
   Complementa anime-animations.js com feedback visual em pontos
   de contato do usuário (comprar, favoritar, filtrar, tema,
   header ao rolar). Não cuida de lógica de carrinho/tema/filtro
   — isso continua em js.js.

   Requer anime.js carregado antes. Se ele não estiver disponível,
   todas as interações continuam funcionando normalmente (clique,
   favoritar, filtrar) — só ficam sem a "animação extra".

   Ordem de carregamento sugerida no fim do <body>:
   <script src="js.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js"></script>
   <script src="smooth-scroll.js"></script>
   <script src="anime-animations.js"></script>
   <script src="interactions.js"></script>
   ============================================================ */

(function () {
    'use strict';

    const ANIME_READY = typeof anime !== 'undefined';
    const prefersReducedMotion = (window.HSG && window.HSG.prefersReducedMotion) ??
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canAnimate = ANIME_READY && !prefersReducedMotion;

    const EASE_INOUT = (window.HSG && window.HSG.EASE_INOUT) || 'cubicBezier(0.65, 0.00, 0.35, 1.00)';
    const EASE_OUT = (window.HSG && window.HSG.EASE_OUT) || 'cubicBezier(0.16, 1.00, 0.30, 1.00)';

    function run(fn) {
        if (!canAnimate) return;
        fn();
    }

    /* ------------------------------------------------------------
       CSS de apoio, injetado uma única vez.
       ------------------------------------------------------------ */
    (function injectStyles() {
        if (document.getElementById('hsg-interactions-style')) return;

        const style = document.createElement('style');
        style.id = 'hsg-interactions-style';
        style.textContent = `
            .header {
                will-change: transform;
            }
            .header--scrolled {
                box-shadow: 0 6px 20px rgba(0, 0, 0, .08);
            }
            .filter-bar {
                position: relative;
            }
            .filter-pill__indicator {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                border-radius: 999px;
                background: var(--color-primary, #2563eb);
                opacity: .12;
                pointer-events: none;
                z-index: 0;
                transition: transform .25s ease, width .25s ease; /* fallback sem anime.js */
            }
            .filter-pill {
                position: relative;
                z-index: 1;
            }
            .product-card__wishlist.is-active {
                color: #e0245e;
            }
            .fly-to-cart {
                position: fixed;
                border-radius: 10px;
                object-fit: cover;
                pointer-events: none;
                z-index: 9999;
                will-change: transform, opacity;
            }
        `;
        document.head.appendChild(style);
    })();

    /* ============================================================
       1) HEADER — esconde ao descer, aparece ao subir
       ============================================================ */
    function setupHeaderOnScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastY = window.scrollY;
        let hidden = false;
        let ticking = false;

        function apply(hide) {
            if (hide === hidden) return;
            hidden = hide;

            if (canAnimate) {
                anime({
                    targets: header,
                    translateY: hide ? '-100%' : '0%',
                    duration: 450,
                    easing: EASE_INOUT
                });
            } else {
                header.style.transform = hide ? 'translateY(-100%)' : 'translateY(0)';
            }
        }

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const y = window.scrollY;

                header.classList.toggle('header--scrolled', y > 20);

                if (y > lastY && y > 120) {
                    apply(true);
                } else if (y < lastY) {
                    apply(false);
                }

                lastY = y;
                ticking = false;
            });
        }, { passive: true });
    }

    /* ============================================================
       2) FILTROS — indicador deslizante atrás do filtro ativo
       ============================================================ */
    function setupFilterIndicator() {
        const bar = document.querySelector('.filter-bar');
        if (!bar) return;

        const pills = bar.querySelectorAll('.filter-pill');
        if (!pills.length) return;

        const indicator = document.createElement('div');
        indicator.className = 'filter-pill__indicator';
        bar.insertBefore(indicator, bar.firstChild);

        function moveTo(pill, animated) {
            const barRect = bar.getBoundingClientRect();
            const pillRect = pill.getBoundingClientRect();

            const left = pillRect.left - barRect.left;
            const width = pillRect.width;

            if (!animated || !canAnimate) {
                indicator.style.transform = `translateX(${left}px)`;
                indicator.style.width = width + 'px';
                return;
            }

            anime({
                targets: indicator,
                translateX: left,
                width: width,
                duration: 400,
                easing: EASE_OUT
            });
        }

        const current = bar.querySelector('.filter-pill.active') || pills[0];
        moveTo(current, false);

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                moveTo(pill, true);
            });
        });

        window.addEventListener('resize', () => {
            const active = bar.querySelector('.filter-pill.active') || pills[0];
            moveTo(active, false);
        });
    }

    /* ============================================================
       3) FAVORITAR — coração "pulsa" ao clicar
       ============================================================ */
    function setupWishlistPop() {
        document.querySelectorAll('.product-card__wishlist').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('is-active');

                run(() => {
                    anime({
                        targets: btn,
                        scale: [1, 1.35, 0.9, 1.1, 1],
                        duration: 550,
                        easing: EASE_INOUT
                    });
                });
            });
        });
    }

    /* ============================================================
       4) COMPRAR — a imagem "voa" até o ícone do carrinho
       ============================================================ */
    function setupFlyToCart() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart');
            if (!btn) return;

            const card = btn.closest('.product-card');
            const img = card ? card.querySelector('.product-card__image img') : null;
            const cartIcon = document.getElementById('cart-toggle');

            // Sem anime.js ou sem os elementos, apenas confirma o clique — nunca trava o fluxo de compra
            if (!canAnimate || !img || !cartIcon) {
                if (typeof window.hsgAnimateCartIcon === 'function') {
                    window.hsgAnimateCartIcon();
                }
                return;
            }

            const imgRect = img.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();

            const clone = img.cloneNode(true);
            clone.classList.add('fly-to-cart');
            clone.style.left = imgRect.left + 'px';
            clone.style.top = imgRect.top + 'px';
            clone.style.width = imgRect.width + 'px';
            clone.style.height = imgRect.height + 'px';
            document.body.appendChild(clone);

            anime({
                targets: btn,
                scale: [1, 0.92, 1],
                duration: 250,
                easing: EASE_OUT
            });

            anime({
                targets: clone,
                left: cartRect.left + cartRect.width / 2 - 14,
                top: cartRect.top + cartRect.height / 2 - 14,
                width: 28,
                height: 28,
                opacity: [1, 0.6],
                rotate: 8,
                duration: 700,
                easing: EASE_INOUT,
                complete: () => {
                    clone.remove();
                    if (typeof window.hsgAnimateCartIcon === 'function') {
                        window.hsgAnimateCartIcon();
                    }
                }
            });
        });
    }

    /* ============================================================
       5) CARRINHO — itens entram em stagger quando adicionados
       ============================================================ */
    function setupCartItemsStagger() {
        const list = document.getElementById('cart-items');
        if (!list || typeof MutationObserver === 'undefined') return;

        const observer = new MutationObserver((mutations) => {
            const added = [];
            mutations.forEach(m => added.push(...m.addedNodes));
            const elements = added.filter(n => n.nodeType === 1);
            if (!elements.length) return;

            if (!canAnimate) return; // itens já aparecem normalmente, sem precisar animar

            elements.forEach(el => { el.style.opacity = '0'; });

            anime({
                targets: elements,
                opacity: [0, 1],
                translateX: [24, 0],
                duration: 450,
                delay: anime.stagger(70),
                easing: EASE_OUT
            });
        });

        observer.observe(list, { childList: true });
    }

    /* ============================================================
       6) TEMA — ícone gira ao trocar claro/escuro
       ============================================================ */
    function setupThemeToggleSpin() {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        btn.addEventListener('click', () => {
            run(() => {
                anime({
                    targets: btn,
                    rotate: '+=180',
                    scale: [1, 1.15, 1],
                    duration: 500,
                    easing: EASE_INOUT
                });
            });
        });
    }

    /* ============================================================
       7) NEWSLETTER — campo "respira" ao focar
       ============================================================ */
    function setupNewsletterFocus() {
        const input = document.querySelector('section input[type="email"]');
        if (!input) return;

        input.addEventListener('focus', () => {
            run(() => {
                anime({
                    targets: input,
                    scale: [1, 1.015],
                    duration: 300,
                    easing: EASE_OUT
                });
            });
        });

        input.addEventListener('blur', () => {
            run(() => {
                anime({
                    targets: input,
                    scale: 1,
                    duration: 300,
                    easing: EASE_OUT
                });
            });
        });
    }

    /* ============================================================
       INICIALIZAÇÃO
       ============================================================ */
    function init() {
        setupHeaderOnScroll();
        setupFilterIndicator();
        setupWishlistPop();
        setupFlyToCart();
        setupCartItemsStagger();
        setupThemeToggleSpin();
        setupNewsletterFocus();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();