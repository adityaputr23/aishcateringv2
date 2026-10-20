// ===================================================================
// AISH CATERING SINGKAWANG - AUTHENTICATION & LOGIN CONTROLLER
// Singkawang Heritage Culinary System
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Storage & Default Users Setup
  const STORAGE_KEY_USERS = 'aish_users_db_v1';
  const STORAGE_KEY_SESSION = 'aish_auth_session';

  const defaultUsers = [
    {
      id: 'cust-01',
      name: 'Cindy Pratiwi',
      email: 'pelanggan@aishcatering.com',
      phone: '081234567890',
      password: 'aish123',
      role: 'customer',
      createdAt: '2026-01-15'
    },
    {
      id: 'admin-01',
      name: 'Hendra Aish (Admin)',
      email: 'admin@aishcatering.com',
      phone: '081345678910',
      password: 'admin123',
      role: 'admin',
      createdAt: '2025-11-01'
    }
  ];

  // Initialize DB if not present
  const getUsersDB = () => {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return defaultUsers;
    }
  };

  const saveUsersDB = (users) => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  };

  const getSessionUser = () => {
    const local = localStorage.getItem(STORAGE_KEY_SESSION);
    if (local) {
      try { return JSON.parse(local); } catch (e) { return null; }
    }
    const session = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (session) {
      try { return JSON.parse(session); } catch (e) { return null; }
    }
    return null;
  };

  const setSessionUser = (user, rememberMe = true) => {
    const data = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY_SESSION, data);
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
    } else {
      sessionStorage.setItem(STORAGE_KEY_SESSION, data);
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
  };

  // 2. DOM Elements
  const tabCustomer = document.getElementById('tabCustomer');
  const tabAdmin = document.getElementById('tabAdmin');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginSection = document.getElementById('loginSection');
  const registerSection = document.getElementById('registerSection');
  const loggedInPanel = document.getElementById('loggedInPanel');
  const roleHelpText = document.getElementById('roleHelpText');
  const loginIdentifierInput = document.getElementById('loginIdentifier');
  const loginPasswordInput = document.getElementById('loginPassword');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  const btnLoginSubmit = document.getElementById('btnLoginSubmit');
  const demoPelangganBtn = document.getElementById('demoPelangganBtn');
  const demoAdminBtn = document.getElementById('demoAdminBtn');

  // Toggle Switches
  const toRegisterBtn = document.getElementById('toRegisterBtn');
  const toLoginBtn = document.getElementById('toLoginBtn');

  // Forgot Password Modal
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const forgotModal = document.getElementById('forgotModal');
  const forgotModalClose = document.getElementById('forgotModalClose');
  const forgotForm = document.getElementById('forgotForm');
  const forgotEmailInput = document.getElementById('forgotEmail');

  // State
  let currentRoleTab = 'customer'; // 'customer' | 'admin'

  // 3. Toast Notification
  const showToast = (message, type = 'success') => {
    let container = document.getElementById('authToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'authToastContainer';
      container.className = 'auth-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `auth-toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  };

  // 4. Setup Show/Hide Password Buttons
  const setupPasswordToggles = () => {
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        const icon = btn.querySelector('i');
        if (icon) {
          if (isPassword) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            btn.setAttribute('aria-label', 'Sembunyikan Kata Sandi');
          } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            btn.setAttribute('aria-label', 'Tampilkan Kata Sandi');
          }
        }
      });
    });
  };

  // 5. Check Logged In Status & Render
  const renderAuthState = () => {
    const user = getSessionUser();
    if (user) {
      // User is logged in
      if (loginSection) loginSection.style.display = 'none';
      if (registerSection) registerSection.style.display = 'none';
      if (loggedInPanel) {
        loggedInPanel.classList.add('active');
        const nameEl = document.getElementById('loggedUserName');
        const roleEl = document.getElementById('loggedUserRole');
        const emailEl = document.getElementById('loggedUserEmail');
        const avatarEl = document.getElementById('loggedUserAvatar');

        if (nameEl) nameEl.textContent = user.name;
        if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Staf & Admin Operasional' : 'Pelanggan / Calon Pengantin';
        if (emailEl) emailEl.textContent = user.email || user.phone;
        if (avatarEl) avatarEl.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'A';
      }
    } else {
      // Not logged in
      if (loggedInPanel) loggedInPanel.classList.remove('active');
      if (loginSection) loginSection.style.display = 'block';
      if (registerSection) registerSection.style.display = 'none';
    }
  };

  // 6. Role Tab Switching
  const setRoleTab = (role) => {
    currentRoleTab = role;
    if (role === 'customer') {
      tabCustomer.classList.add('active');
      tabAdmin.classList.remove('active');
      if (roleHelpText) roleHelpText.textContent = 'Masuk sebagai pelanggan untuk reservasi katering dan pantau status pesanan acara Anda.';
      if (loginIdentifierInput) {
        loginIdentifierInput.placeholder = 'contoh: nama@email.com atau 0812...';
      }
    } else {
      tabAdmin.classList.add('active');
      tabCustomer.classList.remove('active');
      if (roleHelpText) roleHelpText.textContent = 'Portal akses pengelola, staf dapur, dan administrasi pesanan Aish Catering.';
      if (loginIdentifierInput) {
        loginIdentifierInput.placeholder = 'admin@aishcatering.com atau username staf';
      }
    }
  };

  if (tabCustomer) {
    tabCustomer.addEventListener('click', () => setRoleTab('customer'));
  }
  if (tabAdmin) {
    tabAdmin.addEventListener('click', () => setRoleTab('admin'));
  }

  // 7. Toggle between Login & Register View
  if (toRegisterBtn) {
    toRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginSection.style.display = 'none';
      registerSection.style.display = 'block';
      window.scrollTo({ top: 120, behavior: 'smooth' });
    });
  }

  if (toLoginBtn) {
    toLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      registerSection.style.display = 'none';
      loginSection.style.display = 'block';
      window.scrollTo({ top: 120, behavior: 'smooth' });
    });
  }

  // 8. Demo Accounts Quick-Fill
  if (demoPelangganBtn) {
    demoPelangganBtn.addEventListener('click', () => {
      setRoleTab('customer');
      if (loginIdentifierInput) loginIdentifierInput.value = 'pelanggan@aishcatering.com';
      if (loginPasswordInput) loginPasswordInput.value = 'aish123';
      showToast('Kredensial Demo Pelanggan terisi otomatis!');
    });
  }

  if (demoAdminBtn) {
    demoAdminBtn.addEventListener('click', () => {
      setRoleTab('admin');
      if (loginIdentifierInput) loginIdentifierInput.value = 'admin@aishcatering.com';
      if (loginPasswordInput) loginPasswordInput.value = 'admin123';
      showToast('Kredensial Demo Admin terisi otomatis!');
    });
  }

  // 9. Handle Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const identifier = loginIdentifierInput.value.trim().toLowerCase();
      const password = loginPasswordInput.value;
      const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : true;

      if (!identifier) {
        showToast('Mohon masukkan email, nomor WhatsApp, atau username Anda.', 'error');
        loginIdentifierInput.focus();
        return;
      }

      if (!password) {
        showToast('Mohon masukkan kata sandi Anda.', 'error');
        loginPasswordInput.focus();
        return;
      }

      // Show Loading State
      btnLoginSubmit.classList.add('loading');
      btnLoginSubmit.disabled = true;

      setTimeout(() => {
        const users = getUsersDB();
        // Match by email, phone, or username
        const matched = users.find(u => {
          const emailMatch = u.email && u.email.toLowerCase() === identifier;
          const phoneMatch = u.phone && u.phone.replace(/[^0-9]/g, '') === identifier.replace(/[^0-9]/g, '');
          const idMatch = u.id && u.id.toLowerCase() === identifier;
          return (emailMatch || phoneMatch || idMatch) && u.password === password;
        });

        btnLoginSubmit.classList.remove('loading');
        btnLoginSubmit.disabled = false;

        if (matched) {
          // If logged into admin tab but role is customer or vice versa, warn gently or accept with actual role
          setSessionUser(matched, rememberMe);
          showToast(`Selamat datang kembali, ${matched.name}!`, 'success');
          
          setTimeout(() => {
            renderAuthState();
          }, 600);
        } else {
          showToast('Email/nomor WhatsApp atau kata sandi tidak cocok. Silakan coba lagi.', 'error');
        }
      }, 700);
    });
  }

  // 10. Handle Register Submission
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('regName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const pass = document.getElementById('regPassword').value;
      const passConfirm = document.getElementById('regPasswordConfirm').value;
      const termsAgree = document.getElementById('regTerms').checked;
      const btnRegisterSubmit = document.getElementById('btnRegisterSubmit');

      if (!name) {
        showToast('Silakan masukkan nama lengkap Anda.', 'error');
        return;
      }

      if (!phone || phone.length < 8) {
        showToast('Silakan masukkan nomor WhatsApp aktif yang valid.', 'error');
        return;
      }

      if (!email || !email.includes('@')) {
        showToast('Silakan masukkan alamat email yang valid.', 'error');
        return;
      }

      if (pass.length < 6) {
        showToast('Kata sandi minimal harus 6 karakter.', 'error');
        return;
      }

      if (pass !== passConfirm) {
        showToast('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.', 'error');
        return;
      }

      if (!termsAgree) {
        showToast('Silakan centang persetujuan Ketentuan Layanan katering.', 'error');
        return;
      }

      btnRegisterSubmit.classList.add('loading');
      btnRegisterSubmit.disabled = true;

      setTimeout(() => {
        const users = getUsersDB();

        // Check if email or phone already registered
        const exists = users.find(u => u.email === email || u.phone === phone);
        if (exists) {
          btnRegisterSubmit.classList.remove('loading');
          btnRegisterSubmit.disabled = false;
          showToast('Email atau nomor WhatsApp ini sudah terdaftar. Silakan langsung masuk.', 'error');
          return;
        }

        const newUser = {
          id: 'cust-' + Date.now().toString().slice(-4),
          name: name,
          email: email,
          phone: phone,
          password: pass,
          role: 'customer',
          createdAt: new Date().toISOString().split('T')[0]
        };

        users.push(newUser);
        saveUsersDB(users);
        setSessionUser(newUser, true);

        btnRegisterSubmit.classList.remove('loading');
        btnRegisterSubmit.disabled = false;

        showToast('Pendaftaran akun berhasil! Anda otomatis masuk.', 'success');
        
        setTimeout(() => {
          renderAuthState();
        }, 700);
      }, 700);
    });
  }

  // 11. Social / WhatsApp OTP Quick Login Mock
  const btnGoogleLogin = document.getElementById('btnGoogleLogin');
  const btnWaLogin = document.getElementById('btnWaLogin');

  if (btnGoogleLogin) {
    btnGoogleLogin.addEventListener('click', () => {
      showToast('Menghubungkan ke Akun Google...', 'success');
      setTimeout(() => {
        const mockGoogleUser = {
          id: 'goog-' + Date.now().toString().slice(-4),
          name: 'Tamu Google (Singkawang)',
          email: 'pengguna.google@gmail.com',
          phone: '081298765432',
          role: 'customer'
        };
        setSessionUser(mockGoogleUser, true);
        showToast('Berhasil masuk dengan akun Google!', 'success');
        renderAuthState();
      }, 1000);
    });
  }

  if (btnWaLogin) {
    btnWaLogin.addEventListener('click', () => {
      const waNumber = prompt('Masukkan Nomor WhatsApp aktif Anda (contoh: 081234567890):', '081234567890');
      if (waNumber && waNumber.trim().length >= 9) {
        showToast('Kode OTP 4-digit dikirim via WhatsApp...', 'success');
        setTimeout(() => {
          const otp = prompt('Masukkan 4 digit kode verifikasi yang Anda terima di WhatsApp (Demo: 1234):', '1234');
          if (otp === '1234') {
            const mockWaUser = {
              id: 'wa-' + Date.now().toString().slice(-4),
              name: 'Pelanggan WhatsApp',
              phone: waNumber.trim(),
              email: 'wa.' + waNumber.trim() + '@aishcatering.com',
              role: 'customer'
            };
            setSessionUser(mockWaUser, true);
            showToast('Verifikasi OTP berhasil! Selamat datang.', 'success');
            renderAuthState();
          } else if (otp !== null) {
            showToast('Kode OTP tidak sesuai (gunakan 1234 untuk demo).', 'error');
          }
        }, 600);
      }
    });
  }

  // 12. Logout
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      clearSession();
      showToast('Anda telah berhasil keluar dari akun.', 'success');
      setTimeout(() => {
        renderAuthState();
      }, 400);
    });
  }

  // 13. Forgot Password Modal Logic
  if (forgotPasswordBtn && forgotModal) {
    forgotPasswordBtn.addEventListener('click', (e) => {
      e.preventDefault();
      forgotModal.classList.add('active');
      if (forgotEmailInput) {
        forgotEmailInput.value = loginIdentifierInput.value || '';
        forgotEmailInput.focus();
      }
    });
  }

  if (forgotModalClose && forgotModal) {
    forgotModalClose.addEventListener('click', () => {
      forgotModal.classList.remove('active');
    });
  }

  if (forgotModal) {
    forgotModal.addEventListener('click', (e) => {
      if (e.target === forgotModal) {
        forgotModal.classList.remove('active');
      }
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = forgotEmailInput.value.trim();
      if (!val) {
        showToast('Silakan masukkan email atau nomor WhatsApp Anda.', 'error');
        return;
      }

      showToast(`Tautan reset sandi telah dikirim ke ${val}! Silakan periksa inbox/pesan Anda.`, 'success');
      forgotModal.classList.remove('active');
    });
  }

  // Initialize
  setupPasswordToggles();
  renderAuthState();
});
