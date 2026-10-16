// produto.js — Preenche a página de produto automaticamente
document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 0) VERIFICA SE OS DADOS DOS PRODUTOS EXISTEM
    // ============================================
    if (typeof produtos === 'undefined' || !Array.isArray(produtos)) {
        const sec = document.querySelector('.product-section');
        if (sec) {
            sec.innerHTML = '<p style="text-align:center;padding:60px;">Erro: o arquivo <strong>produtos-data.js</strong> não foi carregado.</p>';
        }
        return;
    }

    // ============================================
    // 1) DESCOBRE QUAL PRODUTO FOI CLICADO
    // ============================================
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id')) || 1;

    const produto = produtos.find(p => p.id === id) || produtos[0];

    if (!produto) {
        document.querySelector('.product-section').innerHTML =
            '<p style="text-align:center;padding:60px;">Produto não encontrado.</p>';
        return;
    }

    // ============================================
    // 2) PREENCHE OS DADOS NA PÁGINA
    // ============================================
    document.title = produto.nome + ' — Hidráulica São Gabriel';

    // Cabeçalho
    document.getElementById('product-image').src = produto.imagem;
    document.getElementById('product-image').alt = produto.nome;
    document.getElementById('product-category').textContent = produto.categoria;
    document.getElementById('product-title').textContent = produto.nome;

    // Breadcrumb e selo de desconto (corrigidos)
    document.getElementById('breadcrumb-product').textContent = produto.nome;
    const badge = document.getElementById('product-badge');
    if (badge && produto.desconto) badge.textContent = produto.desconto;

    // Avaliações
    document.getElementById('product-rating-stars').textContent = produto.rating;
    document.getElementById('product-rating-count').textContent = '(' + produto.avaliacoes + ' avaliações)';

    // Preço
    document.getElementById('price-original').textContent = formatarPreco(produto.precoOriginal);
    document.getElementById('price-discount').textContent = produto.desconto || '';
    document.getElementById('price-current').textContent = formatarPreco(produto.preco);
    document.getElementById('price-pix-value').textContent = formatarPreco(produto.pix);
    document.getElementById('price-installments').innerHTML = 'ou <strong>' + produto.parcelas + '</strong> sem juros';

    // Descrição (no resumo E na aba "Descrição" — CORRIGIDO)
    const descricao = produto.descricao || '';
    document.getElementById('product-desc').textContent = descricao;
    const descFull = document.getElementById('product-desc-full');
    if (descFull) descFull.textContent = descricao;

    // Botão comprar (para o carrinho saber o que adicionar)
    const buyBtn = document.getElementById('product-buy');
    buyBtn.dataset.name = produto.nome;
    buyBtn.dataset.price = produto.preco;
    buyBtn.dataset.img = produto.imagem;

    // WhatsApp com o nome do produto
    const whatsapp = document.getElementById('product-whatsapp');
    whatsapp.href = 'https://wa.me/5511999999999?text=' +
        encodeURIComponent('Olá! Tenho interesse no produto: ' + produto.nome);

    // ============================================
    // 3) PREENCHE A TABELA DE ESPECIFICAÇÕES
    // ============================================
    const specsBody = document.getElementById('specs-body');
    specsBody.innerHTML = '';
    Object.entries(produto.especificacoes || {}).forEach(([chave, valor]) => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        const td = document.createElement('td');
        th.textContent = chave;
        td.textContent = valor;
        tr.append(th, td);
        specsBody.appendChild(tr);
    });

    // ============================================
    // 4) PREENCHE AS AVALIAÇÕES
    // ============================================
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = '';
    (produto.reviews || []).forEach(review => {
        const div = document.createElement('div');
        div.className = 'review';
        div.innerHTML =
            '<div class="review__header">' +
                '<strong></strong>' +
                '<span class="rating__stars"></span>' +
                '<span class="review__date"></span>' +
            '</div>' +
            '<p></p>';
        div.querySelector('strong').textContent = review.nome;
        div.querySelector('.rating__stars').textContent = review.estrelas;
        div.querySelector('.review__date').textContent = review.data;
        div.querySelector('p').textContent = review.texto;
        reviewsContainer.appendChild(div);
    });

    // ============================================
    // 5) PREENCHE "PRODUTOS RELACIONADOS" (mesma categoria)
    // ============================================
    const relacionados = produtos
        .filter(p => p.categoria === produto.categoria && p.id !== produto.id)
        .slice(0, 4);

    const relacionadosContainer = document.getElementById('related-products');
    relacionadosContainer.innerHTML = '';

    relacionados.forEach(p => {
        const card = document.createElement('a');
        card.className = 'product-card';
        card.href = 'produto.html?id=' + p.id;
        card.innerHTML =
            '<div class="product-card__image"><img alt=""></div>' +
            '<div class="product-card__body">' +
                '<div class="product-card__category"></div>' +
                '<h3 class="product-card__name"></h3>' +
                '<div class="rating"><span class="rating__stars"></span><span class="rating__count"></span></div>' +
                '<div class="product-card__footer">' +
                    '<div class="product-card__price"><span class="current"></span></div>' +
                    '<span class="btn btn--primary btn--sm">Ver</span>' +
                '</div>' +
            '</div>';
        card.querySelector('img').src = p.imagem;
        card.querySelector('img').alt = p.nome;
        card.querySelector('.product-card__category').textContent = p.categoria;
        card.querySelector('.product-card__name').textContent = p.nome;
        card.querySelector('.rating__stars').textContent = p.rating;
        card.querySelector('.rating__count').textContent = '(' + p.avaliacoes + ')';
        card.querySelector('.current').textContent = formatarPreco(p.preco);
        relacionadosContainer.appendChild(card);
    });

    // ============================================
    // FUNÇÕES AUXILIARES
    // ============================================
    function formatarPreco(valor) {
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // ============================================
    // INTERAÇÕES
    // ============================================
    // Quantidade
    const qtyInput = document.getElementById('qty-input');
    document.getElementById('qty-plus').addEventListener('click', () => {
        qtyInput.value = Math.min(99, (parseInt(qtyInput.value) || 1) + 1);
    });
    document.getElementById('qty-minus').addEventListener('click', () => {
        qtyInput.value = Math.max(1, (parseInt(qtyInput.value) || 1) - 1);
    });

    // Abas
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
        });
    });

    // Frete (simulado)
    const cepInput = document.getElementById('cep-input');
    const freteResult = document.getElementById('frete-result');
    cepInput.addEventListener('input', () => {
        let v = cepInput.value.replace(/\D/g, '');
        if (v.length > 8) v = v.slice(0, 8);
        if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
        cepInput.value = v;
    });
    document.getElementById('cep-btn').addEventListener('click', () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) {
            freteResult.innerHTML = '<span style="color:var(--color-danger)">Digite um CEP válido.</span>';
            return;
        }
        freteResult.innerHTML =
            '🚚 <strong>Expresso</strong> — R$ 24,90 · 2 a 3 dias úteis<br>' +
            '📦 <strong>Econômico</strong> — R$ 14,90 · 5 a 8 dias úteis<br>' +
            '✅ <strong>Grátis</strong> acima de R$ 699';
    });

    // Comprar (adiciona 1x e ajusta a quantidade, para exibir só 1 notificação)
    buyBtn.addEventListener('click', () => {
        const qty = parseInt(qtyInput.value) || 1;
        const product = {
            name: buyBtn.dataset.name,
            price: parseFloat(buyBtn.dataset.price),
            img: buyBtn.dataset.img
        };
        addToCart(product);                        // função global do js.js
        if (qty > 1) changeQty(product.name, qty - 1);   // ajusta a quantidade
        openCart();                                // abre o carrinho
    });

    // Tema
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const dark = document.body.classList.contains('dark-mode');
        themeBtn.textContent = dark ? '☀️' : '🌙';
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️';
    }
});
