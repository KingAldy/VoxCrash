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
    { username: 'developer', password: 'aldy', level: 'developer' } // default account
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
  const user = document.getElementById('keyUsername').value.trim();
  if (!user) {
    alert("Masukkan nama pengguna untuk KEY!");
    return;
  }

  const key = 'KEY-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  const entry = { key, username: user };

  // Tampilkan hasil
  document.getElementById('generatedKey').innerText =
    `Salin dan tambahkan manual ke key.json:\n${JSON.stringify(entry, null, 2)}`;
}


// Login dengan KEY
async function loginWithKey() {
  const inputKey = document.getElementById('navKey').value.trim();

  try {
    const response = await fetch('https://raw.githubusercontent.com/KingAldy/VoxCrash/main/key.json');
    const data = await response.json();

    const found = data.keys.find(item => item.key === inputKey);

    if (found) {
      alert(`Login berhasil sebagai ${found.username}!`);
      const user = { username: found.username, level: 'user' };
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      showPanel(user);
    } else {
      alert("KEY tidak valid!");
    }
  } catch (error) {
    alert("Gagal mengakses data KEY dari GitHub.");
    console.error(error);
  }
}
