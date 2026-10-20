// ===================================================================
// AISH CATERING SINGKAWANG - ADMIN DASHBOARD CONTROLLER
// Full CMS & Business Control Panel
// ===================================================================

(function () {
  'use strict';

  const STORAGE_KEY_SESSION  = 'aish_auth_session';
  const STORAGE_KEY_USERS    = 'aish_users_db_v1';
  const STORAGE_KEY_ORDERS   = 'aish_orders_db_v1';
  const STORAGE_KEY_MENUS    = 'aish_menus_db_v1';
  const STORAGE_KEY_SETTINGS = 'aish_settings_db_v1';

  // ─── AUTH GUARD ─────────────────────────────────────
  const getSession = () => {
    try {
      const l = localStorage.getItem(STORAGE_KEY_SESSION);
      if (l) return JSON.parse(l);
      const s = sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (s) return JSON.parse(s);
    } catch (_) {}
    return null;
  };

  const session = getSession();
  if (!session || session.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  // ─── DEFAULT DATA ───────────────────────────────────
  const defaultOrders = [
    { id: 'ORD-2026-001', customer: 'dr. Fitriani', email: 'fitriani@email.com', phone: '081234567890', package: 'Paket Pernikahan Grand Prasmanan', pax: 350, date: '2026-11-15', eventDate: '2026-11-28', amount: 28000000, status: 'confirmed', notes: 'Dekorasi merah marun, live band' },
    { id: 'ORD-2026-002', customer: 'Dian Kurniawan', email: 'dian.kw@pemkot.id', phone: '082345678901', package: 'Catering Kantor – Paket Bento Premium', pax: 200, date: '2026-11-14', eventDate: '2026-11-20', amount: 8000000, status: 'in-progress', notes: 'Acara seminar 2 hari' },
    { id: 'ORD-2026-003', customer: 'Ibu Hj. Mariam', email: 'mariam@mail.com', phone: '083456789012', package: 'Tumpeng Syukuran Agung + Coffee Break', pax: 80, date: '2026-11-13', eventDate: '2026-11-25', amount: 5600000, status: 'pending', notes: 'Syukuran rumah baru, tumpeng 3 tingkat' },
    { id: 'ORD-2026-004', customer: 'Bpk. Rasyid', email: 'rasyid@gmail.com', phone: '084567890123', package: 'Coffee Break & Snack Box Otentik', pax: 50, date: '2026-11-12', eventDate: '2026-11-18', amount: 875000, status: 'completed', notes: 'Rapat internal kantor' },
    { id: 'ORD-2026-005', customer: 'Cindy Pratiwi', email: 'pelanggan@aishcatering.com', phone: '081234567890', package: 'Paket Pernikahan Grand Prasmanan', pax: 250, date: '2026-11-10', eventDate: '2026-12-05', amount: 21500000, status: 'confirmed', notes: '' },
    { id: 'ORD-2026-006', customer: 'Ahmad Fauzi', email: 'ahmad.fauzi@email.com', phone: '085678901234', package: 'Box Bento Premium 50pcs', pax: 50, date: '2026-11-09', eventDate: '2026-11-16', amount: 1750000, status: 'cancelled', notes: 'Dibatalkan karena agenda berubah' },
  ];

  const defaultMenus = [
    { id: 'menu-01', category: 'Paket Pernikahan', name: 'Grand Prasmanan Pernikahan', price: 85000, unit: 'pax', minPax: 200, status: 'active', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80', desc: 'Prasmanan lengkap dengan dekorasi meja bunga segar dan 12-15 pilihan hidangan' },
    { id: 'menu-02', category: 'Syukuran', name: 'Tumpeng Syukuran Agung', price: 450000, unit: 'tumpeng', minPax: 30, status: 'active', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', desc: 'Tumpeng nasi kuning kerucut/tingkat dengan lauk lengkap khas Singkawang' },
    { id: 'menu-03', category: 'Catering Kantor', name: 'Box Bento Premium', price: 35000, unit: 'box', minPax: 30, status: 'active', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80', desc: 'Makan siang sehat dalam kemasan eksklusif untuk rapat dan seminar' },
    { id: 'menu-04', category: 'Coffee Break', name: 'Snack Box Otentik Singkawang', price: 17500, unit: 'paket 3 kue', minPax: 30, status: 'active', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', desc: 'Choipan, kue basah tradisional, teh tubruk melati dan kopi Singkawang' },
    { id: 'menu-05', category: 'Add-on', name: 'Live Stall Kambing Guling Rempah', price: 2800000, unit: 'stall', minPax: 60, status: 'active', image: 'https://images.unsplash.com/photo-1544025162-d76594e8ef6b?auto=format&fit=crop&w=600&q=80', desc: 'Kambing guling 1 ekor ~60 porsi dengan bumbu rempah khas Singkawang' },
    { id: 'menu-06', category: 'Prasmanan Custom', name: 'Paket Buffet Ulang Tahun', price: 75000, unit: 'pax', minPax: 100, status: 'inactive', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80', desc: 'Buffet birthday party dengan dekorasi tema khusus' },
  ];

  const defaultSettings = {
    siteName: 'Aish Catering Singkawang',
    tagline: 'Cita Rasa Singkawang, Kelas Dunia',
    heroTitle: 'Cita Rasa Singkawang Yang Memesona',
    heroSubtitle: 'Sajian autentik Singkawang untuk momen spesial Anda — pernikahan, syukuran, maupun gathering eksklusif.',
    phone: '+62 813-4555-2229',
    whatsapp: '6281345552229',
    email: 'aishcatering@gmail.com',
    address: 'Jl. Raya Singkawang Pemangkat No. 12, Singkawang Tengah, Kota Singkawang, Kalimantan Barat 79119',
    instagram: '@aishcatering.id',
    facebook: 'Aish Catering Singkawang',
    operasionalJam: 'Senin–Sabtu 08.00–20.00 WIB | Minggu 09.00–16.00 WIB',
    minOrderDays: 3,
    maxPaxPerDay: 500,
    depositPercent: 50,
    bankName: 'BCA',
    bankAccount: '1234567890',
    bankHolder: 'Aish Catering Singkawang',
  };

  // ─── LOCAL DB HELPERS ───────────────────────────────
  const getDB = (key, def) => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : def; }
    catch (_) { return def; }
  };
  const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  // Init DBs
  if (!localStorage.getItem(STORAGE_KEY_ORDERS))   setDB(STORAGE_KEY_ORDERS, defaultOrders);
  if (!localStorage.getItem(STORAGE_KEY_MENUS))    setDB(STORAGE_KEY_MENUS, defaultMenus);
  if (!localStorage.getItem(STORAGE_KEY_SETTINGS)) setDB(STORAGE_KEY_SETTINGS, defaultSettings);

  // ─── STATE ──────────────────────────────────────────
  let orders   = getDB(STORAGE_KEY_ORDERS, defaultOrders);
  let menus    = getDB(STORAGE_KEY_MENUS, defaultMenus);
  let users    = getDB(STORAGE_KEY_USERS, []);
  let settings = getDB(STORAGE_KEY_SETTINGS, defaultSettings);
  let orderFilter = 'all';
  let calMonth = new Date().getMonth();
  let calYear  = new Date().getFullYear();

  // ─── DOM READY ──────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initAdminInfo();
    initNavigation();
    renderDashboard();
    renderCalendar(calYear, calMonth);
    renderOrders();
    renderMenus();
    renderUsers();
    renderSettings();
    initOrderModal();
    initMenuModal();
    initSidebarToggle();
  });

  // ─── ADMIN INFO ─────────────────────────────────────
  function initAdminInfo() {
    const nameEl = document.getElementById('adminDisplayName');
    const initEl = document.getElementById('adminInitials');
    if (nameEl) nameEl.textContent = session.name || 'Admin';
    if (initEl) {
      const parts = (session.name || 'AD').split(' ');
      initEl.textContent = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    }
  }

  // ─── SIDEBAR NAVIGATION ─────────────────────────────
  function initNavigation() {
    document.querySelectorAll('.sidebar-nav-item[data-section]').forEach(item => {
      item.addEventListener('click', () => {
        const target = item.dataset.section;
        switchSection(target);
      });
    });

    document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
      window.location.href = 'login.html';
    });
  }

  function switchSection(name) {
    // Update nav items
    document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.sidebar-nav-item[data-section="${name}"]`)?.classList.add('active');

    // Update sections
    document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
    document.getElementById('section-' + name)?.classList.add('active');

    // Update header title
    const label = document.querySelector(`.sidebar-nav-item[data-section="${name}"] .nav-label`);
    const titleEl = document.getElementById('adminPageTitle');
    if (titleEl && label) titleEl.textContent = label.textContent;

    // Re-render if needed
    if (name === 'dashboard') renderDashboard();
    if (name === 'orders')    renderOrders();
    if (name === 'menus')     renderMenus();
    if (name === 'customers') renderUsers();
    if (name === 'calendar')  renderCalendar(calYear, calMonth);
  }

  // ─── SIDEBAR TOGGLE (MOBILE) ─────────────────────────
  function initSidebarToggle() {
    const btn = document.getElementById('sidebarToggleBtn');
    const layout = document.querySelector('.admin-layout');
    btn?.addEventListener('click', () => {
      layout?.classList.toggle('sidebar-open');
      layout?.classList.toggle('sidebar-collapsed');
    });
  }

  // ─── HELPERS ────────────────────────────────────────
  function fmt(n) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n); }
  function fmtDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); }
  function initials(name) { const p = (name||'?').split(' '); return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase(); }
  function generateId(prefix) { return prefix + Date.now().toString(36).toUpperCase(); }
  function today() { return new Date().toISOString().split('T')[0]; }

  function statusBadge(st) {
    const map = {
      pending: ['pending', 'Menunggu'], confirmed: ['confirmed', 'Dikonfirmasi'],
      'in-progress': ['in-progress', 'Diproses'], completed: ['completed', 'Selesai'],
      cancelled: ['cancelled', 'Dibatalkan'], active: ['active', 'Aktif'], inactive: ['inactive', 'Nonaktif']
    };
    const [cls, lbl] = map[st] || ['pending', st];
    return `<span class="status-badge ${cls}">${lbl}</span>`;
  }

  function showToast(msg, type = 'success') {
    const container = document.querySelector('.admin-toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  // ─── DASHBOARD OVERVIEW ─────────────────────────────
  function renderDashboard() {
    const totalRevenue   = orders.filter(o => o.status === 'completed' || o.status === 'confirmed').reduce((s, o) => s + o.amount, 0);
    const pendingCount   = orders.filter(o => o.status === 'pending').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;
    const activeMenus    = menus.filter(m => m.status === 'active').length;
    const customerCount  = users.filter(u => u.role !== 'admin').length;

    setText('statRevenue',   fmt(totalRevenue));
    setText('statOrders',    orders.length);
    setText('statCustomers', customerCount);
    setText('statMenus',     activeMenus);
    setText('statPending',   pendingCount > 0 ? `${pendingCount} perlu tindakan` : 'Tidak ada');

    // Recent orders table
    const recent = [...orders].slice(0, 5);
    const tbody  = document.getElementById('recentOrdersTbody');
    if (tbody) {
      tbody.innerHTML = recent.map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>
            <div class="user-cell">
              <div class="user-mini-avatar">${initials(o.customer)}</div>
              <div>
                <div class="user-cell-name">${o.customer}</div>
                <div class="user-cell-email">${o.package}</div>
              </div>
            </div>
          </td>
          <td>${o.pax} pax</td>
          <td>${fmtDate(o.eventDate)}</td>
          <td>${fmt(o.amount)}</td>
          <td>${statusBadge(o.status)}</td>
          <td>
            <button class="btn-admin btn-admin-outline btn-admin-sm" onclick="adminApp.openOrderDetail('${o.id}')">
              <i class="fa-solid fa-eye"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Activity feed
    renderActivityFeed();
    // Bar chart
    renderBarChart();
    // Donut chart
    renderDonutChart();
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderActivityFeed() {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;
    const activities = [
      { type: 'order',   icon: 'fa-receipt',     msg: 'Pesanan baru dari <strong>Ibu Hj. Mariam</strong> – Tumpeng Syukuran', time: '8 mnt lalu' },
      { type: 'user',    icon: 'fa-user-plus',   msg: 'Pelanggan baru terdaftar: <strong>Bpk. Ahmad Fauzi</strong>', time: '24 mnt lalu' },
      { type: 'payment', icon: 'fa-circle-check', msg: 'Pembayaran DP dikonfirmasi – ORD-2026-002', time: '1 jam lalu' },
      { type: 'order',   icon: 'fa-pen-to-square', msg: 'Status ORD-2026-001 diperbarui → <strong>Dikonfirmasi</strong>', time: '2 jam lalu' },
      { type: 'alert',   icon: 'fa-triangle-exclamation', msg: 'Tanggal 28 Nov — kapasitas mendekati batas 500 pax', time: '3 jam lalu' },
    ];
    feed.innerHTML = activities.map(a => `
      <div class="activity-item">
        <div class="activity-icon ${a.type}"><i class="fa-solid ${a.icon}"></i></div>
        <div class="activity-text">
          <div class="activity-msg">${a.msg}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </div>
    `).join('');
  }

  function renderBarChart() {
    const chart = document.getElementById('revenueBarChart');
    if (!chart) return;
    const months = ['Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const vals   = [42, 58, 67, 80, 95, 73]; // % heights
    chart.innerHTML = months.map((m, i) => `
      <div class="bar-col">
        <div class="bar-fill" style="height:${vals[i]}%"></div>
        <div class="bar-label">${m}</div>
      </div>
    `).join('');
  }

  function renderDonutChart() {
    const wrap = document.getElementById('orderDonutChart');
    if (!wrap) return;
    const total = orders.length || 1;
    const pct = (st) => Math.round(orders.filter(o => o.status === st).length / total * 100);
    const confirmed = pct('confirmed');
    const completed = pct('completed');
    const pending   = pct('pending');
    const rest      = 100 - confirmed - completed - pending;

    const segments = [
      { color: '#25d366', pct: completed,  label: 'Selesai' },
      { color: '#4db6e4', pct: confirmed,  label: 'Dikonfirmasi' },
      { color: '#c5a059', pct: pending,    label: 'Menunggu' },
      { color: '#e24c4c', pct: rest < 0 ? 0 : rest, label: 'Lainnya' },
    ];

    // Build SVG donut
    let offset = 0;
    const r = 44, cx = 60, cy = 60, circ = 2 * Math.PI * r;
    const svgPaths = segments.filter(s => s.pct > 0).map(s => {
      const dash = (s.pct / 100) * circ;
      const svg  = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="12"
                    stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})" />`;
      offset += dash;
      return svg;
    }).join('');

    wrap.innerHTML = `
      <div class="donut-chart-wrap">
        <svg class="donut-svg" viewBox="0 0 120 120">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1a2a21" stroke-width="12"/>
          ${svgPaths}
          <text x="${cx}" y="${cy}" text-anchor="middle" dy="5" fill="#f0e8d5" font-size="14" font-weight="bold">${total}</text>
          <text x="${cx}" y="${cy+16}" text-anchor="middle" fill="#8a9590" font-size="8">Pesanan</text>
        </svg>
        <div class="donut-legend">
          ${segments.map(s => `
            <div class="donut-leg-item">
              <div class="donut-leg-label">
                <div class="donut-dot" style="background:${s.color}"></div>
                <span style="color:var(--admin-text-muted);font-size:0.74rem;">${s.label}</span>
              </div>
              <span class="donut-pct">${s.pct}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ─── ORDERS ─────────────────────────────────────────
  function renderOrders() {
    const filtered = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);
    const tbody = document.getElementById('ordersTbody');
    if (!tbody) return;

    // Update filter tabs
    document.querySelectorAll('.order-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === orderFilter);
    });

    tbody.innerHTML = filtered.length === 0 ? `
      <tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--admin-text-dim);">Tidak ada pesanan</td></tr>
    ` : filtered.map(o => `
      <tr>
        <td><strong style="color:var(--admin-gold)">${o.id}</strong></td>
        <td>
          <div class="user-cell">
            <div class="user-mini-avatar">${initials(o.customer)}</div>
            <div>
              <div class="user-cell-name">${o.customer}</div>
              <div class="user-cell-email">${o.email}</div>
            </div>
          </div>
        </td>
        <td><span style="font-size:0.78rem">${o.package}</span></td>
        <td>${o.pax} pax</td>
        <td>${fmtDate(o.eventDate)}</td>
        <td><strong>${fmt(o.amount)}</strong></td>
        <td>${statusBadge(o.status)}</td>
        <td>
          <div style="display:flex;gap:5px;">
            <button class="btn-admin btn-admin-outline btn-admin-sm" onclick="adminApp.openOrderDetail('${o.id}')" title="Lihat Detail">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-admin btn-admin-success btn-admin-sm" onclick="adminApp.changeOrderStatus('${o.id}','completed')" title="Tandai Selesai">
              <i class="fa-solid fa-check"></i>
            </button>
            <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="adminApp.deleteOrder('${o.id}')" title="Hapus">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ─── ORDER MODAL ─────────────────────────────────────
  function initOrderModal() {
    // Filter buttons
    document.querySelectorAll('.order-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        orderFilter = btn.dataset.filter;
        renderOrders();
      });
    });

    // Close modal
    document.getElementById('closeOrderModal')?.addEventListener('click', closeOrderModal);
    document.getElementById('orderModalOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'orderModalOverlay') closeOrderModal();
    });

    // Search
    document.getElementById('orderSearchInput')?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const tbody = document.getElementById('ordersTbody');
      if (!tbody) return;
      const filtered = orders.filter(o =>
        o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) ||
        o.package.toLowerCase().includes(q)
      );
      tbody.innerHTML = filtered.map(o => `
        <tr>
          <td><strong style="color:var(--admin-gold)">${o.id}</strong></td>
          <td><div class="user-cell"><div class="user-mini-avatar">${initials(o.customer)}</div><div><div class="user-cell-name">${o.customer}</div><div class="user-cell-email">${o.email}</div></div></div></td>
          <td><span style="font-size:0.78rem">${o.package}</span></td>
          <td>${o.pax} pax</td>
          <td>${fmtDate(o.eventDate)}</td>
          <td><strong>${fmt(o.amount)}</strong></td>
          <td>${statusBadge(o.status)}</td>
          <td>
            <div style="display:flex;gap:5px;">
              <button class="btn-admin btn-admin-outline btn-admin-sm" onclick="adminApp.openOrderDetail('${o.id}')"><i class="fa-solid fa-eye"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
    });

    // Add new order button
    document.getElementById('btnAddOrder')?.addEventListener('click', openAddOrderForm);
    document.getElementById('addOrderForm')?.addEventListener('submit', handleAddOrder);
    document.getElementById('closeAddOrderModal')?.addEventListener('click', closeAddOrderModal);
  }

  window.adminApp = {
    openOrderDetail(id) {
      const order = orders.find(o => o.id === id);
      if (!order) return;
      const modal = document.getElementById('orderModalOverlay');
      const content = document.getElementById('orderModalContent');
      if (!content || !modal) return;
      content.innerHTML = `
        <div class="admin-modal-header">
          <div>
            <div style="font-size:0.68rem;color:var(--admin-gold);font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Detail Pesanan</div>
            <div class="admin-modal-title">${order.id}</div>
          </div>
          <button class="admin-modal-close" id="closeOrderModal">&times;</button>
        </div>
        <div style="display:grid;gap:1rem;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div>
              <div class="admin-form-label">Pelanggan</div>
              <div style="font-weight:700;color:#f0e8d5">${order.customer}</div>
              <div style="font-size:0.78rem;color:var(--admin-text-muted)">${order.email}</div>
              <div style="font-size:0.78rem;color:var(--admin-text-muted)">${order.phone}</div>
            </div>
            <div>
              <div class="admin-form-label">Status</div>
              <div>${statusBadge(order.status)}</div>
              <div class="admin-form-label" style="margin-top:.75rem">Tanggal Pesan</div>
              <div style="font-size:0.82rem">${fmtDate(order.date)}</div>
            </div>
          </div>
          <div style="background:var(--admin-surface-2);border:1px solid var(--admin-border);border-radius:10px;padding:1rem;">
            <div class="admin-form-label">Paket</div>
            <div style="font-weight:700;color:#f0e8d5">${order.package}</div>
            <div style="display:flex;gap:1rem;margin-top:.5rem;flex-wrap:wrap">
              <span style="font-size:0.78rem;color:var(--admin-text-muted)"><i class="fa-solid fa-users" style="color:var(--admin-gold);margin-right:4px"></i>${order.pax} pax</span>
              <span style="font-size:0.78rem;color:var(--admin-text-muted)"><i class="fa-solid fa-calendar-days" style="color:var(--admin-gold);margin-right:4px"></i>Acara: ${fmtDate(order.eventDate)}</span>
              <span style="font-size:0.78rem;color:var(--admin-text-muted)"><i class="fa-solid fa-wallet" style="color:var(--admin-gold);margin-right:4px"></i>${fmt(order.amount)}</span>
            </div>
            ${order.notes ? `<div style="margin-top:.5rem;font-size:0.78rem;color:var(--admin-text-dim);border-top:1px solid var(--admin-border);padding-top:.5rem">${order.notes}</div>` : ''}
          </div>
          <div>
            <div class="admin-form-label">Ubah Status</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${['pending','confirmed','in-progress','completed','cancelled'].map(s => `
                <button class="btn-admin ${order.status===s ? 'btn-admin-primary' : 'btn-admin-outline'} btn-admin-sm"
                  onclick="adminApp.changeOrderStatus('${order.id}','${s}');document.getElementById('closeOrderModal').click();">
                  ${statusBadge(s)}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      modal.classList.add('open');
      document.getElementById('closeOrderModal')?.addEventListener('click', closeOrderModal);
    },

    changeOrderStatus(id, status) {
      const idx = orders.findIndex(o => o.id === id);
      if (idx === -1) return;
      orders[idx].status = status;
      setDB(STORAGE_KEY_ORDERS, orders);
      renderOrders();
      renderDashboard();
      showToast(`Status ${id} berhasil diperbarui`, 'success');
    },

    deleteOrder(id) {
      if (!confirm(`Hapus pesanan ${id}?`)) return;
      orders = orders.filter(o => o.id !== id);
      setDB(STORAGE_KEY_ORDERS, orders);
      renderOrders();
      renderDashboard();
      showToast(`Pesanan ${id} dihapus`, 'error');
    },

    deleteMenu(id) {
      if (!confirm('Hapus menu ini?')) return;
      menus = menus.filter(m => m.id !== id);
      setDB(STORAGE_KEY_MENUS, menus);
      renderMenus();
      showToast('Menu berhasil dihapus', 'error');
    },

    toggleMenuStatus(id) {
      const idx = menus.findIndex(m => m.id === id);
      if (idx === -1) return;
      menus[idx].status = menus[idx].status === 'active' ? 'inactive' : 'active';
      setDB(STORAGE_KEY_MENUS, menus);
      renderMenus();
      showToast('Status menu diperbarui', 'success');
    },

    deleteUser(id) {
      if (!confirm('Hapus akun konsumen ini?')) return;
      users = users.filter(u => u.id !== id);
      setDB(STORAGE_KEY_USERS, users);
      renderUsers();
      showToast('Akun konsumen dihapus', 'error');
    }
  };

  function closeOrderModal() {
    document.getElementById('orderModalOverlay')?.classList.remove('open');
  }

  function openAddOrderForm() {
    document.getElementById('addOrderModalOverlay')?.classList.add('open');
  }

  function closeAddOrderModal() {
    document.getElementById('addOrderModalOverlay')?.classList.remove('open');
  }

  function handleAddOrder(e) {
    e.preventDefault();
    const form = e.target;
    const newOrder = {
      id: 'ORD-' + new Date().getFullYear() + '-' + String(orders.length + 1).padStart(3, '0'),
      customer: form.querySelector('#newCustName').value,
      email: form.querySelector('#newCustEmail').value,
      phone: form.querySelector('#newCustPhone').value,
      package: form.querySelector('#newPackage').value,
      pax: parseInt(form.querySelector('#newPax').value) || 0,
      date: today(),
      eventDate: form.querySelector('#newEventDate').value,
      amount: parseInt(form.querySelector('#newAmount').value) || 0,
      status: 'pending',
      notes: form.querySelector('#newNotes').value
    };
    orders.unshift(newOrder);
    setDB(STORAGE_KEY_ORDERS, orders);
    closeAddOrderModal();
    renderOrders();
    renderDashboard();
    showToast(`Pesanan ${newOrder.id} berhasil ditambahkan`, 'success');
    form.reset();
  }

  // ─── MENUS ───────────────────────────────────────────
  function renderMenus() {
    const grid = document.getElementById('menusGrid');
    if (!grid) return;

    grid.innerHTML = menus.map(m => `
      <div class="admin-menu-card">
        <img src="${m.image}" alt="${m.name}" class="admin-menu-img" onerror="this.src='https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80'">
        <div class="admin-menu-body">
          <div class="admin-menu-cat">${m.category}</div>
          <div class="admin-menu-name">${m.name}</div>
          <div style="font-size:0.78rem;color:var(--admin-gold);font-weight:700;margin-bottom:4px">${fmt(m.price)} <span style="color:var(--admin-text-muted);font-weight:400">/ ${m.unit}</span></div>
          <div style="font-size:0.72rem;color:var(--admin-text-dim)">Min. ${m.minPax} pax · ${statusBadge(m.status)}</div>
          <div class="admin-menu-card-actions">
            <button class="btn-admin btn-admin-outline btn-admin-sm" onclick="adminApp.toggleMenuStatus('${m.id}')">
              <i class="fa-solid ${m.status === 'active' ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
              ${m.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
            </button>
            <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="adminApp.deleteMenu('${m.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function initMenuModal() {
    document.getElementById('btnAddMenu')?.addEventListener('click', () => {
      document.getElementById('addMenuModalOverlay')?.classList.add('open');
    });
    document.getElementById('closeAddMenuModal')?.addEventListener('click', () => {
      document.getElementById('addMenuModalOverlay')?.classList.remove('open');
    });
    document.getElementById('addMenuForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const newMenu = {
        id: 'menu-' + generateId(''),
        category: form.querySelector('#menuCategory').value,
        name: form.querySelector('#menuName').value,
        price: parseInt(form.querySelector('#menuPrice').value) || 0,
        unit: form.querySelector('#menuUnit').value,
        minPax: parseInt(form.querySelector('#menuMinPax').value) || 1,
        status: 'active',
        image: form.querySelector('#menuImage').value || 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
        desc: form.querySelector('#menuDesc').value,
      };
      menus.push(newMenu);
      setDB(STORAGE_KEY_MENUS, menus);
      document.getElementById('addMenuModalOverlay')?.classList.remove('open');
      renderMenus();
      showToast('Menu berhasil ditambahkan', 'success');
      form.reset();
    });
  }

  // ─── USERS (CUSTOMERS) ───────────────────────────────
  function renderUsers() {
    users = getDB(STORAGE_KEY_USERS, []);
    const customers = users.filter(u => u.role !== 'admin');
    const tbody = document.getElementById('usersTbody');
    const countEl = document.getElementById('customerCount');
    if (countEl) countEl.textContent = customers.length;
    if (!tbody) return;

    tbody.innerHTML = customers.length === 0 ? `
      <tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--admin-text-dim);">Belum ada konsumen terdaftar</td></tr>
    ` : customers.map(u => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-mini-avatar">${initials(u.name)}</div>
            <div>
              <div class="user-cell-name">${u.name}</div>
              <div class="user-cell-email">${u.id}</div>
            </div>
          </div>
        </td>
        <td>${u.email}</td>
        <td>${u.phone || '-'}</td>
        <td>${fmtDate(u.createdAt)}</td>
        <td>${statusBadge('active')}</td>
        <td>
          <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="adminApp.deleteUser('${u.id}')">
            <i class="fa-solid fa-user-xmark"></i> Hapus
          </button>
        </td>
      </tr>
    `).join('');
  }

  // ─── SETTINGS ────────────────────────────────────────
  function renderSettings() {
    settings = getDB(STORAGE_KEY_SETTINGS, defaultSettings);
    const fields = ['siteName','tagline','heroTitle','heroSubtitle','phone','whatsapp','email','address','instagram','facebook','operasionalJam','minOrderDays','maxPaxPerDay','depositPercent','bankName','bankAccount','bankHolder'];
    fields.forEach(key => {
      const el = document.getElementById('set_' + key);
      if (el) el.value = settings[key] || '';
    });

    document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      fields.forEach(key => {
        const el = document.getElementById('set_' + key);
        if (el) settings[key] = el.value;
      });
      setDB(STORAGE_KEY_SETTINGS, settings);
      showToast('Pengaturan berhasil disimpan!', 'success');
    });
  }

  // ─── CALENDAR ────────────────────────────────────────
  function renderCalendar(year, month) {
    const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const titleEl = document.getElementById('calMonthTitle');
    if (titleEl) titleEl.textContent = `${monthNames[month]} ${year}`;

    // Get event dates from orders
    const eventDates = {};
    orders.forEach(o => {
      if (!o.eventDate) return;
      const d = new Date(o.eventDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        eventDates[day] = (eventDates[day] || 0) + 1;
      }
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const today = new Date();
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    let cells = '';

    // Prev month overflow
    for (let i = firstDay - 1; i >= 0; i--) {
      cells += `<div class="cal-day other-month">${prevMonthDays - i}</div>`;
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const evtCount = eventDates[d] || 0;
      const cls = [
        'cal-day',
        isToday ? 'today' : '',
        evtCount === 1 ? 'has-event' : '',
        evtCount > 1 ? 'has-event multi-event' : '',
      ].filter(Boolean).join(' ');
      const evtTooltip = evtCount ? `title="${evtCount} acara"` : '';
      cells += `<div class="${cls}" ${evtTooltip}>${d}${evtCount ? `<br><span style="font-size:0.55rem;color:var(--admin-gold)">${evtCount} acara</span>` : ''}</div>`;
    }

    // Next month overflow
    const remaining = 42 - firstDay - daysInMonth;
    for (let i = 1; i <= remaining; i++) {
      cells += `<div class="cal-day other-month">${i}</div>`;
    }

    grid.innerHTML = cells;

    // Nav buttons
    document.getElementById('calPrevBtn')?.addEventListener('click', () => {
      calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
      renderCalendar(calYear, calMonth);
    });
    document.getElementById('calNextBtn')?.addEventListener('click', () => {
      calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
      renderCalendar(calYear, calMonth);
    });

    // Upcoming events list
    const upcomingEl = document.getElementById('upcomingEventsList');
    if (upcomingEl) {
      const upcoming = orders
        .filter(o => o.eventDate && new Date(o.eventDate) >= new Date())
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
        .slice(0, 6);
      upcomingEl.innerHTML = upcoming.map(o => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px;background:var(--admin-surface-2);border:1px solid var(--admin-border);border-radius:10px;margin-bottom:8px">
          <div style="background:rgba(197,160,89,0.12);border:1px solid var(--admin-border-2);border-radius:8px;padding:6px 10px;text-align:center;flex-shrink:0">
            <div style="font-size:1.1rem;font-weight:800;color:var(--admin-gold)">${new Date(o.eventDate).getDate()}</div>
            <div style="font-size:0.6rem;color:var(--admin-text-muted);font-weight:700">${monthNames[new Date(o.eventDate).getMonth()].substring(0,3)}</div>
          </div>
          <div>
            <div style="font-size:0.82rem;font-weight:700;color:#f0e8d5">${o.customer}</div>
            <div style="font-size:0.72rem;color:var(--admin-text-muted)">${o.package} · ${o.pax} pax</div>
          </div>
          <div style="margin-left:auto">${statusBadge(o.status)}</div>
        </div>
      `).join('') || `<div style="text-align:center;color:var(--admin-text-dim);font-size:0.82rem;padding:1rem">Tidak ada acara mendatang</div>`;
    }
  }

  // ─── QUICK SECTION SWITCH ────────────────────────────
  window.goSection = (name) => switchSection(name);

})();
