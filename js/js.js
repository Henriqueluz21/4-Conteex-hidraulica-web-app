/* ============================================================
   HSG HIDRÁULICA SÃO GABRIEL
   Sistema completo de interação da loja
   (carrinho, favoritos, busca, filtros, newsletter, voltar ao topo)
   ============================================================ */

const CART_KEY = 'hidraulica_sao_gabriel_cart';
const FAVORITES_KEY = 'hidraulica_sao_gabriel_favorites';


// ============================================================
// ESTADO
// ============================================================

let cart = loadCart();
let favorites = loadFavorites();


// ============================================================
// ELEMENTOS DO DOM
// ============================================================

const cartToggle  = document.getElementById('cart-toggle');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartClose   = document.getElementById('cart-close');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const TOKEN_KEY = 'conteex_access_token';


// ============================================================
// LOCAL STORAGE
// ============================================================

function loadCart() {
    try {
        const saved = localStorage.getItem(CART_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
    }
}

function loadFavorites() {
    try {
        const saved = localStorage.getItem(FAVORITES_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        return [];
    }
}

function saveFavorites() {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Erro ao salvar favoritos:', error);
    }
}


// ============================================================
// FORMATAÇÃO
// ============================================================

function formatPrice(value) {
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}


// ============================================================
// PROTEÇÃO CONTRA HTML
// ============================================================

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


// ============================================================
// CARRINHO
// ============================================================

function addToCart(product) {
    if (!product.name || isNaN(product.price)) {
        showNotification('Não foi possível adicionar o produto.', 'error');
        return;
    }

    const existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            img: product.img,
            qty: 1
        });
    }

    saveCart();
    renderCart();
    animateCart();

    showNotification(`${product.name} foi adicionado ao carrinho.`, 'success');
}

function changeQty(name, delta) {
    const item = cart.find(item => item.name === name);
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
        cart = cart.filter(i => i.name !== name);
    }

    saveCart();
    renderCart();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    renderCart();
    showNotification('Produto removido do carrinho.', 'info');
}


// ============================================================
// RENDERIZAR CARRINHO
// ============================================================

