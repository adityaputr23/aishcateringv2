// ===================================================================
// CONSUMER PORTAL SCRIPT - Aish Catering Singkawang
// Logika interaktif khusus halaman menu-konsumen.html
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY_SESSION = 'aish_auth_session';
  const STORAGE_KEY_SAVED_MENU = 'aish_saved_buffet_menu';

  // 1. Cek User Session
  const getSessionUser = () => {
    const local = localStorage.getItem(STORAGE_KEY_SESSION);
    if (local) { try { return JSON.parse(local); } catch (e) { return null; } }
    const session = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (session) { try { return JSON.parse(session); } catch (e) { return null; } }
    return null;
  };

  const user = getSessionUser();

  // Update Hero dengan nama user
  const heroNameEl = document.getElementById('consumerHeroName');
  const heroEmailEl = document.getElementById('consumerHeroEmail');
  if (user) {
    if (heroNameEl) heroNameEl.textContent = user.name;
    if (heroEmailEl) heroEmailEl.textContent = user.email || user.phone || 'Pelanggan Terdaftar';
  } else {
    if (heroNameEl) heroNameEl.textContent = 'Pelanggan Terhormat';
  }

  // 2. State Racikan Menu Konsumen
  const buffetState = {
    selectedItems: new Map(), // id -> { name, category, priceExtra }
    pax: 300,
    basePricePerPax: 48000,
    vipDiscountPercent: 5 // Diskon 5% untuk member terdaftar
  };

  // Muat racikan tersimpan jika ada
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SAVED_MENU);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.items)) {
        parsed.items.forEach(item => buffetState.selectedItems.set(item.id, item));
      }
      if (parsed.pax) buffetState.pax = parsed.pax;
    }
  } catch (e) {
    console.error('Error loading saved menu', e);
  }

  // 3. Render Katalog Menu Khusus Konsumen dari CATERING_DATA
  const container = document.getElementById('consumerMenuGrid');
  const catFilterBtns = document.querySelectorAll('.consumer-cat-pill');

  const allDishes = [];
  if (typeof CATERING_DATA !== 'undefined' && CATERING_DATA.menuCategories) {
    CATERING_DATA.menuCategories.forEach(cat => {
      cat.items.forEach(item => {
        allDishes.push({
          ...item,
          catId: cat.id,
          catTitle: cat.title
        });
      });
    });
  }

  const renderDishes = (filterCat = 'all') => {
    if (!container) return;
    container.innerHTML = '';

    const filtered = filterCat === 'all' 
      ? allDishes 
      : allDishes.filter(d => d.catId === filterCat);

    filtered.forEach(dish => {
      const isSelected = buffetState.selectedItems.has(dish.id);
      const card = document.createElement('div');
      card.className = `consumer-dish-card ${isSelected ? 'selected' : ''}`;
      card.dataset.dishId = dish.id;

      card.innerHTML = `
        <div class="consumer-dish-img-box">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy">
          <span class="dish-badge-vip"><i class="fa-solid fa-star text-gold"></i> Pilihan Utama</span>
          ${dish.badge ? `<span class="dish-badge-tag">${dish.badge}</span>` : ''}
        </div>
        <div class="consumer-dish-body">
          <div class="consumer-dish-cat">${dish.catTitle}</div>
          <h3 class="consumer-dish-title">${dish.name}</h3>
          <p class="consumer-dish-desc">${dish.desc || 'Olahan bumbu rempah autentik tradisi Singkawang dengan bahan segar berkualitas.'}</p>
          <div class="consumer-dish-footer">
            <span class="consumer-dish-taste"><i class="fa-solid fa-spoon text-gold"></i> Free Food Tasting</span>
            <button class="btn-toggle-select ${isSelected ? 'selected' : ''}" data-id="${dish.id}">
              <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-plus'}"></i>
              <span>${isSelected ? 'Dipilih' : 'Tambah'}</span>
            </button>
          </div>
        </div>
      `;

      // Handle klik tombol pilih
      const btn = card.querySelector('.btn-toggle-select');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDishSelection(dish);
      });

      container.appendChild(card);
    });
  };

  // Filter Kategori
  catFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDishes(btn.dataset.target);
    });
  });

  // Toggle pilihan menu
  const toggleDishSelection = (dish) => {
    if (buffetState.selectedItems.has(dish.id)) {
      buffetState.selectedItems.delete(dish.id);
      showToast(`"${dish.name}" dihapus dari racikan.`);
    } else {
      buffetState.selectedItems.set(dish.id, {
        id: dish.id,
        name: dish.name,
        category: dish.catTitle
      });
      showToast(`"${dish.name}" ditambahkan ke racikan!`, 'success');
    }
    updateBuffetUI();
  };

  // 4. Update Ringkasan Racikan Prasmanan
  const updateBuffetUI = () => {
    // Update tombol di kartu
    document.querySelectorAll('.consumer-dish-card').forEach(card => {
      const id = card.dataset.dishId;
      const isSelected = buffetState.selectedItems.has(id);
      const btn = card.querySelector('.btn-toggle-select');
      card.classList.toggle('selected', isSelected);
      if (btn) {
        btn.classList.toggle('selected', isSelected);
        btn.innerHTML = `<i class="fa-solid ${isSelected ? 'fa-check' : 'fa-plus'}"></i> <span>${isSelected ? 'Dipilih' : 'Tambah'}</span>`;
      }
    });

    // Update Counter & List
    const countEl = document.getElementById('selectedItemsCount');
    const listEl = document.getElementById('selectedItemsChips');
    if (countEl) countEl.textContent = `${buffetState.selectedItems.size} Menu`;

    if (listEl) {
      listEl.innerHTML = '';
      if (buffetState.selectedItems.size === 0) {
        listEl.innerHTML = '<span class="empty-tray-notice">Belum ada menu yang dipilih. Klik tombol "+ Tambah" pada hidangan di bawah.</span>';
      } else {
        buffetState.selectedItems.forEach(item => {
          const chip = document.createElement('div');
          chip.className = 'tray-menu-chip';
          chip.innerHTML = `
            <span>${item.name}</span>
            <button type="button" class="remove-chip-btn" data-id="${item.id}" title="Hapus menu">&times;</button>
          `;
          chip.querySelector('.remove-chip-btn').addEventListener('click', () => {
            buffetState.selectedItems.delete(item.id);
            updateBuffetUI();
          });
          listEl.appendChild(chip);
        });
      }
    }

    // Kalkulasi Biaya
    const paxInput = document.getElementById('paxInput');
    const paxSlider = document.getElementById('paxSlider');
    const pax = parseInt(paxInput ? paxInput.value : buffetState.pax, 10) || 300;
    buffetState.pax = pax;

    // Tambahan biaya jika memilih lebih dari 7 menu standar (Rp 4.000 per menu tambahan per pax)
    const extraMenuCount = Math.max(0, buffetState.selectedItems.size - 7);
    const pricePerPaxRaw = buffetState.basePricePerPax + (extraMenuCount * 4000);
    const discountAmount = (pricePerPaxRaw * buffetState.vipDiscountPercent) / 100;
    const finalPricePerPax = pricePerPaxRaw - discountAmount;
    const grandTotal = finalPricePerPax * pax;

    // Update Angka di UI
    const pricePerPaxEl = document.getElementById('pricePerPaxDisplay');
    const discountEl = document.getElementById('discountDisplay');
    const totalEl = document.getElementById('grandTotalDisplay');

    if (pricePerPaxEl) pricePerPaxEl.textContent = `Rp ${finalPricePerPax.toLocaleString('id-ID')} / pax`;
    if (discountEl) discountEl.textContent = `Hemat Rp ${(discountAmount * pax).toLocaleString('id-ID')} (Diskon VIP 5%)`;
    if (totalEl) totalEl.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
  };

  // Slider & Input Porsi Listener
  const paxSlider = document.getElementById('paxSlider');
  const paxInput = document.getElementById('paxInput');

  if (paxSlider && paxInput) {
    paxSlider.addEventListener('input', () => {
      paxInput.value = paxSlider.value;
      updateBuffetUI();
    });
    paxInput.addEventListener('input', () => {
      paxSlider.value = paxInput.value;
      updateBuffetUI();
    });
  }

  // 5. Tombol Simpan Racikan Menu
  const btnSaveBuffet = document.getElementById('btnSaveBuffet');
  if (btnSaveBuffet) {
    btnSaveBuffet.addEventListener('click', () => {
      const itemsArray = Array.from(buffetState.selectedItems.values());
      if (itemsArray.length === 0) {
        showToast('Pilih minimal 1 menu sebelum menyimpan racikan.', 'error');
        return;
      }
      localStorage.setItem(STORAGE_KEY_SAVED_MENU, JSON.stringify({
        items: itemsArray,
        pax: buffetState.pax,
        savedAt: new Date().toISOString()
      }));
      showToast('Racikan menu berhasil disimpan di akun Anda!', 'success');
    });
  }

  // 6. Tombol Kirim Pesanan / Konsultasi ke WhatsApp
  const btnSendBuffetWA = document.getElementById('btnSendBuffetWA');
  if (btnSendBuffetWA) {
    btnSendBuffetWA.addEventListener('click', () => {
      const itemsArray = Array.from(buffetState.selectedItems.values());
      const userName = user ? user.name : 'Pelanggan Aish Catering';
      const userPhone = user ? (user.phone || '') : '';
      
      let msg = `Halo Chef & Tim Aish Catering Singkawang, saya *${userName}* (Pelanggan VIP).\n\n`;
      msg += `Saya telah meracik paket prasmanan katering melalui Portal Konsumen dengan rincian berikut:\n`;
      msg += `👥 *Jumlah Porsi*: ${buffetState.pax} Pax\n`;
      msg += `📋 *Daftar Menu Pilihan (${itemsArray.length} Hidangan)*:\n`;

      if (itemsArray.length > 0) {
        itemsArray.forEach((item, idx) => {
          msg += `   ${idx + 1}. ${item.name} (${item.category})\n`;
        });
      } else {
        msg += `   (Ingin rekomendasi menu paket lengkap dari Chef)\n`;
      }

      msg += `\nMohon informasi jadwal Food Tasting & konfirmasi penawaran resmi. Terima kasih!`;

      const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    });
  }

  // 7. Modal Jadwal Food Tasting
  const btnBookTasting = document.getElementById('btnBookTasting');
  const tastingModal = document.getElementById('tastingModalOverlay');
  const tastingClose = document.getElementById('tastingModalClose');
  const tastingForm = document.getElementById('tastingForm');

  if (btnBookTasting && tastingModal) {
    btnBookTasting.addEventListener('click', () => {
      tastingModal.classList.add('active');
    });
  }

  if (tastingClose && tastingModal) {
    tastingClose.addEventListener('click', () => {
      tastingModal.classList.remove('active');
    });
  }

  if (tastingModal) {
    tastingModal.addEventListener('click', (e) => {
      if (e.target === tastingModal) tastingModal.classList.remove('active');
    });
  }

  if (tastingForm) {
    tastingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('tastingDate').value;
      const time = document.getElementById('tastingTime').value;
      const guests = document.getElementById('tastingGuests').value;

      showToast(`Jadwal Food Tasting pada ${date} pukul ${time} berhasil diajukan! Staf kami akan segera mengonfirmasi.`, 'success');
      tastingModal.classList.remove('active');
    });
  }

  // Helper Toast Notification
  function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-bell');
    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Initial Render
  renderDishes('all');
  updateBuffetUI();
});
