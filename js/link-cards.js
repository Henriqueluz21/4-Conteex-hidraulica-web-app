// link-cards.js — Transforma os cards em links (produto.html?id=X)
// Agora usa data-id em vez de casamento por nome (robusto contra colisões)
const linkados = new WeakSet();

function linkProductCards() {
    if (typeof produtos === 'undefined') return;

    document.querySelectorAll('.product-card').forEach(card => {
        if (linkados.has(card)) return;

        const id = card.dataset.id;
        if (!id) {
            console.warn('⚠️ Card sem data-id:', card.querySelector('.product-card__name')?.textContent);
            return;
        }

        const produto = produtos.find(p => String(p.id) === String(id));
        if (!produto) {
            console.warn('⚠️ Produto não encontrado no produtos-data.js (data-id):', id);
            return;
        }

        linkados.add(card);
        card.style.cursor = 'pointer';
        card.tabIndex = 0;
        card.setAttribute('role', 'link');

        const navegar = (evento) => {
            // não navega se o clique foi num botão (Comprar, ❤️)
            if (evento.target.closest('button, a')) return;
            window.location.href = 'produto.html?id=' + produto.id;
        };

        card.addEventListener('click', navegar);

        // Acessibilidade: navega com Enter/Espaço
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navegar(e);
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', linkProductCards);
} else {
    linkProductCards();
}

window.linkProductCards = linkProductCards;
