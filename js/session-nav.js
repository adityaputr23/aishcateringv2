// ===================================================================
// SESSION NAV - Aish Catering Singkawang
// Dijalankan di semua halaman (index, menu, dll.)
// Mengecek sesi login dan mengganti tombol Login di navbar
// dengan avatar profil + dropdown jika pengguna sudah login.
// ===================================================================

(function () {
  const STORAGE_KEY_SESSION = 'aish_auth_session';

  // Ambil data sesi user
  const getSessionUser = () => {
    const local = localStorage.getItem(STORAGE_KEY_SESSION);
    if (local) { try { return JSON.parse(local); } catch (e) { return null; } }
    const session = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (session) { try { return JSON.parse(session); } catch (e) { return null; } }
    return null;
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
  };

  // Inisial nama (maks 2 karakter)
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Warna avatar berdasarkan role
  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Admin / Staf';
    return 'Pelanggan';
  };

  document.addEventListener('DOMContentLoaded', () => {
    const user = getSessionUser();

    // Cari tombol Login di header-actions (#headerLoginBtn)
    const loginBtn = document.getElementById('headerLoginBtn');
    if (!loginBtn) return;

    if (user) {
      // ── PENGGUNA SUDAH LOGIN: ganti tombol Login dengan avatar profil ──
      const initials = getInitials(user.name);
      const roleLabel = getRoleLabel(user.role);
      const firstName = user.name ? user.name.split(' ')[0] : 'Pengguna';

      // Buat elemen profil dropdown
      const profileWrap = document.createElement('div');
      profileWrap.className = 'nav-profile-wrap';
      profileWrap.id = 'navProfileWrap';

      profileWrap.innerHTML = `
        <button class="nav-profile-btn" id="navProfileBtn" aria-haspopup="true" aria-expanded="false" title="${user.name}">
          <div class="nav-avatar">${initials}</div>
          <span class="nav-profile-name">${firstName}</span>
          <i class="fa-solid fa-chevron-down nav-chevron"></i>
        </button>

        <div class="nav-profile-dropdown" id="navProfileDropdown" role="menu">
          <!-- Header dropdown -->
          <div class="dropdown-user-header">
            <div class="dropdown-avatar-lg">${initials}</div>
            <div class="dropdown-user-info">
              <strong>${user.name}</strong>
              <span>${user.email || user.phone || ''}</span>
              <span class="dropdown-role-badge">${roleLabel}</span>
            </div>
          </div>

          <div class="dropdown-divider"></div>

          <!-- Menu dropdown -->
          <a href="index.html" class="dropdown-item" role="menuitem">
            <i class="fa-solid fa-house"></i>
            <span>Beranda</span>
          </a>
          <a href="menu.html" class="dropdown-item" role="menuitem">
            <i class="fa-solid fa-bowl-rice"></i>
            <span>Pilih Menu Katering</span>
          </a>
          <a href="index.html#paket-catering" class="dropdown-item" role="menuitem">
            <i class="fa-regular fa-calendar-check"></i>
            <span>Paket & Reservasi</span>
          </a>

          <div class="dropdown-divider"></div>

          <button class="dropdown-item dropdown-item-logout" id="navLogoutBtn" role="menuitem">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Keluar (Logout)</span>
          </button>
        </div>
      `;

      // Ganti tombol Login dengan profil dropdown
      loginBtn.replaceWith(profileWrap);

      // Toggle dropdown saat klik avatar
      const profileBtn = document.getElementById('navProfileBtn');
      const dropdown = document.getElementById('navProfileDropdown');

      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('open');
        profileBtn.setAttribute('aria-expanded', isOpen);
      });

      // Tutup dropdown saat klik di luar
      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
        profileBtn.setAttribute('aria-expanded', 'false');
      });

      dropdown.addEventListener('click', (e) => e.stopPropagation());

      // Logout
      const logoutBtn = document.getElementById('navLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          clearSession();
          // Tampilkan feedback sebentar lalu reload
          logoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Keluar...</span>';
          setTimeout(() => {
            window.location.reload();
          }, 600);
        });
      }

    }
    // Jika tidak login → tombol Login tetap tampil seperti biasa
  });
})();
