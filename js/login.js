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

const applyTheme = (dark) => {
  document.body.classList.toggle('dark-mode', dark);
  themeIcon.innerHTML = dark
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
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
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (error) {}
});

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const setEmailError = (value) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    emailError.textContent = 'Informe seu e-mail.';
  } else if (!trimmedValue.includes('@')) {
    emailError.textContent = 'O e-mail deve conter @.';
  } else {
    emailError.textContent = 'Informe um e-mail válido.';
  }
};

emailInput.addEventListener('input', () => {
  if (emailField.classList.contains('has-error')) {
    setEmailError(emailInput.value);
    if (validateEmail(emailInput.value.trim())) emailField.classList.remove('has-error');
  }
});

passwordInput.addEventListener('input', () => {
  if (passwordField.classList.contains('has-error') && passwordInput.value.length >= 6) {
    passwordField.classList.remove('has-error');
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  alert.className = 'alert';
  alert.textContent = '';
  let valid = true;

  if (!validateEmail(emailInput.value.trim())) {
    setEmailError(emailInput.value);
    emailField.classList.add('has-error');
    valid = false;
  } else {
    emailField.classList.remove('has-error');
  }

  if (passwordInput.value.length < 6) {
    passwordField.classList.add('has-error');
    valid = false;
  } else {
    passwordField.classList.remove('has-error');
  }

  if (!valid) {
    alert.className = 'alert alert--error';
    alert.textContent = 'Ops! Confira os campos destacados e tente novamente.';
    return;
  }

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  btnLabel.textContent = 'Entrando...';

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    btnLabel.textContent = 'Entrar';
    alert.className = 'alert alert--success';
    alert.textContent = 'Login realizado com sucesso! Redirecionando...';
    form.reset();
    setTimeout(() => { alert.className = 'alert'; alert.textContent = ''; }, 2500);
  }, 1500);
});
