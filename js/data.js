// ===================================================================
// DATA RESMI AISH CATERING SINGKAWANG (HERITAGE CULINARY SYSTEM)
// ===================================================================

const CATERING_DATA = {
  // Paket Utama
  categories: [
    {
      id: "prasmanan",
      name: "Prasmanan Pernikahan & Resepsi Adat",
      badge: "Paling Diminati",
      ribbon: "Pilihan Favorit Singkawang",
      featured: true,
      rating: "Bintang 4.9",
      portion: "Porsi 100 - 1500 Pax",
      price: 48000,
      priceUnit: "porsi",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80",
      description: "Paket prasmanan pesta pernikahan & jamuan agung terlengkap dengan dekorasi meja buffet mewah, perlengkapan makan lengkap, dan pelayanan staf pramusaji profesional terlatih.",
      features: [
        "Pilihan 8-14 menu utama & dessert",
        "Live cooking stall & dessert corner",
        "Dekorasi meja prasmanan elegan",
        "Gratis tester & konsultasi keluarga"
      ],
      menuSample: ["Nasi Gurih Pandan", "Sapo Tahu Seafood Segar", "Ayam Serundeng Lengkuas", "Gurame Asam Manis Nanas", "Sop Iga Sapi Rempah", "Puding Buah Segar", "Es Cendol Singkawang"]
    },
    {
      id: "nasi-kotak",
      name: "Nasi Kotak & Bento Box Premium",
      badge: "Praktis & Eksklusif",
      rating: "Bintang 4.8",
      portion: "Porsi Min. 20 Pax",
      price: 28000,
      priceUnit: "box",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
      description: "Solusi praktis dan berkelas untuk jamuan rapat kantor, seminar, hingga acara syukuran keluarga. Kemasan eco-friendly higienis dengan cita rasa istimewa.",
      features: [
        "Nasi Pulen Wangi Pandan / Nasi Gurih Kuning",
        "4-5 Lauk pendamping komplit & higienis",
        "Kemasan box tebal & cutlery set ramah lingkungan",
        "Pengantaran tepat waktu dengan thermal box"
      ],
      menuSample: ["Nasi Kuning Harum", "Ayam Bakar Bumbu Rujak", "Sambal Goreng Ati Kentang", "Telur Balado", "Kering Tempe Teri", "Lalapan & Kerupuk Udang"]
    },
    {
      id: "tumpeng",
      name: "Tumpeng Adat & Syukuran Megah",
      badge: "Tradisi & Syukuran",
      rating: "Bintang 5.0",
      portion: "Porsi 15 - 50 Pax",
      price: 450000,
      priceUnit: "paket",
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80",
      description: "Karya seni tumpeng kuning komplit dengan garnish ukiran sayur artistik. Simbol keberkahan untuk launching usaha, ulang tahun, dan peresmian kantor.",
      features: [
        "Beras pulen aromatik kunyit alami Singkawang",
        "7 Macam lauk komplit tradisi Nusantara",
        "Hiasan ukiran sayur & buah bertema acara",
        "Tampah bambu anyam anyar & pisau tumpeng"
      ],
      menuSample: ["Tumpeng Kuning Kerucut/Tingkat", "Ayam Goreng Kremes", "Urap Sayur Singkawang", "Perkedel Kentang Daging", "Telur Pindang Cokelat", "Sambal Bajak Istimewa"]
    },
    {
      id: "snackbox",
      name: "Coffee Break & Snack Box Otentik",
      badge: "Kue Khas Singkawang",
      rating: "Bintang 4.9",
      portion: "Porsi Min. 30 Pax",
      price: 17500,
      priceUnit: "paket 3 kue",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
      description: "Menghadirkan aneka kue basah tradisional Singkawang dan kudapan modern untuk melengkapi rehat pertemuan Anda dengan teh dan kopi hangat.",
      features: [
        "Choipan otentik kukus segar pagi hari",
        "Pilihan Lapis Legit, Pastel Basah & Risoles Mayo",
        "Dilengkapi teh tubruk melati & kopi Singkawang",
        "Kemasan personal box eksklusif berlabel nama acara"
      ],
      menuSample: ["Choipan Bengkuang Ebi", "Kue Lapis Singkawang", "Pastel Ayam Ragout", "Lemper Ayam Bakar", "Air Mineral & Tisu Higienis"]
    }
  ],

  // Kategori Menu Warisan Kuliner Singkawang (Sesuai Desain Halaman Menu)
  menuCategories: [
    {
      id: "kat-01",
      number: "KATEGORI 01",
      title: "Hidangan Pembuka & Cemilan Legendaris",
      desc: "Awali jamuan Anda dengan kelezatan kudapan tradisional khas Singkawang, renyah berpadu gurih segar dengan cocolan saus cabai bawang merah khas pesisir.",
      items: [
        {
          id: "choipan-kukus",
          title: "Choipan Kukus Kulit Tipis",
          badge: "KUDAPAN POPULER",
          image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
          desc: "Kulit beras transparan lembut berisi rebung / bengkuang gurih, ebi wangi, ditaburi bawang putih goreng garing melimpah dan cocolan cabai cuka pedas asam segar.",
          tags: ["Isian Bengkuang, Rebung, Kucai", "Minyak Bawang Garing"],
          price: 18000,
          unit: "porsi (5 pcs)"
        },
        {
          id: "rujak-juhi",
          title: "Rujak Juhi Khas Singkawang",
          badge: "SEGAR & GURIH",
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
          desc: "Irisan juhi panggang gurih empuk dipadu irisan mentimun segar, mi kuning kenyal, kentang rebus, emping renyah, dan siraman saus kacang pedas manis asam yang harum.",
          tags: ["Juhi Panggang Gurih", "Rujak Khas Tradisional"],
          price: 25000,
          unit: "porsi"
        },
        {
          id: "tahu-bakso-ikan",
          title: "Tahu Bakso Ikan Tenggiri Pasiran",
          badge: "100% TENGGIRI MURNI",
          image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80",
          desc: "Tahu pong lembut berisi adonan bakso ikan tenggiri perairan Singkawang yang padat kenyal gurih, disajikan dengan cocolan sambal kecap cabai rawit pedas.",
          tags: ["Ikan Tenggiri Pasiran", "Pilihan Sambal Kecap"],
          price: 22000,
          unit: "porsi (4 pcs)"
        }
      ]
    },
    {
      id: "kat-02",
      number: "KATEGORI 02",
      title: "Hidangan Berkuah Hangat & Sup Bangsawan",
      desc: "Kuah bening yang diolah dari perlahan mendidihkan sumsum dan rempah aromatik, mengembalikan kesegaran tubuh, hangat, kaya rasa dan penuh sari kelezatan.",
      items: [
        {
          id: "sup-bakso-ikan",
          title: "Sup Bakso Ikan Khas Singkawang",
          badge: "KUAH BENING SEGAR",
          image: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=800&q=80",
          desc: "Bakso kenyal murni buatan sendiri dari ikan tenggiri segar pesisir Singkawang dalam kuah kaldu ikan bening gurih bertabur daun seledri, minyak bawang putih, dan tongcai.",
          tags: ["Tenggiri Asli 100%", "Bawang Goreng Gurih, Kaldu Bening"],
          price: 28000,
          unit: "porsi"
        },
        {
          id: "sup-kimlo",
          title: "Sup Kimlo Pengantin Singkawang",
          badge: "SUP RESEPSI ADAT",
          image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80",
          desc: "Sup resepsi pernikahan mewah legendaris khas pesisir Singkawang dengan suwiran ayam kampung, telur puyuh, jamur kuping, bunga sedap malam kering, dan sohun lembut kaldu harum.",
          tags: ["Ayam Kampung, Jamur Kuping", "Sedap Malam Tradisional"],
          price: 32000,
          unit: "porsi"
        },
        {
          id: "burung-asam-kakap",
          title: "Burung Asam Kakap Merah Segar",
          badge: "KAYA REMPAH ASAM SEGAR",
          image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
          desc: "Fillet kakap merah segar diolah dengan kuah asam pedas rempah Singkawang nan menyegarkan dengan potongan nanas, belimbing wuluh, serai, daun jeruk, dan tomat ceri.",
          tags: ["Kakap Merah Segar", "Rempah Asam Tradisional"],
          price: 38000,
          unit: "porsi"
        }
      ]
    },
    {
      id: "kat-03",
      number: "KATEGORI 03",
      title: "Hidangan Daging & Unggas Rempah Pusaka",
      desc: "Perpaduan kelezatan bumbu marinasi fermentasi alami, rempah kuno gurih hingga daging empuk lembut yang digoreng garing di luar dan lembut juicy di dalam.",
      items: [
        {
          id: "ayam-angkak",
          title: "Ayam Masak Angkak",
          badge: "FERMENTASI REMPAH",
          image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
          desc: "Olahan ayam masak bumbu beras merah angkak alami beraroma harum manis gurih khas Singkawang, kaya khasiat dan warna merah menggoda selera.",
          tags: ["Ayam Kampung Pilihan", "Bumbu Beras Merah Angkak"],
          price: 35000,
          unit: "porsi"
        },
        {
          id: "dendeng-borneo",
          title: "Dendeng Rempah Borneo",
          badge: "GURIH & LEGIT",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
          desc: "Potongan daging sapi pilihan berbalut bumbu rempah ketumbar dan gula aren legit Singkawang, dimasak empuk lalu dipanggang wangi bertabur serundeng gurih.",
          tags: ["Daging Sapi Pilihan", "Rempah Tradisi Borneo"],
          price: 42000,
          unit: "porsi"
        },
        {
          id: "sapi-lada-hitam",
          title: "Sapi Lada Hitam Pasiran",
          badge: "AROMATIK & HANGAT",
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
          desc: "Daging sapi tenderloin empuk ditumis dengan racikan lada hitam biji sangrai khas Singkawang, paprika, bawang bombay, dan saus tiram gurih manis kental.",
          tags: ["Daging Sapi Tenderloin", "Lada Hitam Singkawang"],
          price: 45000,
          unit: "porsi"
        },
        {
          id: "ayam-bakar-rujak",
          title: "Ayam Bakar Bumbu Rujak",
          badge: "PEDAS MANIS GURIH",
          image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
          desc: "Ayam bumbu rempah santan kental bakar arang batok kelapa berpadu cabai merah, gula aren, dan rempah harum yang meresap hingga ke serat terdalam.",
          tags: ["Ayam Bakar Arang", "Bumbu Rujak Tradisi"],
          price: 34000,
          unit: "porsi"
        }
      ]
    },
    {
      id: "kat-04",
      number: "KATEGORI 04",
      title: "Olahan Ikan & Hasil Laut Pesisir Pasir Panjang",
      desc: "Kekayaan hasil laut Selat Karimata dan pesisir Singkawang diolah secara higienis dan lengkap dalam sajian bumbu istimewa, memanjakan lidah tamu Anda.",
      items: [
        {
          id: "gurame-mangga",
          title: "Gurame Terbang Sambal Mangga Pasir Panjang",
          badge: "RENYAH & SEGAR",
          image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
          desc: "Ikan gurame fillet segar digoreng terbang super krispi disajikan dengan topping sambal mangga muda asam pedas segar khas pesisir pantai Pasir Panjang Singkawang.",
          tags: ["Gurame Segar Pasir Panjang", "Sambal Mangga Segar"],
          price: 48000,
          unit: "porsi"
        },
        {
          id: "udang-saus-tiram",
          title: "Udang Windu Saus Tiram Asli Muara",
          badge: "SEAFOOD SPESIAL",
          image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
          desc: "Udang windu jumbo hasil tambak muara Singkawang dimasak dengan saus tiram alami bertabur irisan jahe muda, daun bawang, dan minyak wijen aromatik khas pesisir.",
          tags: ["Udang Windu Segar Pasir", "Saus Tiram Asli"],
          price: 52000,
          unit: "porsi"
        },
        {
          id: "cumi-bakar-madu",
          title: "Cumi Bakar Madu Pedas Gurih",
          badge: "BEST SELLER SEAFOOD",
          image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80",
          desc: "Cumi bakar segar perairan Singkawang dimarinasi dengan madu hutan kalimantan, cabai merah, dan kecap manis tradisional, dibakar arang wangi gurih empuk kenyal tanpa alot.",
          tags: ["Cumi Segar Nelayan", "Madu Hutan Kalimantan"],
          price: 46000,
          unit: "porsi"
        }
      ]
    },
    {
      id: "kat-05",
      number: "KATEGORI 05",
      title: "Minuman Penyegar Tradisional & Kue Penutup",
      desc: "Penutup sempurna bagi jamuan katering Anda. Kelezatan manis legit, asam segar, dan kehangatan tradisional yang membangkitkan nostalgia rasa Singkawang sejati.",
      items: [
        {
          id: "es-sonkit",
          title: "Es Sonkit Jeruk Singkawang",
          badge: "SEGAR ASAM DINGIN",
          image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
          desc: "Minuman penyegar khas jeruk kasturi / sonkit segar Singkawang dipadu kiamboi (plum asin) dan gula batu alami, manis asam segar pelepas dahaga jamuan pesta.",
          tags: ["Jeruk Kasturi Asli", "Kiamboi Segar"],
          price: 15000,
          unit: "porsi"
        },
        {
          id: "kembang-tahu",
          title: "Kembang Tahu Air Jahe Gula Merah",
          badge: "HANGAT & MENENANGKAN",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
          desc: "Kembang tahu sutra lembut meleleh di lidah, disajikan dalam kuah jahe hangat bakar wangi dan gula merah kelapa asli Singkawang.",
          tags: ["Kembang Tahu Sutra", "Jahe Wangi Bakar"],
          price: 16000,
          unit: "porsi"
        },
        {
          id: "es-borobudur",
          title: "Es Borobudur Asli Singkawang",
          badge: "DESSERT SPESIAL",
          image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
          desc: "Es campur legendaris khas Singkawang berisi mutiara, cincau hitam, pacar cina, agar-agar, kolang kaling, serutan blewah, dan sirup pisang ambon harum.",
          tags: ["Cincau, Kolang Kaling, Mutiara", "Sirup Pisang Ambon"],
          price: 18000,
          unit: "porsi"
        },
        {
          id: "bingka-pandan",
          title: "Bingka Basah Beras Pandan",
          badge: "KUE TRADISIONAL LEGENDARIS",
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
          desc: "Kue tradisional legit bertekstur lembut harum aroma sari daun pandan dan suji asli, dibakar perlahan dengan santan kental khas tradisi Singkawang.",
          tags: ["Pandan Asli, Santan Kental", "Kudapan Tradisi Singkawang"],
          price: 20000,
          unit: "porsi (3 potong)"
        }
      ]
    }
  ],

  // Komitmen Nilai Rasa & Halal
  commitments: [
    {
      icon: "fa-shield-halved",
      title: "100% Halal Bergizi & Higienis",
      desc: "Seluruh bahan baku dipastikan halal bersertifikasi LPPOM MUI, diolah pada dapur tersertifikasi laik higiene dengan peralatan masak terpisah."
    },
    {
      icon: "fa-basket-shopping",
      title: "Pasar Tradisional Rempah & Bumbu",
      desc: "Bumbu dapur dipasok langsung setiap subuh dari pasar tradisional Singkawang untuk menjamin aroma rempah alami terbaik tanpa pengawet sintetis."
    },
    {
      icon: "fa-award",
      title: "Skala Tinggi Pengawas Kualitas",
      desc: "Setiap batch masakan melalui uji organoleptik rasa, kematangan, dan higienitas oleh juru masak kepala sebelum dikirim ke lokasi resepsi Anda."
    }
  ],

  // Galeri Jamuan
  gallery: [
    {
      title: "Dekorasi Prasmanan Adat Pernikahan Mahasurya Singkawang",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Tumpeng Syukuran Pusaka",
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80"
    }
  ],

  testimonials: [
    {
      quote: "Awalnya sempat khawatir mencari catering di Singkawang yang halal, higienis, dan rasanya pas. Ternyata Aish Catering melampaui ekspektasi! Dekorasi prasmanan luar biasa mewah, sapo tahu dan guramenya ludes diserbu tamu. Pelayanan stafnya pun ramah dan sigap.",
      author: "dr. Fitriani & Fajar",
      role: "Resepsi Pernikahan Gedung Pancasila, Singkawang",
      rating: 5,
      tag: "PAKET PERNIKAHAN",
      avatarBg: "#0c2a20"
    },
    {
      quote: "Kami memesan 200 box bento untuk seminar instansi pemerintah di kantor walikota. Tepat waktu, makanan masih hangat, kemasannya elegan dan bersih. Rasanya otentik khas Singkawang tapi ramah di lidah semua tamu luar kota.",
      author: "Dian Kurniawan, S.STP",
      role: "Koordinator Acara Kantor Walikota Singkawang",
      rating: 5,
      tag: "CATERING KANTOR",
      avatarBg: "#8f6723"
    },
    {
      quote: "Pesan tumpeng megah dan coffee break choipan untuk syukuran rumah baru. Garnish tumpengnya sangat rapi dan instagramable, choipannya lembut persis seperti resep nenek moyang. Tamu-tamu memuji rasanya!",
      author: "Ibu Hj. Mariam",
      role: "Syukuran Rumah Baru Pasiran, Singkawang",
      rating: 5,
      tag: "SYUKURAN KELUARGA",
      avatarBg: "#1c3c2b"
    }
  ],

  addOns: [
    { id: "kambing-guling", name: "Stall Live Kambing Guling Rempah (1 Ekor ~ 60 Porsi)", price: 2800000 },
    { id: "choipan-stall", name: "Live Stall Choipan Singkawang (150 Pcs Kukus Hangat)", price: 650000 },
    { id: "es-podeng", name: "Dessert Corner Es Puter Podeng / Es Cendol (100 Porsi)", price: 500000 },
    { id: "dekor-vip", name: "Dekorasi Meja Prasmanan VIP Bunga Segar Premium", price: 750000 },
    { id: "pramusaji-extra", name: "Tambahan 2 Petugas Pramusaji Seragam Khusus (6 Jam)", price: 350000 }
  ]
};
