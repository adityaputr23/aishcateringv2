// ===================================================================
// AISH CATERING - SHOPPING CART & AUTH-PROTECTED CHECKOUT SYSTEM
// Singkawang Heritage Culinary System
// ===================================================================

(function () {
  'use strict';

  const STORAGE_KEY_CART = 'aish_cart_items_v1';
  const STORAGE_KEY_SESSION = 'aish_auth_session';
  const STORAGE_KEY_ORDERS = 'aish_orders_db_v1';
  const STORAGE_KEY_REDIRECT = 'aish_redirect_after_login';

  // ─── UTILITIES ──────────────────────────────────────
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  const getSessionUser = () => {
    try {
      const l = localStorage.getItem(STORAGE_KEY_SESSION);
      if (l) return JSON.parse(l);
      const s = sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (s) return JSON.parse(s);
    } catch (_) {}
    return null;
  };

  const getCart = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CART);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  };

  const getOrders = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  };

  const saveOrders = (orders) => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  };

  // Toast notification
  const notify = (msg, icon = 'fa-check') => {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fa-solid ${icon} text-gold"></i> <span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      t.style.transition = 'all 0.3s ease';
      setTimeout(() => t.remove(), 300);
    }, 3500);
  };

  // ─── CART UI CONTROLLER ─────────────────────────────
  window.AishCart = {
    addItem(item) {
      const cart = getCart();
      const existing = cart.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name || item.title,
          price: parseInt(item.price) || 0,
          quantity: item.quantity || 1,
          unit: item.unit || 'porsi',
          image: item.image || ''
        });
      }
      saveCart(cart);
      this.render();
      notify(`"${item.name || item.title}" berhasil ditambahkan ke keranjang!`);
      this.openDrawer();
    },

    removeItem(id) {
      let cart = getCart();
      cart = cart.filter(i => i.id !== id);
      saveCart(cart);
      this.render();
      notify('Menu dihapus dari keranjang.');
    },

    updateQty(id, delta) {
      const cart = getCart();
      const item = cart.find(i => i.id === id);
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(id);
        return;
      }
      saveCart(cart);
      this.render();
    },

    clear() {
      saveCart([]);
      this.render();
      notify('Keranjang pesanan dikosongkan.');
    },

    openDrawer() {
      const drawer = document.getElementById('cartDrawer');
      const overlay = document.getElementById('cartOverlay');
      if (drawer) drawer.classList.add('active');
      if (overlay) overlay.classList.add('active');
    },

    closeDrawer() {
      const drawer = document.getElementById('cartDrawer');
      const overlay = document.getElementById('cartOverlay');
      if (drawer) drawer.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    },

    render() {
      const cart = getCart();
      const badge = document.getElementById('cartCountBadge');
      const itemsList = document.getElementById('cartItemsList');
      const emptyState = document.getElementById('cartEmptyState');
      const cartFooter = document.getElementById('cartFooter');
      const totalDisplay = document.getElementById('cartDrawerTotalPrice');

      const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
      if (badge) badge.textContent = totalCount;

      if (cart.length === 0) {
        if (emptyState) emptyState.classList.add('active');
        if (itemsList) itemsList.innerHTML = '';
        if (cartFooter) cartFooter.style.display = 'none';
        if (totalDisplay) totalDisplay.textContent = formatRupiah(0);
        return;
      }

      if (emptyState) emptyState.classList.remove('active');
      if (cartFooter) cartFooter.style.display = 'block';

      let total = 0;
      if (itemsList) {
        itemsList.innerHTML = cart.map(item => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;
          return `
            <div class="cart-item-card">
              <div class="cart-item-info">
                <span class="cart-item-name" title="${item.name}">${item.name}</span>
                <span class="cart-item-unit-price">${formatRupiah(item.price)} / ${item.unit || 'porsi'}</span>
                <span class="cart-item-subtotal">${formatRupiah(itemTotal)}</span>
              </div>
              <div class="cart-item-actions">
                <div class="cart-qty-ctrl">
                  <button type="button" class="cart-qty-btn" onclick="AishCart.updateQty('${item.id}', -1)" aria-label="Kurangi porsi">
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <span class="cart-qty-num">${item.quantity}</span>
                  <button type="button" class="cart-qty-btn" onclick="AishCart.updateQty('${item.id}', 1)" aria-label="Tambah porsi">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
                <button type="button" class="cart-item-remove-btn" onclick="AishCart.removeItem('${item.id}')" title="Hapus menu">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          `;
        }).join('');
      }

      if (totalDisplay) totalDisplay.textContent = formatRupiah(total);
    }
  };

  // ─── CHECKOUT CONTROLLER ────────────────────────────
  window.AishCheckout = {
    initiate() {
      const cart = getCart();
      if (cart.length === 0) {
        notify('Keranjang pesanan masih kosong. Silakan pilih menu terlebih dahulu!', 'fa-circle-exclamation');
        return;
      }

      const user = getSessionUser();

      // SYARAT CHECKOUT: HARUS LOGIN TERLEBIH DAHULU
      if (!user) {
        AishCart.closeDrawer();
        this.openLoginReqModal();
        return;
      }

      // SUDAH LOGIN: Buka Modal Checkout
      AishCart.closeDrawer();
      this.openCheckoutModal(user, cart);
    },

    openLoginReqModal() {
      const modal = document.getElementById('loginReqModalOverlay');
      if (modal) modal.classList.add('active');
    },

    closeLoginReqModal() {
      const modal = document.getElementById('loginReqModalOverlay');
      if (modal) modal.classList.remove('active');
    },

    goToLogin() {
      // Simpan halaman saat ini untuk redirect kembali setelah login
      localStorage.setItem(STORAGE_KEY_REDIRECT, window.location.href);
      window.location.href = 'login.html';
    },

    goToRegister() {
      localStorage.setItem(STORAGE_KEY_REDIRECT, window.location.href);
      window.location.href = 'login.html#register';
    },

    openCheckoutModal(user, cart) {
      const modal = document.getElementById('checkoutModalOverlay');
      if (!modal) return;

      // Populate user info
      const nameEl = document.getElementById('chkUserName');
      const emailEl = document.getElementById('chkUserEmail');
      const phoneEl = document.getElementById('chkUserPhone');
      const avatarEl = document.getElementById('chkUserAvatar');

      if (nameEl) nameEl.textContent = user.name || 'Konsumen Aish Catering';
      if (emailEl) emailEl.textContent = user.email || 'Email belum diisi';
      if (phoneEl) phoneEl.textContent = user.phone || '081234567890';
      if (avatarEl) {
        const parts = (user.name || 'A').split(' ');
        avatarEl.textContent = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
      }

      // Populate min date (H+3)
      const dateInput = document.getElementById('chkEventDate');
      if (dateInput) {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 3);
        dateInput.min = minDate.toISOString().split('T')[0];
        dateInput.value = minDate.toISOString().split('T')[0];
      }

      // Calculate totals & 5% VIP Discount
      let subtotal = 0;
      let totalPax = 0;
      const itemsTableBody = document.getElementById('chkItemsTableBody');
      if (itemsTableBody) {
        itemsTableBody.innerHTML = cart.map(i => {
          const itemTotal = i.price * i.quantity;
          subtotal += itemTotal;
          totalPax += i.quantity;
          return `
            <tr>
              <td><strong>${i.name}</strong></td>
              <td>${i.quantity} ${i.unit || 'porsi'}</td>
              <td style="text-align:right;">${formatRupiah(itemTotal)}</td>
            </tr>
          `;
        }).join('');
      }

      const discountRate = 0.05; // 5% VIP member discount
      const discountVal = Math.round(subtotal * discountRate);
      const grandTotal = subtotal - discountVal;
      const dpVal = Math.round(grandTotal * 0.5);

      const subtotalEl = document.getElementById('chkSubtotal');
      const discountEl = document.getElementById('chkDiscount');
      const grandTotalEl = document.getElementById('chkGrandTotal');
      const dpEl = document.getElementById('chkDpAmount');

      if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
      if (discountEl) discountEl.textContent = `- ${formatRupiah(discountVal)}`;
      if (grandTotalEl) grandTotalEl.textContent = formatRupiah(grandTotal);
      if (dpEl) dpEl.textContent = formatRupiah(dpVal);

      // Store in state for submission
      this._currentCheckoutData = {
        user,
        cart,
        subtotal,
        discountVal,
        grandTotal,
        dpVal,
        totalPax
      };

      modal.classList.add('active');
    },

    closeCheckoutModal() {
      const modal = document.getElementById('checkoutModalOverlay');
      if (modal) modal.classList.remove('active');
    },

    submitOrder(e) {
      if (e) e.preventDefault();
      const data = this._currentCheckoutData;
      if (!data) return;

      const eventDate = document.getElementById('chkEventDate')?.value;
      const eventTime = document.getElementById('chkEventTime')?.value;
      const eventAddress = document.getElementById('chkEventAddress')?.value;
      const eventNotes = document.getElementById('chkEventNotes')?.value;
      const paymentMethod = document.querySelector('input[name="chkPaymentMethod"]:checked')?.value || 'BCA Transfer';

      if (!eventDate || !eventAddress) {
        notify('Silakan lengkapi tanggal acara dan alamat lokasi pengiriman!', 'fa-circle-exclamation');
        return;
      }

      const orderYear = new Date().getFullYear();
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const orderId = `ORD-${orderYear}-${randomId}`;

      const packageSummary = data.cart.map(i => `${i.name} (${i.quantity}x)`).join(', ');

      const newOrder = {
        id: orderId,
        customer: data.user.name,
        email: data.user.email || '',
        phone: data.user.phone || '',
        package: packageSummary,
        items: data.cart,
        pax: data.totalPax,
        date: new Date().toISOString().split('T')[0],
        eventDate: eventDate,
        eventTime: eventTime,
        eventAddress: eventAddress,
        notes: eventNotes || '',
        amount: data.grandTotal,
        dpAmount: data.dpVal,
        subtotal: data.subtotal,
        discount: data.discountVal,
        status: 'pending',
        paymentMethod: paymentMethod
      };

      // Save to Orders Database (accessible by Admin Dashboard & Consumer Portal)
      const orders = getOrders();
      orders.unshift(newOrder);
      saveOrders(orders);

      // Clear Shopping Cart
      saveCart([]);
      AishCart.render();

      // Close checkout modal & open success modal
      this.closeCheckoutModal();
      this.openSuccessModal(newOrder);
    },

    openSuccessModal(order) {
      const modal = document.getElementById('orderSuccessModalOverlay');
      if (!modal) return;

      const idEl = document.getElementById('successOrderId');
      const totalEl = document.getElementById('successOrderTotal');
      const dpEl = document.getElementById('successOrderDp');
      const dateEl = document.getElementById('successOrderDate');
      const waBtn = document.getElementById('btnSuccessWhatsApp');

      if (idEl) idEl.textContent = order.id;
      if (totalEl) totalEl.textContent = formatRupiah(order.amount);
      if (dpEl) dpEl.textContent = formatRupiah(order.dpAmount);
      if (dateEl) dateEl.textContent = new Date(order.eventDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

      if (waBtn) {
        const text = `Halo Admin Aish Catering Singkawang,%0A%0ASaya telah melakukan pemesanan melalui website dengan rincian:%0A` +
          `• *No. Invoice:* ${order.id}%0A` +
          `• *Nama Pemesan:* ${order.customer}%0A` +
          `• *Tanggal Acara:* ${order.eventDate}%0A` +
          `• *Paket:* ${order.package}%0A` +
          `• *Total Tagihan:* ${formatRupiah(order.amount)}%0A` +
          `• *Uang Muka (DP 50%):* ${formatRupiah(order.dpAmount)}%0A` +
          `• *Metode Bayar:* ${order.paymentMethod}%0A%0A` +
          `Mohon bantu verifikasi jadwal dapur dan konfirmasi penerimaan DP. Terima kasih!`;
        waBtn.href = `https://wa.me/6281345552229?text=${text}`;
      }

      modal.classList.add('active');
    },

    closeSuccessModal() {
      const modal = document.getElementById('orderSuccessModalOverlay');
      if (modal) modal.classList.remove('active');
    },

    copyBankAcc(accNo) {
      navigator.clipboard.writeText(accNo).then(() => {
        notify(`Nomor rekening ${accNo} berhasil disalin!`);
      }).catch(() => {
        notify(`Nomor rekening: ${accNo}`);
      });
    }
  };

  // ─── INITIALIZATION ON DOM READY ────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Cart items from storage
    AishCart.render();

    // 2. Setup Cart Drawer listeners
    const cartTrigger = document.getElementById('cartTrigger');
    const cartClose = document.getElementById('cartDrawerClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const btnClearCart = document.getElementById('btnClearCart');
    const btnCheckout = document.getElementById('btnCheckoutWhatsApp') || document.getElementById('btnStartCheckout');

    if (cartTrigger) cartTrigger.addEventListener('click', () => AishCart.openDrawer());
    if (cartClose) cartClose.addEventListener('click', () => AishCart.closeDrawer());
    if (cartOverlay) cartOverlay.addEventListener('click', () => AishCart.closeDrawer());
    if (btnClearCart) btnClearCart.addEventListener('click', () => AishCart.clear());

    // 3. Connect Checkout Button to Auth-protected flow
    if (btnCheckout) {
      // Ubah tampilan tombol checkout menjadi lebih profesional
      btnCheckout.innerHTML = '<i class="fa-solid fa-lock" style="margin-right:6px"></i> Lanjutkan ke Checkout';
      btnCheckout.addEventListener('click', (e) => {
        e.preventDefault();
        AishCheckout.initiate();
      });
    }

    // 4. Modal Close buttons
    document.getElementById('closeLoginReqModal')?.addEventListener('click', () => AishCheckout.closeLoginReqModal());
    document.getElementById('closeCheckoutModal')?.addEventListener('click', () => AishCheckout.closeCheckoutModal());
    document.getElementById('closeOrderSuccessModal')?.addEventListener('click', () => AishCheckout.closeSuccessModal());

    // 5. Checkout Form Submit
    document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
      AishCheckout.submitOrder(e);
    });

    // 6. Payment method radio cards highlight
    document.querySelectorAll('.payment-method-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        const bcaBox = document.getElementById('bcaDetailBox');
        const mandiriBox = document.getElementById('mandiriDetailBox');
        const qrisBox = document.getElementById('qrisDetailBox');

        if (bcaBox) bcaBox.style.display = radio.value === 'BCA Transfer' ? 'block' : 'none';
        if (mandiriBox) mandiriBox.style.display = radio.value === 'Mandiri Transfer' ? 'block' : 'none';
        if (qrisBox) qrisBox.style.display = radio.value === 'QRIS' ? 'block' : 'none';
      });
    });

    // 7. Check if returning from login with redirect intent
    const pendingRedirect = localStorage.getItem(STORAGE_KEY_REDIRECT);
    const session = getSessionUser();
    if (pendingRedirect && session) {
      localStorage.removeItem(STORAGE_KEY_REDIRECT);
      // Jika keranjang ada isinya, buka langsung checkout
      if (getCart().length > 0) {
        setTimeout(() => {
          AishCheckout.initiate();
        }, 600);
      }
    }
  });

})();
