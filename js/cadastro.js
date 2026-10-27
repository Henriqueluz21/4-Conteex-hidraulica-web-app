const form = document.getElementById('registerForm');
const nameField = document.getElementById('nameField');
const nameInput = document.getElementById('name');
const emailField = document.getElementById('emailField');
const emailInput = document.getElementById('email');
const phoneField = document.getElementById('phoneField');
const phoneInput = document.getElementById('phone');
const cpfField = document.getElementById('cpfField');
const cpfInput = document.getElementById('cpf');
const cepField = document.getElementById('cepField');
const cepInput = document.getElementById('cep');
const passwordField = document.getElementById('passwordField');
const passwordInput = document.getElementById('password');
const confirmField = document.getElementById('confirmField');
const confirmInput = document.getElementById('confirmPassword');
const terms = document.getElementById('terms');
const submitBtn = document.getElementById('submitBtn');
const btnLabel = document.getElementById('btnLabel');
const alert = document.getElementById('alert');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const applyTheme = (dark) => {
  document.body.classList.toggle('dark-mode', dark);
  themeIcon.innerHTML = dark
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
};

try { applyTheme(localStorage.getItem('theme') === 'dark'); } catch (error) { applyTheme(false); }

themeToggle.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark-mode');
  applyTheme(dark);
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (error) { }
});

document.querySelectorAll('.password-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const input = document.getElementById(toggle.dataset.target);
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    toggle.setAttribute('aria-label', visible ? 'Ocultar senha' : 'Mostrar senha');
  });
});

const onlyDigits = (value) => value.replace(/\D/g, '');
cpfInput.addEventListener('input', () => {
  const digits = onlyDigits(cpfInput.value).slice(0, 11);
  cpfInput.value = digits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
});

cepInput.addEventListener('input', () => {
  const digits = onlyDigits(cepInput.value).slice(0, 8);
  cepInput.value = digits.replace(/(\d{5})(\d)/, '$1-$2');
});

phoneInput.addEventListener('input', () => {
  const digits = onlyDigits(phoneInput.value).slice(0, 11);
  phoneInput.value = digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  [nameField, emailField, phoneField, cpfField, cepField, passwordField, confirmField].forEach((field) => field.classList.remove('has-error'));
  alert.className = 'alert';
  alert.textContent = '';
  let valid = true;

  if (nameInput.value.trim().length < 3) { nameField.classList.add('has-error'); valid = false; }
  if (!validateEmail(emailInput.value.trim())) { emailField.classList.add('has-error'); valid = false; }
  if (onlyDigits(phoneInput.value).length < 10) { phoneField.classList.add('has-error'); valid = false; }
  if (onlyDigits(cpfInput.value).length !== 11) { cpfField.classList.add('has-error'); valid = false; }
  if (onlyDigits(cepInput.value).length !== 8) { cepField.classList.add('has-error'); valid = false; }
  if (passwordInput.value.length < 8) { passwordField.classList.add('has-error'); valid = false; }
  if (confirmInput.value !== passwordInput.value || !confirmInput.value) { confirmField.classList.add('has-error'); valid = false; }
  if (!terms.checked) { valid = false; }

  if (!valid) {
    alert.className = 'alert alert--error';
    alert.textContent = terms.checked ? 'Ops! Confira os campos destacados e tente novamente.' : 'Aceite os termos para criar sua conta.';
    return;
  }

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  btnLabel.textContent = 'Criando conta...';

  const dadosCadastro = {
    nome: nameInput.value.trim(),
    email: emailInput.value.trim(),
    telefone: phoneInput.value.trim(),
    senha: passwordInput.value
  };

  console.log('Dados de cadastro:', dadosCadastro);

  const resposta = await fetch('http://127.0.0.1:8000/clientes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dadosCadastro)
  });

  form.addEventListener('submit', async (event) => {

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    btnLabel.textContent = 'Criar conta';
    alert.className = 'alert alert--success';
    alert.textContent = 'Conta criada com sucesso! Você já pode entrar.';
    form.reset();
  }, 1200);
});
