// Auto Login kalau sebelumnya sudah login
function autoLogin() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) {
    showPanel(user);
  }
}

// Simpan akun di localStorage
function getAccounts() {
  return JSON.parse(localStorage.getItem('accounts')) || [
    { username: 'developer', password: '', level: 'developer' } // default account
  ];
}

function saveAccounts(accounts) {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

// Fungsi Login Username & Password
function login(userId, passId) {
  const username = document.getElementById(userId).value;
  const password = document.getElementById(passId).value;
  const level = document.getElementById('loginLevel').value;

  const accounts = getAccounts();
  const found = accounts.find(acc =>
    acc.username === username &&
    acc.password === password &&
    acc.level === level
  );

  if (found || (username === 'developer' && level === 'developer')) {
    const user = found || { username, level };
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    showPanel(user);
  } else {
    alert('Login gagal: username, password, atau level salah.');
  }
}

// Tampilkan panel sesuai level
function showPanel(user) {
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('panelBox').classList.remove('hidden');
  document.getElementById('userStatus').innerText = `Logged in as: ${user.username} (${user.level})`;

  if (user.level === 'developer') {
    fillLevelOptions(['admin']);
    document.getElementById('createSection').classList.remove('hidden');
  } else if (user.level === 'admin') {
    fillLevelOptions(['reseller']);
    document.getElementById('createSection').classList.remove('hidden');
  } else if (user.level === 'reseller') {
    document.getElementById('keySection').classList.remove('hidden');
  }
}

// Logout
function logout() {
  localStorage.removeItem('loggedInUser');
  document.getElementById('loginBox').classList.remove('hidden');
  document.getElementById('panelBox').classList.add('hidden');
}

// Isi opsi level akun yang bisa dibuat
function fillLevelOptions(levels) {
  const select = document.getElementById('newLevel');
  select.innerHTML = '';
  levels.forEach(level => {
    const opt = document.createElement('option');
    opt.value = level;
    opt.innerText = level;
    select.appendChild(opt);
  });
}

// Buat akun baru
function createAccount() {
  const newUser = document.getElementById('newUser').value;
  const newPass = document.getElementById('newPass').value;
  const newLevel = document.getElementById('newLevel').value;
  const accounts = getAccounts();

  if (!newUser || !newPass || !newLevel) {
    alert('Isi semua field!');
    return;
  }

  if (accounts.some(acc => acc.username === newUser)) {
    alert('Username sudah digunakan!');
    return;
  }

  accounts.push({ username: newUser, password: newPass, level: newLevel });
  saveAccounts(accounts);
  alert('Akun berhasil dibuat!');
}

// Dummy KEY login
function generateKeyOnly() {
  const key = 'KEY-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  localStorage.setItem('loginKey', key);
  document.getElementById('generatedKey').innerText = `KEY kamu: ${key}`;
}

// Login dengan KEY
function loginWithKey() {
  const inputKey = document.getElementById('navKey').value;
  const storedKey = localStorage.getItem('loginKey');
  if (inputKey === storedKey) {
    const user = { username: 'user-key', level: 'user' };
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    showPanel(user);
  } else {
    alert('KEY salah atau tidak ditemukan.');
  }
}
