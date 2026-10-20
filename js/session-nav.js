// ===================================================================
// SESSION NAV - Aish Catering Singkawang
// Dijalankan di semua halaman (index, menu, menu-konsumen, dll.)
// Mengecek sesi login dan mengganti tombol Login di navbar
// dengan avatar profil + dropdown interaktif kaya fitur jika pengguna login.
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
    if (!name) return 'A';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Admin Pengelola';
    return 'Pelanggan VIP';
  };

  document.addEventListener('DOMContentLoaded', () => {
    const user = getSessionUser();
    const loginBtn = document.getElementById('headerLoginBtn');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Update Mobile Drawer jika ada
    const mobileLoginLink = document.querySelector('.mobile-nav-link[href*="login.html"]');
    if (mobileLoginLink && user) {
      const mobileLi = mobileLoginLink.parentElement;
      const initials = getInitials(user.name);
      const roleLabel = getRoleLabel(user.role);
      
      mobileLi.innerHTML = `
        <div style="padding: 12px 16px; background: rgba(197, 160, 89, 0.12); border: 1px solid rgba(197, 160, 89, 0.3); border-radius: 12px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #1d3e2f; color: #dfbd77; display: flex; align-items: center; justify-content: center; font-weight: 700; border: 1.5px solid #c5a059;">
              ${initials}
            </div>
            <div>
              <div style="font-weight: 700; color: #dfbd77; font-size: 0.9rem;">${user.name}</div>
              <div style="font-size: 0.72rem; color: #c5a059;">${roleLabel}</div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${user.role === 'admin' ? `
            <a href="admin-dashboard.html" style="font-size: 0.82rem; color: #dfbd77; display: flex; align-items: center; gap: 8px; text-decoration: none; padding: 6px 0; font-weight: 700;">
              <i class="fa-solid fa-crown text-gold"></i> Dashboard Admin (CMS)
            </a>` : ''}
            <a href="menu-konsumen.html" style="font-size: 0.82rem; color: #ffffff; display: flex; align-items: center; gap: 8px; text-decoration: none; padding: 6px 0;">
              <i class="fa-solid fa-crown text-gold"></i> Menu Khusus Konsumen
            </a>
            <button id="mobileLogoutBtn" style="background: rgba(186, 26, 26, 0.2); border: 1px solid rgba(186, 26, 26, 0.4); color: #ff8b8b; padding: 6px 12px; border-radius: 8px; font-size: 0.78rem; font-weight: 600; cursor: pointer; text-align: center; margin-top: 4px;">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Keluar (Logout)
            </button>
          </div>
        </div>
      `;

      const mobLogout = document.getElementById('mobileLogoutBtn');
      if (mobLogout) {
        mobLogout.addEventListener('click', () => {
          clearSession();
          window.location.href = 'login.html';
        });
      }
    }

    if (!loginBtn) return;

    if (user) {
      // ── PENGGUNA SUDAH LOGIN: ganti tombol Login dengan avatar profil & rich dropdown ──
      const initials = getInitials(user.name);
      const roleLabel = getRoleLabel(user.role);
      const firstName = user.name ? user.name.split(' ')[0] : 'Konsumen';
      const isConsumerPage = currentPage === 'menu-konsumen.html';

      const profileWrap = document.createElement('div');
      profileWrap.className = 'nav-profile-wrap';
      profileWrap.id = 'navProfileWrap';

      profileWrap.innerHTML = `
        <button class="nav-profile-btn" id="navProfileBtn" aria-haspopup="true" aria-expanded="false" title="Menu Akun ${user.name}">
          <div class="nav-avatar-circle">${initials}</div>
          <div class="nav-profile-info">
            <span class="nav-profile-name">${firstName}</span>
            <span class="nav-profile-badge">${roleLabel}</span>
          </div>
          <i class="fa-solid fa-chevron-down nav-profile-chevron"></i>
        </button>

        <div class="nav-profile-dropdown" id="navProfileDropdown" role="menu">
          <!-- Header dropdown card -->
          <div class="dropdown-user-header">
            <div class="dropdown-avatar-lg">${initials}</div>
            <div class="dropdown-user-info">
              <span class="dropdown-user-name">${user.name}</span>
              <span class="dropdown-user-email">${user.email || user.phone || 'Pelanggan Terdaftar'}</span>
              <span class="dropdown-role-tag">
                <i class="fa-solid fa-circle-check"></i> ${roleLabel} Terverifikasi
              </span>
            </div>
          </div>

          <!-- Quick Active Status Pill -->
          <div class="dropdown-status-pill">
            <span class="status-text">
              <span class="status-dot"></span> 1 Reservasi Siap Dikonsultasikan
            </span>
            <span style="color: #775a19; font-weight: 700;">VIP</span>
          </div>

          <div class="dropdown-divider"></div>

          <!-- Menu Dropdown Pilihan Konsumen -->
          <div class="dropdown-menu-list">
            ${user.role === 'admin' ? `
            <a href="admin-dashboard.html" class="dropdown-item" role="menuitem" style="background: rgba(197, 160, 89, 0.12); border-left: 3px solid #c5a059;">
              <i class="fa-solid fa-crown" style="color: #c5a059;"></i>
              <div>
                <strong style="display:block; font-size:0.86rem; color: #1d3e2f;">Dashboard Admin (CMS)</strong>
                <span style="font-size:0.72rem; color:#775a19; font-weight:400;">Pusat kendali pesanan, menu & konten web</span>
              </div>
            </a>
            ` : ''}
            <a href="menu-konsumen.html" class="dropdown-item ${isConsumerPage ? 'active-page' : ''}" role="menuitem">
              <i class="fa-solid fa-crown" style="color: #c5a059;"></i>
              <div>
                <strong style="display:block; font-size:0.86rem; color: #1d3e2f;">Menu Khusus Konsumen</strong>
                <span style="font-size:0.72rem; color:#775a19; font-weight:400;">Kustomisasi prasmanan & diskon porsi besar</span>
              </div>
            </a>

            <a href="menu.html" class="dropdown-item ${currentPage === 'menu.html' ? 'active-page' : ''}" role="menuitem">
              <i class="fa-solid fa-bowl-rice"></i>
              <span>Katalog Semua Hidangan</span>
            </a>

            <a href="index.html#paket-catering" class="dropdown-item" role="menuitem">
              <i class="fa-solid fa-utensils"></i>
              <span>Paket Prasmanan & Resepsi</span>
            </a>

            <a href="menu-konsumen.html#status-pesanan" class="dropdown-item" role="menuitem">
              <i class="fa-regular fa-calendar-check"></i>
              <span>Status & Riwayat Pesanan Saya</span>
            </a>

            <a href="menu-konsumen.html#simulasi-racik" class="dropdown-item" role="menuitem">
              <i class="fa-solid fa-sliders"></i>
              <span>Racik Menu Sendiri (Simulasi Biaya)</span>
            </a>

            <a href="https://wa.me/6281234567890?text=Halo%20Aish%20Catering,%20saya%20pelanggan%20VIP%20${encodeURIComponent(user.name)},%20ingin%20konsultasi%20menu" target="_blank" class="dropdown-item" role="menuitem">
              <i class="fa-brands fa-whatsapp" style="color: #25d366;"></i>
              <span>Konsultasi Chef Prioritas via WA</span>
            </a>
          </div>

          <div class="dropdown-divider"></div>

          <!-- Logout Button -->
          <button class="dropdown-item dropdown-item-logout" id="navLogoutBtn" role="menuitem">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Keluar dari Akun (Logout)</span>
          </button>
        </div>
      `;

      // Ganti tombol Login di navbar dengan profil dropdown
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

      // Logout handler
      const logoutBtn = document.getElementById('navLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          clearSession();
          logoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Mengeluarkan akun...</span>';
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 600);
        });
      }
    }
  });
})();
