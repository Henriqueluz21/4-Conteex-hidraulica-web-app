const CART_KEY = 'hidraulica_sao_gabriel_cart';
const TOKEN_KEY = 'conteex_access_token';
const API_URL = 'https://conteex-api.onrender.com';
const checkoutItems = document.getElementById('checkoutItems');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutAlert = document.getElementById('checkoutAlert');
const checkoutCep = document.getElementById('checkoutCep');
const formatPrice = value => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const loadCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Não foi possível carregar o carrinho:', error);
    return [];
  }
};

const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Não foi possível recuperar a sessão:', error);
    return null;
  }
};

const redirectToLogin = () => {
  window.location.href = `login.html?redirect=${encodeURIComponent('finalizar-compra.html')}`;
};

const showCheckoutError = message => {
  checkoutAlert.textContent = message;
  checkoutAlert.className = 'checkout-alert is-visible';
};

const loadCustomerData = async () => {
  const token = getToken();
  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/clientes/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      redirectToLogin();
      return;
    }

    if (!response.ok) {
      throw new Error('Não foi possível carregar os dados do cliente.');
    }

    const customer = await response.json();
    if (customer.cep) {
      checkoutCep.value = customer.cep;
      checkoutCep.readOnly = true;
      checkoutCep.title = 'CEP carregado do seu cadastro';
    }
  } catch (error) {
    showCheckoutError(error instanceof TypeError
      ? 'Não foi possível conectar à API. Verifique se o servidor está ativo.'
      : error.message);
  }
};

const cart = loadCart();
const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);

checkoutItems.innerHTML = cart.length
  ? cart.map(item => `<div class="summary-item"><img src="${item.img}" alt=""><div><strong>${item.name}</strong><small>${item.qty} un. × ${formatPrice(item.price)}</small></div><strong>${formatPrice(item.price * item.qty)}</strong></div>`).join('')
  : '<p class="empty-order">Seu carrinho está vazio.</p>';
checkoutSubtotal.textContent = formatPrice(total);
checkoutTotal.textContent = formatPrice(total);
loadCustomerData();

checkoutForm.addEventListener('submit', event => {
  event.preventDefault();
  checkoutAlert.className = 'checkout-alert';

  if (!cart.length) {
    showCheckoutError('Adicione ao menos um produto ao carrinho para continuar.');
    return;
  }

  if (!checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    return;
  }

  checkoutAlert.textContent = 'Pedido confirmado! Em breve você receberá os detalhes por e-mail.';
  checkoutAlert.classList.add('is-visible', 'is-success');
  checkoutForm.querySelector('.checkout-submit').disabled = true;
});