function renderCart() {
    if (!cartCountEl || !cartItemsEl || !cartTotalEl) {
        return;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems === 0 ? 'none' : 'block';

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="cart-empty">
                <div style="font-size:42px;margin-bottom:10px;">🛒</div>
                <strong>Seu carrinho está vazio</strong>
                <p style="margin-top:6px;">Adicione produtos para continuar.</p>
            </div>
        `;
    } else {
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img class="cart-item__img" src="${escapeHTML(item.img)}" alt="${escapeHTML(item.name)}">
                <div class="cart-item__info">
                    <span class="cart-item__name">${escapeHTML(item.name)}</span>
                    <span class="cart-item__price">${formatPrice(item.price)}</span>
                    <div class="cart-item__controls">
                        <button class="cart-item__qty-btn" data-action="decrease" data-name="${escapeHTML(item.name)}">−</button>
                        <span class="cart-item__qty">${item.qty}</span>
                        <button class="cart-item__qty-btn" data-action="increase" data-name="${escapeHTML(item.name)}">+</button>
                        <button class="cart-item__remove" data-action="remove" data-name="${escapeHTML(item.name)}">Remover</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalEl.textContent = formatPrice(total);
}


// ============================================================
// ABRIR / FECHAR CARRINHO
// ============================================================

function openCart() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}


// ============================================================
// ANIMAÇÃO DO CARRINHO (pulso ao adicionar item)
// ============================================================

function animateCart() {
    if (!cartToggle) return;
    cartToggle.classList.remove('cart-bounce');
    void cartToggle.offsetWidth;
    cartToggle.classList.add('cart-bounce');
}


// ============================================================
// NOTIFICAÇÕES
// ============================================================

function showNotification(message, type = 'success') {
    let container = document.getElementById('hsg-notifications');

    if (!container) {
        container = document.createElement('div');
        container.id = 'hsg-notifications';
        container.style.position = 'fixed';
        container.style.right = '24px';
        container.style.bottom = '24px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');

    let icon = '✓';
    if (type === 'error') icon = '!';
    if (type === 'info') icon = 'i';

    notification.innerHTML = `
        <span style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.18);font-weight:700;">
            ${icon}
        </span>
        <span>${escapeHTML(message)}</span>
    `;

    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.padding = '13px 17px';
    notification.style.borderRadius = '12px';
    notification.style.color = '#fff';
    notification.style.fontSize = '13px';
    notification.style.fontWeight = '500';
    notification.style.boxShadow = '0 10px 30px rgba(0,0,0,.20)';
    notification.style.background =
        type === 'error' ? '#e53935' : type === 'info' ? '#444' : '#2f9e44';
    notification.style.transform = 'translateX(120%)';
    notification.style.opacity = '0';
    notification.style.transition = 'all .3s ease';

    container.appendChild(notification);

    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });

    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


// ============================================================
// FAVORITOS
// ============================================================

function toggleFavorite(button) {
    const productCard = button.closest('.product-card');
    if (!productCard) return;

    const productName = productCard.querySelector('.product-card__name')?.textContent.trim();
    if (!productName) return;

    const index = favorites.indexOf(productName);

    if (index === -1) {
        favorites.push(productName);
        button.classList.add('is-favorite');
        button.textContent = '♥';
        showNotification('Produto adicionado aos favoritos.', 'success');
    } else {
        favorites.splice(index, 1);
        button.classList.remove('is-favorite');
        button.textContent = '♡';
        showNotification('Produto removido dos favoritos.', 'info');
    }

    saveFavorites();
}

function loadFavoriteButtons() {
    document.querySelectorAll('.product-card__wishlist').forEach(button => {
        const card = button.closest('.product-card');
        const name = card?.querySelector('.product-card__name')?.textContent.trim();

        if (name && favorites.includes(name)) {
            button.classList.add('is-favorite');
            button.textContent = '♥';
        } else {
            button.textContent = '♡';
        }
    });
}


// ============================================================
// BUSCA DE PRODUTOS
// ============================================================

function setupSearch() {
    const searchInput = document.querySelector('.search-field input');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const search = searchInput.value.toLowerCase().trim();
        const products = document.querySelectorAll('.product-card');
        let visibleProducts = 0;

        products.forEach(card => {
            const name = card.querySelector('.product-card__name')?.textContent.toLowerCase() || '';
            const category = card.querySelector('.product-card__category')?.textContent.toLowerCase() || '';
            const matches = name.includes(search) || category.includes(search);

            if (matches) {
                card.style.display = '';
                visibleProducts++;
            } else {
                card.style.display = 'none';
            }
        });

        showNoResults(visibleProducts === 0 && search !== '');
    });
}

function showNoResults(show) {
    let message = document.getElementById('hsg-no-results');

    if (show) {
        if (!message) {
            message = document.createElement('div');
            message.id = 'hsg-no-results';
            message.style.textAlign = 'center';
            message.style.padding = '35px';
            message.style.color = 'var(--color-muted)';
            message.innerHTML = `
                <div style="font-size:40px;margin-bottom:10px;">🔎</div>
                <strong>Nenhum produto encontrado</strong>
                <p>Tente procurar por outro termo.</p>
            `;

            const grid = document.querySelector('.products-grid');
            if (grid) grid.parentNode.insertBefore(message, grid);
        }
    } else {
        if (message) message.remove();
    }
}


// ============================================================
// FILTROS
// ============================================================

function setupFilters() {
    const filters = document.querySelectorAll('.filter-pill');
    const products = document.querySelectorAll('.product-card');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(item => item.classList.remove('active'));
            filter.classList.add('active');

            const selected = filter.textContent.trim().toLowerCase();

            products.forEach(card => {
                const category = card.querySelector('.product-card__category')?.textContent.trim().toLowerCase() || '';

                if (selected === 'todos') {
                    card.style.display = '';
                } else if (selected === 'promoções') {
                    const sale = card.querySelector('.badge--sale');
                    card.style.display = sale ? '' : 'none';
                } else {
                    card.style.display = category === selected ? '' : 'none';
                }
            });

            showNoResults(
                !Array.from(products).some(product => product.style.display !== 'none')
            );
        });
    });
}


// ============================================================
// VOLTAR AO TOPO
// ============================================================

function setupBackToTop() {
    const button = document.createElement('button');

    button.id = 'hsg-back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Voltar ao topo');

    button.style.position = 'fixed';
    button.style.right = '24px';
    button.style.bottom = '24px';
    button.style.width = '45px';
    button.style.height = '45px';
    button.style.borderRadius = '50%';
    button.style.border = 'none';
    button.style.background = 'var(--color-accent)';
    button.style.color = '#fff';
    button.style.fontSize = '20px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    button.style.opacity = '0';
    button.style.visibility = 'hidden';
    button.style.transform = 'translateY(15px)';
    button.style.transition = 'all .3s ease';
    button.style.boxShadow = '0 5px 20px rgba(0,0,0,.18)';

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
            button.style.transform = 'translateY(0)';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
            button.style.transform = 'translateY(15px)';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// ============================================================
// NEWSLETTER
// ============================================================

function setupNewsletter() {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    if (!form || !emailInput) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // ← essencial para não recarregar

        const email = emailInput.value.trim();
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!validEmail) {
            showNotification('Digite um e-mail válido.', 'error');
            emailInput.focus();
            return;
        }

        emailInput.value = '';
        showNotification('E-mail cadastrado com sucesso!', 'success');
    });
}



// ============================================================
// EVENTOS DO CARRINHO
// ============================================================

function setupCart() {
    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // ✅ DELEGAÇÃO DE EVENTO — funciona nos cards duplicados pelo slider
    document.addEventListener('click', (event) => {
        const button = event.target.closest('.add-to-cart');
        if (!button) return;

        const product = {
            name: button.dataset.name,
            price: parseFloat(button.dataset.price),
            img: button.dataset.img
        };
        addToCart(product);
    });

    if (cartItemsEl) {
        cartItemsEl.addEventListener('click', event => {
            const button = event.target.closest('[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            const name = button.dataset.name;
            if (!name) return;

            if (action === 'increase') changeQty(name, 1);
            if (action === 'decrease') changeQty(name, -1);
            if (action === 'remove') removeFromCart(name);
        });
    }

    function getStoredToken() {
        try {
            return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Não foi possível recuperar a sessão:', error);
            return null;
        }
    }

    function clearStoredToken() {
        try {
            localStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Não foi possível encerrar a sessão:', error);
        }
    }

    function setupProfile() {
        const headerActions = document.querySelector('.header__actions');
        if (!headerActions) return;

        let profileToggle = document.getElementById('profile-toggle');
        if (!profileToggle) {
            profileToggle = document.createElement('button');
            profileToggle.className = 'btn--icon profile-toggle';
            profileToggle.id = 'profile-toggle';
            profileToggle.type = 'button';
            profileToggle.setAttribute('aria-label', 'Abrir perfil');
            profileToggle.textContent = '👤';
            headerActions.insertBefore(profileToggle, headerActions.firstChild);
        }

        const profileOverlay = document.createElement('div');
        profileOverlay.className = 'profile-overlay';
        profileOverlay.id = 'profile-overlay';

        const profileSidebar = document.createElement('aside');
        profileSidebar.className = 'profile-sidebar';
        profileSidebar.id = 'profile-sidebar';
        profileSidebar.setAttribute('aria-label', 'Perfil do cliente');
        profileSidebar.innerHTML = `
            <div class="profile-sidebar__header">
                <h2>Meu perfil</h2>
                <button class="profile-close" type="button" aria-label="Fechar perfil">✕</button>
            </div>
            <div class="profile-sidebar__content">
                <div class="profile-avatar">👤</div>
                <div class="profile-loading">Carregando seus dados...</div>
            </div>
            <div class="profile-sidebar__footer">
                <button class="btn btn--primary profile-logout" type="button">Sair da conta</button>
            </div>
        `;

        document.body.append(profileOverlay, profileSidebar);

        const closeProfile = () => {
            profileSidebar.classList.remove('active');
            profileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        const openProfile = async () => {
            profileSidebar.classList.add('active');
            profileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            const content = profileSidebar.querySelector('.profile-sidebar__content');
            const token = getStoredToken();
            if (!token) {
                content.innerHTML = '<div class="profile-message">Entre na sua conta para visualizar seu perfil.</div>';
                return;
            }

            try {
                const response = await fetch('https://conteex-api.onrender.com/clientes/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 401) {
                    clearStoredToken();
                    content.innerHTML = '<div class="profile-message profile-message--error">Sua sessão expirou. Entre novamente para continuar.</div>';
                    return;
                }
                if (!response.ok) throw new Error('Não foi possível carregar os dados do perfil.');

                const customer = await response.json();
                const createdAt = customer.criado_em
                    ? new Date(customer.criado_em).toLocaleDateString('pt-BR')
                    : 'Não informado';
                content.innerHTML = `
                    <div class="profile-avatar">${escapeHTML((customer.nome || '?').charAt(0).toUpperCase())}</div>
                    <h3 class="profile-name">${escapeHTML(customer.nome || 'Cliente')}</h3>
                    <div class="profile-data">
                        <div><span>E-mail</span><strong>${escapeHTML(customer.email || 'Não informado')}</strong></div>
                        <div><span>Telefone</span><strong>${escapeHTML(customer.telefone || 'Não informado')}</strong></div>
                        <div><span>CPF</span><strong>${escapeHTML(customer.cpf || 'Não informado')}</strong></div>
                        <div><span>CEP</span><strong>${escapeHTML(customer.cep || 'Não informado')}</strong></div>
                        <div><span>Cliente desde</span><strong>${createdAt}</strong></div>
                    </div>
                `;
            } catch (error) {
                content.innerHTML = `<div class="profile-message profile-message--error">${escapeHTML(error instanceof TypeError ? 'Não foi possível conectar à API.' : error.message)}</div>`;
            }
        };

        profileToggle.addEventListener('click', openProfile);
        profileOverlay.addEventListener('click', closeProfile);
        profileSidebar.querySelector('.profile-close').addEventListener('click', closeProfile);
        profileSidebar.querySelector('.profile-logout').addEventListener('click', () => {
            clearStoredToken();
            closeProfile();
            window.location.href = 'login.html';
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeProfile();
        });
    }

    setupProfile();

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeCart();
    });

    document.addEventListener('click', event => {
        const button = event.target.closest('.cart-sidebar__footer .btn--primary');
        if (!button) return;

        event.preventDefault();
        let token = null;
        try {
            token = localStorage.getItem('conteex_access_token')
                || sessionStorage.getItem('conteex_access_token');
        } catch (error) {
            console.error('Não foi possível recuperar a sessão:', error);
        }

        window.location.href = token
            ? 'finalizar-compra.html'
            : `login.html?redirect=${encodeURIComponent('finalizar-compra.html')}`;
    });
}



// ============================================================
// FAVORITOS — EVENTOS
// ============================================================

function setupFavorites() {
    // Delegação no document: funciona nos cards duplicados pelo slider
    document.addEventListener('click', (event) => {
        const button = event.target.closest('.product-card__wishlist');
        if (!button) return;

        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(button);
    });

    loadFavoriteButtons();
}

// Expõe globalmente para o slider.js reaplicar o estado após duplicar o DOM
window.loadFavoriteButtons = loadFavoriteButtons;



// ============================================================
// CSS DE APOIO (pulso do carrinho, hover do coração)
// ============================================================

function injectAnimations() {
    const style = document.createElement('style');

    style.textContent = `
        @keyframes hsgCartBounce {
            0% { transform: scale(1); }
            35% { transform: scale(1.18); }
            65% { transform: scale(.92); }
            100% { transform: scale(1); }
        }

        .cart-bounce {
            animation: hsgCartBounce .45s ease;
        }

        .product-card__wishlist {
            transition: transform .2s ease, color .2s ease, background .2s ease;
        }

        .profile-overlay {
            position: fixed; inset: 0; z-index: 1090;
            background: rgba(15, 23, 42, .42); opacity: 0;
            pointer-events: none; transition: opacity .2s ease;
        }
        .profile-overlay.active { opacity: 1; pointer-events: auto; }
        .profile-sidebar {
            position: fixed; top: 0; right: 0; bottom: 0; z-index: 1100;
            width: min(390px, 92vw); display: flex; flex-direction: column;
            background: var(--color-bg); box-shadow: -8px 0 30px rgba(0,0,0,.16);
            transform: translateX(100%); transition: transform .25s ease;
        }
        .profile-sidebar.active { transform: translateX(0); }
        .profile-sidebar__header, .profile-sidebar__footer {
            display: flex; align-items: center; justify-content: space-between;
            padding: 20px 24px; border-bottom: 1px solid var(--color-border);
        }
        .profile-sidebar__header h2 { font-size: 20px; }
        .profile-close {
            border: 0; background: transparent; color: var(--color-muted);
            cursor: pointer; font-size: 18px; padding: 4px 8px;
        }
        .profile-sidebar__content { flex: 1; overflow-y: auto; padding: 32px 24px; text-align: center; }
        .profile-avatar {
            display: grid; place-items: center; width: 72px; height: 72px;
            margin: 0 auto 14px; border-radius: 50%; background: #e8edff;
            color: var(--color-accent); font-size: 28px; font-weight: 800;
        }
        .profile-name { font-size: 20px; margin-bottom: 24px; }
        .profile-data { display: grid; gap: 12px; text-align: left; }
        .profile-data div { display: grid; gap: 4px; padding: 12px; border-radius: 10px; background: var(--color-surface); }
        .profile-data span { color: var(--color-muted); font-size: 12px; }
        .profile-data strong { overflow-wrap: anywhere; font-size: 14px; font-weight: 600; }
        .profile-message { color: var(--color-muted); line-height: 1.5; }
        .profile-message--error { color: var(--color-danger); }
        .profile-sidebar__footer { border-top: 1px solid var(--color-border); border-bottom: 0; }
        .profile-logout { width: 100%; background: var(--color-danger); }
        .profile-logout:hover { background: #c92a2a; }

        .product-card__wishlist:hover {
            transform: scale(1.1);
        }

        .product-card__wishlist.is-favorite {
            color: #e53935;
            background: rgba(229,57,53,.10);
        }

        #hsg-back-to-top:hover {
            transform: translateY(-3px) !important;
        }
    `;

    document.head.appendChild(style);
}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

function initHSG() {
    renderCart();
    setupCart();
    setupFavorites();
    setupSearch();
    setupFilters();
    setupNewsletter();
    setupMobileMenu();   
    injectAnimations();
    setupBackToTop();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHSG);
} else {
    initHSG();
}
// ============================================================
// MENU MOBILE (HAMBÚRGUER)
// ============================================================

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const headerNav   = document.getElementById('header-nav');

    if (!menuToggle || !headerNav) return;

    function closeMenu() {
        headerNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', () => {
        const isOpen = headerNav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fecha ao clicar em qualquer link do menu
    headerNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fecha ao voltar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeMenu();
    });
}
