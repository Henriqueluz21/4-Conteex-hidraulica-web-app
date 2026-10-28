const form = document.getElementById('loginForm');
const emailField = document.getElementById('emailField');
const passwordField = document.getElementById('passwordField');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const btnLabel = document.getElementById('btnLabel');
const alert = document.getElementById('alert');
const passwordToggle = document.getElementById('passwordToggle');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const emailError = document.getElementById('emailError');

passwordToggle.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  passwordToggle.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
  passwordToggle.querySelector('svg').innerHTML = isPassword
    ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
});

const applyTheme = dark => {
  document.body.classList.toggle('dark-mode', dark);
  themeIcon.innerHTML = dark
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
};

try {
  applyTheme(localStorage.getItem('theme') === 'dark');
} catch (error) {
  applyTheme(false);
}

themeToggle.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark-mode');
  applyTheme(dark);
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch (error) {
    console.error('Não foi possível salvar o tema:', error);
  }
});

const validateEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

emailInput.addEventListener('input', () => {
  if (emailField.classList.contains('has-error') && validateEmail(emailInput.value.trim())) {
    emailField.classList.remove('has-error');
  }
});

passwordInput.addEventListener('input', () => {
  if (passwordField.classList.contains('has-error') && passwordInput.value.length >= 8) {
    passwordField.classList.remove('has-error');
  }
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  alert.className = 'alert';
  alert.textContent = '';
  const email = emailInput.value.trim();
  const valid = validateEmail(email) && passwordInput.value.length >= 8;

  if (!validateEmail(email)) {
    emailError.textContent = email ? 'Informe um e-mail válido.' : 'Informe seu e-mail.';
    emailField.classList.add('has-error');
  } else {
    emailField.classList.remove('has-error');
  }
  passwordField.classList.toggle('has-error', passwordInput.value.length < 8);

  if (!valid) {
    alert.className = 'alert alert--error';
    alert.textContent = 'Confira seu e-mail e informe uma senha com pelo menos 8 caracteres.';
    return;
  }

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  btnLabel.textContent = 'Entrando...';

  try {
    const resposta = await fetch('https://conteex-api.onrender.com/clientes/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: passwordInput.value })
    });
    const resultado = await resposta.json();
    if (!resposta.ok) {
      throw new Error(resposta.status === 401 ? 'E-mail ou senha incorretos.' : 'Não foi possível realizar o login. Tente novamente.');
    }
    if (!resultado.access_token) throw new Error('A API não retornou o token de acesso esperado.');
    localStorage.setItem('conteex_access_token', resultado.access_token);
    sessionStorage.setItem('conteex_access_token', resultado.access_token);

    const respostaCliente = await fetch('https://conteex-api.onrender.com/clientes/me', {
      headers: { Authorization: `Bearer ${resultado.access_token}` }
    });
    if (!respostaCliente.ok) {
      localStorage.removeItem('conteex_access_token');
      sessionStorage.removeItem('conteex_access_token');
      throw new Error('O login foi recebido, mas não foi possível validar a sessão.');
    }
    const cliente = await respostaCliente.json();
    alert.className = 'alert alert--success';
    alert.textContent = `Login realizado com sucesso! Olá, ${cliente.nome}.`;
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    window.setTimeout(() => { window.location.href = redirect || 'index.html'; }, 500);
  } catch (error) {
    alert.className = 'alert alert--error';
    alert.textContent = error instanceof TypeError
      ? 'Não foi possível conectar à API. Verifique se o servidor está ativo.'
      : error.message;
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    btnLabel.textContent = 'Entrar';
  }
});
