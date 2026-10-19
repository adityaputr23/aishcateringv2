// ===================================================================
// AISH CATERING SINGKAWANG - INTERACTIVE LOGIC & CONTROLLERS
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // State Management
  const state = {
    cart: [],
    calc: {
      selectedPackageId: "prasmanan",
      portions: 250,
      selectedAddons: []
    },
    activeFilter: "all"
  };

  // Currency Formatter Utility
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Toast Notification System
  const showToast = (message, icon = 'fa-check') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon} text-gold"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // ===================================================================
  // 1. RENDER CATEGORY CARDS (Singkawang Heritage Culinary Specs)
  // ===================================================================
  const renderCategories = () => {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;

    container.innerHTML = CATERING_DATA.categories.map((cat) => {
      const isPaket = cat.priceUnit === 'paket';
      const formattedPrice = formatRupiah(cat.price);
      const isFeatured = !!cat.featured;

      return `
        <article class="category-card ${isFeatured ? 'featured-package-card' : ''}" data-id="${cat.id}">
          ${isFeatured ? `<div class="featured-ribbon-badge"><i class="fa-solid fa-crown text-gold"></i> <span>${cat.ribbon || 'Pilihan Favorit Singkawang'}</span></div>` : ''}
          <div class="card-image-wrap">
            <img src="${cat.image}" alt="${cat.name} Aish Catering Singkawang" loading="lazy">
            <span class="card-tag-badge">${cat.badge}</span>
            <span class="card-meta-pill"><i class="fa-solid fa-users text-gold"></i> ${cat.portion}</span>
          </div>

          <div class="category-card-body">
            <div class="category-card-meta-top">
              <span class="card-rating-chip"><i class="fa-solid fa-star text-gold"></i> ${cat.rating}</span>
              <span class="card-halal-chip"><i class="fa-solid fa-leaf text-gold"></i> 100% Halal Singkawang</span>
            </div>
            <h3 class="category-card-title">${cat.name}</h3>
            <p class="category-card-desc">${cat.description}</p>
            
            <ul class="category-features-list">
              ${cat.features.map(f => `<li><span class="laurel-bullet"><i class="fa-solid fa-leaf"></i></span><span>${f}</span></li>`).join('')}
            </ul>

            <div class="category-card-footer">
              <div class="price-meta">
                <span class="price-sub">Mulai dari</span>
                <span class="price-value">${formattedPrice} <span class="price-unit">/ ${cat.priceUnit}</span></span>
              </div>
              <button class="btn btn-primary-cta btn-select-package" data-id="${cat.id}">
                <span>${isPaket ? 'Pesan Sekarang' : 'Pilih Paket'}</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click events
    container.querySelectorAll('.btn-select-package').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pkgId = btn.dataset.id;
        const pkg = CATERING_DATA.categories.find(c => c.id === pkgId);
        if (pkg) {
          addToCart({
            id: pkg.id,
            name: pkg.name,
            price: pkg.price,
            unit: pkg.priceUnit,
            quantity: 1,
            type: 'package'
          });
          openCartDrawer();
        }
      });
    });
  };

  // ===================================================================
  // 2. RENDER SIGNATURE DISHES (Singkawang Heritage Culinary Specs)
  // ===================================================================
  const renderSignatureDishes = (filter = 'all') => {
    const container = document.getElementById('signatureContainer');
    if (!container) return;

    const filtered = filter === 'all' 
      ? CATERING_DATA.signatureMenus 
      : CATERING_DATA.signatureMenus.filter(m => m.category === filter);

    container.innerHTML = filtered.map((dish) => {
      return `
        <div class="dish-card" data-id="${dish.id}">
          <div class="dish-img-wrap">
            <img src="${dish.image}" alt="${dish.title}" loading="lazy">
            <span class="dish-badge-pill">${dish.badge}</span>
          </div>
          <div class="dish-body">
            <div class="dish-dietary-strip">
              <span class="dietary-chip"><i class="fa-solid fa-leaf text-gold"></i> Autentik Singkawang</span>
              <span class="dietary-chip"><i class="fa-solid fa-shield-halved text-gold"></i> Halal</span>
            </div>
            <h3 class="dish-title">${dish.title}</h3>
            <p class="dish-desc">${dish.description}</p>
            <div class="dish-tag-info">
              <i class="fa-solid fa-circle-check text-gold"></i>
              <span>${dish.tag}</span>
            </div>
            <div class="dish-footer-actions">
              <button class="btn-dish-detail" data-id="${dish.id}">
                <span>Lihat Detail Menu</span>
                <i class="fa-solid fa-angle-right"></i>
              </button>
              <button class="btn-dish-add" data-id="${dish.id}">
                <i class="fa-solid fa-plus"></i>
                <span>Tambah Menu</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events to detail & add buttons
    container.querySelectorAll('.btn-dish-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const dishId = btn.dataset.id;
        const dish = CATERING_DATA.signatureMenus.find(d => d.id === dishId);
        if (dish) openDishModal(dish);
      });
    });

    container.querySelectorAll('.btn-dish-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const dishId = btn.dataset.id;
        const dish = CATERING_DATA.signatureMenus.find(d => d.id === dishId);
        if (dish) {
          addToCart({
            id: dish.id,
            name: dish.title,
            price: dish.price,
            unit: 'porsi',
            quantity: 1,
            type: 'dish'
          });
          showToast(`"${dish.title}" berhasil ditambahkan ke keranjang pesanan!`);
        }
      });
    });
  };

  // Filter Buttons
  document.querySelectorAll('.menu-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.menu-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      renderSignatureDishes(state.activeFilter);
    });
  });

  // ===================================================================
  // 3. RENDER TESTIMONIALS
  // ===================================================================
  const renderTestimonials = () => {
    const container = document.getElementById('testimonialsContainer');
    if (!container) return;

    container.innerHTML = CATERING_DATA.testimonials.map((testi) => {
      const initials = testi.author.split(' ').map(n => n[0]).slice(0, 2).join('');
      return `
        <article class="testi-card">
          <div>
            <div class="testi-header">
              <div class="testi-stars">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <span class="testi-tag">${testi.tag}</span>
            </div>
            <p class="testi-quote">"${testi.quote}"</p>
          </div>
          <div class="testi-author-wrap">
            <div class="testi-avatar" style="background-color: ${testi.avatarBg}">
              ${initials}
            </div>
            <div class="testi-author-info">
              <strong class="testi-name">${testi.author}</strong>
              <span class="testi-role">${testi.role}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  };

  // ===================================================================
  // 4. INTERACTIVE BUDGET CALCULATOR
  // ===================================================================
  const initCalculator = () => {
    const packageOptionsContainer = document.getElementById('calcPackageOptions');
    const addonsContainer = document.getElementById('calcAddonsContainer');
    const portionRange = document.getElementById('portionRange');
    const portionNumber = document.getElementById('portionNumber');

    if (!packageOptionsContainer || !addonsContainer) return;

    // Render Package Radios
    packageOptionsContainer.innerHTML = CATERING_DATA.categories.map((cat) => {
      const isActive = cat.id === state.calc.selectedPackageId;
      return `
        <div class="package-radio-item ${isActive ? 'active' : ''}" data-id="${cat.id}">
          <div class="package-radio-title">${cat.name}</div>
          <div class="package-radio-price">${formatRupiah(cat.price)} / ${cat.priceUnit}</div>
        </div>
      `;
    }).join('');

    // Render Addons
    addonsContainer.innerHTML = CATERING_DATA.addOns.map((add) => {
      return `
        <label class="addon-checkbox-label">
          <div class="addon-left">
            <input type="checkbox" class="calc-addon-check" value="${add.id}">
            <span>${add.name}</span>
          </div>
          <span class="addon-price">+${formatRupiah(add.price)}</span>
        </label>
      `;
    }).join('');

    // Package Selection Event
    packageOptionsContainer.querySelectorAll('.package-radio-item').forEach(item => {
      item.addEventListener('click', () => {
        packageOptionsContainer.querySelectorAll('.package-radio-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        state.calc.selectedPackageId = item.dataset.id;

        // Auto tune slider min/max
        if (state.calc.selectedPackageId === 'tumpeng') {
          portionRange.min = '15';
          portionRange.max = '60';
          portionRange.value = '25';
        } else if (state.calc.selectedPackageId === 'snackbox') {
          portionRange.min = '30';
          portionRange.max = '500';
          portionRange.value = '100';
        } else if (state.calc.selectedPackageId === 'nasi-kotak') {
          portionRange.min = '20';
          portionRange.max = '800';
          portionRange.value = '150';
        } else {
          portionRange.min = '100';
          portionRange.max = '1500';
          portionRange.value = '300';
        }
        state.calc.portions = parseInt(portionRange.value);
        updateCalculatorSummary();
      });
    });

    // Slider Event
    portionRange.addEventListener('input', (e) => {
      state.calc.portions = parseInt(e.target.value);
      portionNumber.textContent = state.calc.portions;
      updateCalculatorSummary();
    });

    // Addons Change Event
    addonsContainer.querySelectorAll('.calc-addon-check').forEach(chk => {
      chk.addEventListener('change', () => {
        const checkedValues = Array.from(addonsContainer.querySelectorAll('.calc-addon-check:checked')).map(el => el.value);
        state.calc.selectedAddons = checkedValues;
        updateCalculatorSummary();
      });
    });

    // Send Calculator to WhatsApp
    const btnSendWA = document.getElementById('btnSendCalcToWA');
    if (btnSendWA) {
      btnSendWA.addEventListener('click', () => {
        const selectedPkg = CATERING_DATA.categories.find(c => c.id === state.calc.selectedPackageId);
        const foodSubtotal = selectedPkg.price * state.calc.portions;
        const addonsDetails = state.calc.selectedAddons.map(aid => {
          const a = CATERING_DATA.addOns.find(item => item.id === aid);
          return a ? `• ${a.name} (${formatRupiah(a.price)})` : '';
        }).filter(Boolean);

        const addonsSubtotal = state.calc.selectedAddons.reduce((sum, aid) => {
          const a = CATERING_DATA.addOns.find(item => item.id === aid);
          return sum + (a ? a.price : 0);
        }, 0);

        const grandTotal = foodSubtotal + addonsSubtotal;

        let message = `Halo Admin Aish Catering Singkawang,%0A%0ASaya ingin menanyakan ketersediaan tanggal dan rincian estimasi katering berikut:%0A%0A`;
        message += `*Paket:* ${selectedPkg.name}%0A`;
        message += `*Harga Paket:* ${formatRupiah(selectedPkg.price)} / ${selectedPkg.priceUnit}%0A`;
        message += `*Jumlah Porsi/Tamu:* ${state.calc.portions} ${selectedPkg.priceUnit}%0A`;
        message += `*Subtotal Makanan:* ${formatRupiah(foodSubtotal)}%0A`;
        
        if (addonsDetails.length > 0) {
          message += `%0A*Tambahan Stall / Layanan:*%0A${addonsDetails.join('%0A')}%0A`;
          message += `*Subtotal Tambahan:* ${formatRupiah(addonsSubtotal)}%0A`;
        }

        message += `%0A*Total Estimasi Biaya:* ${formatRupiah(grandTotal)}%0A%0A`;
        message += `Mohon info apakah ada slot tanggal tersedia dan jadwal food tester keluarga. Terima kasih!`;

        window.open(`https://wa.me/6281345678910?text=${message}`, '_blank');
      });
    }

    // Booking Button from Calc
    const btnBookFromCalc = document.getElementById('btnBookFromCalc');
    if (btnBookFromCalc) {
      btnBookFromCalc.addEventListener('click', () => {
        const pkg = CATERING_DATA.categories.find(c => c.id === state.calc.selectedPackageId);
        openBookingModal(pkg ? pkg.name : null, state.calc.portions);
      });
    }

    // Initial update
    updateCalculatorSummary();
  };

  const updateCalculatorSummary = () => {
    const selectedPkg = CATERING_DATA.categories.find(c => c.id === state.calc.selectedPackageId) || CATERING_DATA.categories[0];
    const portionNumber = document.getElementById('portionNumber');
    const summaryPackageName = document.getElementById('summaryPackageName');
    const summaryUnitPrice = document.getElementById('summaryUnitPrice');
    const summaryTotalPortions = document.getElementById('summaryTotalPortions');
    const summaryFoodSubtotal = document.getElementById('summaryFoodSubtotal');
    const summaryAddonsSubtotal = document.getElementById('summaryAddonsSubtotal');
    const summaryGrandTotal = document.getElementById('summaryGrandTotal');

    if (!summaryPackageName) return;

    portionNumber.textContent = state.calc.portions;
    summaryPackageName.textContent = selectedPkg.name;
    summaryUnitPrice.textContent = `${formatRupiah(selectedPkg.price)} / ${selectedPkg.priceUnit}`;
    summaryTotalPortions.textContent = `${state.calc.portions} ${selectedPkg.priceUnit}`;

    const foodSubtotal = selectedPkg.price * state.calc.portions;
    summaryFoodSubtotal.textContent = formatRupiah(foodSubtotal);

    const addonsSubtotal = state.calc.selectedAddons.reduce((sum, aid) => {
      const a = CATERING_DATA.addOns.find(item => item.id === aid);
      return sum + (a ? a.price : 0);
    }, 0);

    summaryAddonsSubtotal.textContent = formatRupiah(addonsSubtotal);
    summaryGrandTotal.textContent = formatRupiah(foodSubtotal + addonsSubtotal);
  };

  // ===================================================================
  // 5. EVENT BAG / CART SYSTEM
  // ===================================================================
  const addToCart = (item) => {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity || 1;
    } else {
      state.cart.push({ ...item, quantity: item.quantity || 1 });
    }
    updateCartUI();
  };

  const removeFromCart = (id) => {
    state.cart = state.cart.filter(i => i.id !== id);
    updateCartUI();
    showToast('Menu dihapus dari rencana pesanan');
  };

  const updateCartUI = () => {
    const badge = document.getElementById('cartCountBadge');
    const itemsList = document.getElementById('cartItemsList');
    const emptyState = document.getElementById('cartEmptyState');
    const cartFooter = document.getElementById('cartFooter');
    const totalDisplay = document.getElementById('cartDrawerTotalPrice');

    const totalCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
    if (badge) badge.textContent = totalCount;

    if (state.cart.length === 0) {
      if (emptyState) emptyState.classList.add('active');
      if (itemsList) itemsList.innerHTML = '';
      if (cartFooter) cartFooter.style.display = 'none';
      if (totalDisplay) totalDisplay.textContent = formatRupiah(0);
      return;
    }

    if (emptyState) emptyState.classList.remove('active');
    if (cartFooter) cartFooter.style.display = 'block';

    let grandTotal = 0;
    if (itemsList) {
      itemsList.innerHTML = state.cart.map(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;
        return `
          <div class="cart-item-card">
            <div class="cart-item-left">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-price">${formatRupiah(item.price)} x ${item.quantity} ${item.unit || ''}</span>
            </div>
            <button class="cart-item-remove" data-id="${item.id}" title="Hapus menu">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `;
      }).join('');

      itemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
      });
    }

    if (totalDisplay) totalDisplay.textContent = formatRupiah(grandTotal);
  };

  const openCartDrawer = () => {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
    }
  };

  const closeCartDrawer = () => {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
    }
  };

  window.closeCartDrawer = closeCartDrawer;

  // Cart Trigger & Close
  const cartTrigger = document.getElementById('cartTrigger');
  const cartClose = document.getElementById('cartDrawerClose');
  const cartOverlay = document.getElementById('cartOverlay');
  const btnClearCart = document.getElementById('btnClearCart');
  const btnCheckoutWA = document.getElementById('btnCheckoutWhatsApp');

  if (cartTrigger) cartTrigger.addEventListener('click', openCartDrawer);
  if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      state.cart = [];
      updateCartUI();
      showToast('Keranjang pesanan telah dikosongkan.');
    });
  }

  if (btnCheckoutWA) {
    btnCheckoutWA.addEventListener('click', () => {
      if (state.cart.length === 0) return;
      
      let total = 0;
      let text = `Halo Admin Aish Catering Singkawang,%0A%0ASaya ingin menanyakan ketersediaan tanggal dan melakukan reservasi paket berikut:%0A%0A`;
      
      state.cart.forEach((item, idx) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        text += `${idx + 1}. *${item.name}* (${item.quantity} ${item.unit || 'porsi'}) - ${formatRupiah(itemTotal)}%0A`;
      });

      text += `%0A*Perkiraan Subtotal:* ${formatRupiah(total)}%0A%0A`;
      text += `Mohon bantu konfirmasi jadwal kosong dan formulir penawaran resminya. Terima kasih!`;

      window.open(`https://wa.me/6281345678910?text=${text}`, '_blank');
    });
  }

  // ===================================================================
  // 6. BOOKING & CONSULTATION MODAL
  // ===================================================================
  const bookingModal = document.getElementById('bookingModalOverlay');
  const bookingClose = document.getElementById('bookingModalClose');
  const bookingForm = document.getElementById('bookingForm');

  const openBookingModal = (preferredPackage = null, preferredPortions = null) => {
    if (bookingModal) {
      bookingModal.classList.add('active');
      if (preferredPackage) {
        const select = document.getElementById('packagePref');
        if (select) {
          Array.from(select.options).forEach(opt => {
            if (opt.text.toLowerCase().includes(preferredPackage.toLowerCase())) {
              opt.selected = true;
            }
          });
        }
      }
      if (preferredPortions) {
        const inputPortion = document.getElementById('eventPortion');
        if (inputPortion) inputPortion.value = preferredPortions;
      }
    }
  };

  const closeBookingModal = () => {
    if (bookingModal) bookingModal.classList.remove('active');
  };

  if (bookingClose) bookingClose.addEventListener('click', closeBookingModal);
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
  }

  // Trigger buttons for booking
  const triggerIds = ['headerBookingBtn', 'drawerBookingBtn', 'heroConsultBtn', 'ctaBookingBtn'];
  triggerIds.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => openBookingModal());
  });

  // Handle Form Submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const eventType = document.getElementById('eventType').value;
      const date = document.getElementById('eventDate').value;
      const portions = document.getElementById('eventPortion').value;
      const pkg = document.getElementById('packagePref').value;
      const location = document.getElementById('eventLocation').value.trim() || '-';
      const notes = document.getElementById('eventNotes').value.trim() || '-';

      let message = `*FORMULIR RESERVASI & KONSULTASI ACARA*%0A`;
      message += `---------------------------------------%0A`;
      message += `• *Nama Klien:* ${name}%0A`;
      message += `• *No. WhatsApp:* ${phone}%0A`;
      message += `• *Jenis Acara:* ${eventType}%0A`;
      message += `• *Tanggal Acara:* ${date}%0A`;
      message += `• *Perkiraan Porsi:* ${portions} Orang / Tamu%0A`;
      message += `• *Paket Pilihan:* ${pkg}%0A`;
      message += `• *Lokasi Acara:* ${location}%0A`;
      message += `• *Catatan / Menu Spesial:* ${notes}%0A`;
      message += `---------------------------------------%0A`;
      message += `Halo Tim Aish Catering Singkawang, mohon segera hubungi saya untuk follow-up dan jadwal food tester. Terima kasih!`;

      showToast(`Pemesanan terkirim! Mengarahkan ke WhatsApp Admin...`);
      closeBookingModal();
      bookingForm.reset();

      setTimeout(() => {
        window.open(`https://wa.me/6281345678910?text=${message}`, '_blank');
      }, 800);
    });
  }

  // ===================================================================
  // 7. DISH DETAIL MODAL
  // ===================================================================
  const dishModal = document.getElementById('dishModalOverlay');
  const dishClose = document.getElementById('dishModalClose');
  const dishContent = document.getElementById('dishModalContent');

  const openDishModal = (dish) => {
    if (!dishModal || !dishContent) return;

    dishContent.innerHTML = `
      <div style="position:relative; height: 260px; overflow:hidden;">
        <img src="${dish.image}" alt="${dish.title}" style="width:100%; height:100%; object-fit:cover;">
        <span style="position:absolute; top:16px; left:16px; background:#0c2a20; color:#cba358; padding:5px 14px; border-radius:999px; font-size:0.75rem; font-weight:700;">
          ${dish.badge}
        </span>
      </div>
      <div style="padding: 26px;">
        <span style="font-size:0.75rem; color:#cba358; font-weight:700; letter-spacing:1px; text-transform:uppercase;">${dish.tag}</span>
        <h3 style="font-family:var(--font-serif); font-size: 1.8rem; color:#0c2a20; margin-top:4px; margin-bottom:12px;">${dish.title}</h3>
        <p style="font-size:0.92rem; color:#57645c; line-height:1.6; margin-bottom:18px;">${dish.description}</p>
        
        <div style="background:#f7f4ec; padding:16px; border-radius:12px; margin-bottom:20px;">
          <h4 style="font-size:0.85rem; font-weight:700; color:#0c2a20; margin-bottom:8px;">Komposisi Bahan & Bumbu:</h4>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${dish.composition.map(c => `<span style="background:#ffffff; border:1px solid #e9e4d8; padding:4px 10px; border-radius:6px; font-size:0.78rem; color:#18221c;">${c}</span>`).join('')}
          </div>
          <div style="margin-top:12px; font-size:0.82rem; color:#57645c;">
            <strong>Profil Rasa:</strong> ${dish.spiciness}<br>
            <strong>Rekomendasi Acara:</strong> ${dish.bestFor}
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
          <div>
            <span style="font-size:0.75rem; color:#57645c;">Estimasi Harga Porsi</span>
            <div style="font-family:var(--font-serif); font-size:1.5rem; font-weight:700; color:#0c2a20;">${formatRupiah(dish.price)}</div>
          </div>
          <button class="btn btn-gold" id="btnModalAddDish">
            <i class="fa-solid fa-basket-shopping"></i> Tambahkan ke Rencana Acara
          </button>
        </div>
      </div>
    `;

    const btnAdd = dishContent.querySelector('#btnModalAddDish');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        addToCart({
          id: dish.id,
          name: dish.title,
          price: dish.price,
          unit: 'porsi',
          quantity: 1,
          type: 'dish'
        });
        dishModal.classList.remove('active');
        showToast(`"${dish.title}" ditambahkan ke keranjang pesanan!`);
      });
    }

    dishModal.classList.add('active');
  };

  if (dishClose) dishClose.addEventListener('click', () => dishModal.classList.remove('active'));
  if (dishModal) {
    dishModal.addEventListener('click', (e) => {
      if (e.target === dishModal) dishModal.classList.remove('active');
    });
  }

  // ===================================================================
  // 8. MENU CATALOG MODAL
  // ===================================================================
  const catalogModal = document.getElementById('catalogModalOverlay');
  const catalogClose = document.getElementById('catalogModalClose');
  const btnOpenCatalog = document.getElementById('btnOpenMenuCatalog');
  const btnDownloadMockPDF = document.getElementById('btnDownloadMockPDF');

  if (btnOpenCatalog) {
    btnOpenCatalog.addEventListener('click', () => {
      if (catalogModal) catalogModal.classList.add('active');
    });
  }

  if (catalogClose) catalogClose.addEventListener('click', () => catalogModal.classList.remove('active'));
  if (catalogModal) {
    catalogModal.addEventListener('click', (e) => {
      if (e.target === catalogModal) catalogModal.classList.remove('active');
    });
  }

  if (btnDownloadMockPDF) {
    btnDownloadMockPDF.addEventListener('click', () => {
      showToast('Mengunduh Brosur Digital Aish Catering 2026...', 'fa-file-pdf');
      
      // Generate readable text catalogue file download
      const catalogueContent = `========================================================
KATALOG & BUKU MENU RESMI AISH CATERING SINGKAWANG 2026
Tradisi Kuliner Otentik Singkawang Halal, Higienis & Elegan
Alamat: Jl. Pasiran No. 45, Singkawang Barat | Telp: 0813-4567-8910
========================================================

PAKET PRASMANAN PERNIKAHAN & RESEPSI
1. Paket Silver (Rp 48.000 / porsi) - Min. 100 porsi
   - Nasi Putih / Nasi Gurih Pandan
   - Sapo Tahu Seafood Segar
   - Ayam Goreng Serundeng Lengkuas
   - Sup Bakso Ikan Tenggiri Tradisional
   - Capcay Jamur Singkawang
   - Puding Buah Cocktail & Es Doger
   - Fasilitas: Meja buffet, taplak elegan, sendok garpu, 2 pramusaji

2. Paket Gold (Rp 58.000 / porsi) - Min. 250 porsi
   - Nasi Gurih Bunga Telang / Nasi Kebuli
   - Gurame Asam Manis Nanas Pasir Pontian
   - Daging Sapi Lada Hitam Empuk
   - Ayam Panggang Bumbu Madu
   - Sapo Tahu Seafood Komplit
   - Sup Kimlo Jamur Salju
   - Aneka Dessert & Es Podeng
   - Fasilitas: Dekorasi meja bunga segar, pemanas roll top gold, pramusaji berseragam

3. Paket Royal Platinum (Rp 72.000 / porsi) - Min. 500 porsi
   - Menu lengkap 12 varian tradisi Singkawang & Nusantara
   - Bonus 2 Live Cooking Stall (Choipan Kukus & Kambing Guling)
   - Free Family Food Tester (6 orang) & dekorasi VIP tamu kehormatan

PAKET NASI KOTAK & BENTO PREMIUM
- Nasi Kotak Eksekutif: Rp 28.000 / box (Min. 25 box)
- Nasi Campur Halal Singkawang: Rp 38.000 / box (Min. 20 box)
- Tumpeng Adat Megah Singkawang: Rp 450.000 / paket (25 porsi)
- Coffee Break Snack Box: Rp 17.500 / box (3 kue khas + mineral)

HUBUNGI RESERVASI & JADWAL TESTER:
WhatsApp: 0813-4567-8910 (Fast Response)
Email: info@aishcateringsingkawang.com
========================================================`;

      const blob = new Blob([catalogueContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Buku-Menu-Aish-Catering-Singkawang-2026.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // ===================================================================
  // 9. DATE AVAILABILITY CHECKER
  // ===================================================================
  const dateModal = document.getElementById('dateModalOverlay');
  const dateClose = document.getElementById('dateModalClose');
  const btnDateTrigger = document.getElementById('btnCheckAvailabilityLink');
  const btnRunCheck = document.getElementById('btnRunDateCheck');
  const dateInput = document.getElementById('checkDateInput');
  const dateResult = document.getElementById('dateCheckResult');

  if (btnDateTrigger) {
    btnDateTrigger.addEventListener('click', () => {
      if (dateModal) dateModal.classList.add('active');
    });
  }

  if (dateClose) dateClose.addEventListener('click', () => dateModal.classList.remove('active'));
  if (dateModal) {
    dateModal.addEventListener('click', (e) => {
      if (e.target === dateModal) dateModal.classList.remove('active');
    });
  }

  if (btnRunCheck) {
    btnRunCheck.addEventListener('click', () => {
      const selectedDate = dateInput.value;
      if (!selectedDate) {
        showToast('Silakan pilih tanggal acara terlebih dahulu.', 'fa-circle-exclamation');
        return;
      }

      const parsedDate = new Date(selectedDate);
      const dateFormatted = parsedDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      dateResult.style.display = 'block';
      dateResult.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
          <i class="fa-solid fa-circle-check text-green" style="font-size:1.4rem;"></i>
          <strong style="color:#0c2a20; font-size:1rem;">SLOT TERSEDIA UNTUK ACARA ANDA!</strong>
        </div>
        <p style="color:#57645c; font-size:0.86rem; margin-bottom:12px;">
          Kapasitas dapur dan staf pramusaji untuk tanggal <strong>${dateFormatted}</strong> masih tersedia (tersisa 2 kuota tim resepsi).
        </p>
        <button class="btn btn-gold w-100" id="btnBookSlotNow">
          <i class="fa-solid fa-calendar-check"></i> Kunci Tanggal & Booking Sekarang
        </button>
      `;

      const btnBookSlot = dateResult.querySelector('#btnBookSlotNow');
      if (btnBookSlot) {
        btnBookSlot.addEventListener('click', () => {
          dateModal.classList.remove('active');
          openBookingModal(null, 250);
          const evDateInput = document.getElementById('eventDate');
          if (evDateInput) evDateInput.value = selectedDate;
        });
      }
    });
  }

  // ===================================================================
  // 10. MOBILE NAV DRAWER
  // ===================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  const openMobileNav = () => {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    if (mobileToggle) mobileToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    if (mobileToggle) mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('active');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileNav);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // ===================================================================
  // 11. SCROLL NAVBAR STYLE & ACTIVE SPY
  // ===================================================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 8px 24px rgba(18, 40, 29, 0.08)';
      header.style.paddingTop = '10px';
      header.style.paddingBottom = '10px';
    } else {
      header.style.boxShadow = '0 4px 20px rgba(18, 40, 29, 0.05)';
      header.style.paddingTop = '14px';
      header.style.paddingBottom = '14px';
    }
  });

  const topTastingLink = document.getElementById('topTastingLink');
  if (topTastingLink) {
    topTastingLink.addEventListener('click', (e) => {
      e.preventDefault();
      const dateModalOverlay = document.getElementById('dateModalOverlay');
      if (dateModalOverlay) {
        dateModalOverlay.classList.add('active');
      } else {
        window.open('https://wa.me/6281234567890?text=Halo%20Aish%20Catering,%20saya%20ingin%20jadwalkan%20food%20tasting', '_blank');
      }
    });
  }

  // Global ESC Key Listener to Close All Modals & Drawers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      closeCartDrawer();
      closeMobileNav();
    }
  });

  // Global Outside Click to Close All Modals
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // Global Helpers for Halal and Legal modals
  window.openHalalModal = () => {
    showToast('Aish Catering memegang sertifikasi Halal MUI No. 14160000xxxxx dan Dinkes Laik Higiene.', 'fa-certificate');
  };

  window.openTermsModal = (e) => {
    e.preventDefault();
    showToast('Ketentuan pemesanan: DP 30% untuk booking tanggal, pelunasan H-3 acara.', 'fa-file-lines');
  };

  window.openPrivacyModal = (e) => {
    e.preventDefault();
    showToast('Data kontak Anda aman dan hanya digunakan untuk konsultasi jadwal katering.', 'fa-user-shield');
  };

  // ===================================================================
  // 12. RENDER MENU PAGE (5 KATEGORI MENU KHAS SINGKAWANG)
  // ===================================================================
  const renderMenuPage = () => {
    const container = document.getElementById('menuSectionsContainer');
    if (!container || !CATERING_DATA.menuCategories) return;

    container.innerHTML = CATERING_DATA.menuCategories.map((cat) => {
      const is4Col = cat.items.length === 4;
      return `
        <section class="section menu-category-section" id="${cat.id}">
          <div class="container">
            <div class="cat-section-header">
              <span class="cat-section-badge">
                <i class="fa-solid fa-utensils text-gold"></i> ${cat.number}
              </span>
              <h2 class="cat-section-title">${cat.title}</h2>
              <p class="cat-section-desc">${cat.desc}</p>
            </div>

            <div class="menu-items-grid ${is4Col ? 'grid-4-cols' : 'grid-3-cols'}">
              ${cat.items.map(item => `
                <article class="menu-dish-card" data-id="${item.id}">
                  <div class="menu-dish-img-wrap">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <span class="menu-dish-badge">${item.badge}</span>
                  </div>
                  <div class="menu-dish-body">
                    <h3 class="menu-dish-title">${item.title}</h3>
                    <p class="menu-dish-desc">${item.desc}</p>
                    <div class="menu-dish-tags">
                      ${item.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
                    </div>
                    <div class="menu-dish-footer">
                      <div class="menu-dish-price">
                        <strong>${formatRupiah(item.price)}</strong>
                        <small>/ ${item.unit}</small>
                      </div>
                      <button class="btn btn-sm btn-gold btn-add-menu-dish" data-id="${item.id}" data-cat="${cat.id}">
                        <i class="fa-solid fa-plus"></i> Pesan
                      </button>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          </div>
        </section>
        <div class="heritage-divider" aria-hidden="true">
          <div class="divider-line"></div>
          <div class="leaf-trio-accent">
            <i class="fa-solid fa-leaf" style="transform: scaleX(-1);"></i>
            <i class="fa-solid fa-crown"></i>
            <i class="fa-solid fa-leaf"></i>
          </div>
          <div class="divider-line"></div>
        </div>
      `;
    }).join('');

    // Attach click events to buttons
    container.querySelectorAll('.btn-add-menu-dish').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.id;
        const catId = btn.dataset.cat;
        const category = CATERING_DATA.menuCategories.find(c => c.id === catId);
        const item = category ? category.items.find(i => i.id === itemId) : null;
        if (item) {
          addToCart({
            id: item.id,
            name: item.title,
            price: item.price,
            unit: item.unit,
            quantity: 1,
            type: 'menu-item'
          });
          showToast(`"${item.title}" ditambahkan ke keranjang pesanan!`);
        }
      });
    });

    // Horizontal category filter pills
    const navPills = document.querySelectorAll('.cat-nav-pill');
    navPills.forEach(pill => {
      pill.addEventListener('click', () => {
        navPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const target = pill.dataset.target;
        const sections = document.querySelectorAll('.menu-category-section');
        const dividers = document.querySelectorAll('.menu-sections-wrapper .heritage-divider');

        if (target === 'all') {
          sections.forEach(s => s.style.display = 'block');
          dividers.forEach(d => d.style.display = 'flex');
        } else {
          sections.forEach(s => {
            if (s.id === target) {
              s.style.display = 'block';
              s.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              s.style.display = 'none';
            }
          });
          dividers.forEach(d => d.style.display = 'none');
        }
      });
    });

    // Custom Menu Booking & PDF Download
    const btnCustomBooking = document.getElementById('btnCustomMenuBooking');
    if (btnCustomBooking) {
      btnCustomBooking.addEventListener('click', () => {
        openBookingModal('Menu Kustom Singkawang', 300);
      });
    }

    const btnDownloadPDF = document.getElementById('btnDownloadPricelistPDF');
    if (btnDownloadPDF) {
      btnDownloadPDF.addEventListener('click', () => {
        showToast('Mengunduh Pricelist 5 Kategori Menu Singkawang 2026...', 'fa-file-pdf');
        const text = `========================================================
PRICELIST & DAFTAR 5 KATEGORI MENU KHAS SINGKAWANG 2026
Aish Catering Singkawang - 100% Halal Certified LPPOM MUI
Alamat: Jl. Pasiran No. 45 Singkawang Barat | WA: 0813-4567-8910
========================================================

KATEGORI 01: HIDANGAN PEMBUKA & CEMILAN LEGENDARIS
1. Choipan Kukus Kulit Tipis: Rp 18.000 / porsi (5 pcs)
2. Rujak Juhi Khas Singkawang: Rp 25.000 / porsi
3. Tahu Bakso Ikan Tenggiri Pasiran: Rp 22.000 / porsi (4 pcs)

KATEGORI 02: HIDANGAN BERKUAH HANGAT & SUP BANGSAWAN
1. Sup Bakso Ikan Khas Singkawang: Rp 28.000 / porsi
2. Sup Kimlo Pengantin Singkawang: Rp 32.000 / porsi
3. Burung Asam Kakap Merah Segar: Rp 38.000 / porsi

KATEGORI 03: HIDANGAN DAGING & UNGGAS REMPAH PUSAKA
1. Ayam Masak Angkak: Rp 35.000 / porsi
2. Dendeng Rempah Borneo: Rp 42.000 / porsi
3. Sapi Lada Hitam Pasiran: Rp 45.000 / porsi
4. Ayam Bakar Bumbu Rujak: Rp 34.000 / porsi

KATEGORI 04: OLAHAN IKAN & HASIL LAUT PESISIR PASIR PANJANG
1. Gurame Terbang Sambal Mangga Pasir Panjang: Rp 48.000 / porsi
2. Udang Windu Saus Tiram Asli Muara: Rp 52.000 / porsi
3. Cumi Bakar Madu Pedas Gurih: Rp 46.000 / porsi

KATEGORI 05: MINUMAN PENYEGAR TRADISIONAL & KUE PENUTUP
1. Es Sonkit Jeruk Singkawang: Rp 15.000 / porsi
2. Kembang Tahu Air Jahe Gula Merah: Rp 16.000 / porsi
3. Es Borobudur Asli Singkawang: Rp 18.000 / porsi
4. Bingka Basah Beras Pandan: Rp 20.000 / porsi (3 potong)

Untuk konsultasi & tester keluarga:
WhatsApp: 0813-4567-8910 (Admin Fast Respon)
========================================================`;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Pricelist-Menu-Aish-Catering-Singkawang.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  };

  window.openDeliveryModal = (e) => {
    e.preventDefault();
    showToast('Gratis ongkir untuk seluruh area Kota Singkawang! Melayani Sambas & Bengkayang.', 'fa-truck-fast');
  };

  // Run initial renders
  renderCategories();
  renderSignatureDishes();
  renderTestimonials();
  initCalculator();
  updateCartUI();
  renderMenuPage();
});
