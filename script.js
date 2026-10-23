const WHATSAPP_NUMBER = "6281234567890";
// Ganti nomor di atas sebelum website digunakan oleh restoran.
// Format Indonesia: 62 diikuti nomor HP tanpa angka 0 di depan.


let menu = [
  // MAKANAN
  { name: "Tumis Tempe", price: 5000, photo: "images/tumis-tempe.jpg", category: "Makanan" },
  { name: "Ayam Goreng", price: 9900, photo: "images/ayam-goreng.jpg", category: "Makanan" },
  { name: "Ikan Mabong", price: 15000, photo: "images/ikan-goreng.jpg", category: "Makanan" },
  { name: "Bihun Goreng", price: 6000, photo: "images/bihun-goreng.jpg", category: "Makanan" },
  { name: "Nasi Goreng", price: 10000, photo: "images/nasi-goreng.jpg", category: "Makanan" },
  { name: "Capcay Goreng", price: 10000, photo: "images/capcay-goreng.jpg", category: "Makanan" },
  { name: "Tumis Ikan Peda", price: 13000, photo: "images/tumis-ikan-peda.jpg", category: "Makanan" },
  { name: "Tumis Kangkung", price: 5000, photo: "images/tumis-kangkung.jpg", category: "Makanan" },

  // MINUMAN
  { name: "Es Teh Manis", price: 4000, photo: "images/es-teh-manis.jpg", category: "Minuman" },
  { name: "Es Jeruk", price: 6000, photo: "images/es-jeruk.jpg", category: "Minuman" },
  { name: "Es Kopi Susu", price: 12000, photo: "images/es-kopi-susu.jpg", category: "Minuman" },
  { name: "Es Cendol", price: 8000, photo: "images/es-cendol.jpg", category: "Minuman" },

  // DESSERT
  { name: "Pisang Goreng", price: 7000, photo: "images/pisang-goreng.jpg", category: "Dessert" },
  { name: "Puding Cokelat", price: 8000, photo: "images/puding-cokelat.jpg", category: "Dessert" },
  { name: "Es Buah", price: 10000, photo: "images/es-buah.jpg", category: "Dessert" },
  { name: "Klepon", price: 6000, photo: "images/klepon.jpg", category: "Dessert" }
];

let activeCategory = "Semua";


// Nama menu menjadi kunci, jumlahnya menjadi nilai.
const cart = new Map();

const grid = document.getElementById("menu");
const search = document.getElementById("searchInput");
const cartPanel = document.getElementById("pesanan");

const formatRupiah = (amount) =>
  "IDR. " + new Intl.NumberFormat("id-ID").format(amount);

function renderMenu() {
  const keyword = search.value.trim().toLowerCase();

  const filtered = menu.filter((item) => {
  const cocokNama = item.name.toLowerCase().includes(keyword);
  const cocokKategori =
    activeCategory === "Semua" || item.category === activeCategory;

  return cocokNama && cocokKategori;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty">Masakan tidak ditemukan.</p>';
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "food-card";
    
    card.innerHTML = `
      <img
        class="food-image"
        src="${item.photo}"
        alt="${item.name}"
        loading="lazy"
      >
      <div class="food-details">
        <div>
          <p class="food-name">${item.name}</p>
          <p class="food-price">${formatRupiah(item.price)}</p>
        </div>
        <button
          class="bag-button"
          type="button"
          aria-label="Tambah ${item.name} ke pesanan"
          title="Tambah ke pesanan"
        >+ Tambah</button>
      </div>
    `;

    card.querySelector(".bag-button").addEventListener("click", () => {
      addToCart(item.name);
    });

    grid.appendChild(card);
  });
}


/* ===== MAKANAN FAVORIT DARI GOOGLE SHEETS ===== */

function renderFavorites() {
  const container = document.getElementById("favoriteGrid");
  if (!container) return;

  const favorites = menu.filter(item => item.favorite);

  if (favorites.length === 0) {
    container.innerHTML =
      '<p class="feature-empty">Belum ada menu favorit yang dipilih.</p>';
    return;
  }

  container.replaceChildren();

  favorites.forEach(item => {
    const card = document.createElement("article");
    card.className = "favorite-card";

    const image = document.createElement("img");
    image.src = item.photo || "";
    image.alt = item.name;
    image.loading = "lazy";

    const label = document.createElement("span");
    label.className = "favorite-label";
    label.textContent = "♥ FAVORIT PELANGGAN";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const price = document.createElement("p");
    price.className = "favorite-price";
    price.textContent = formatRupiah(item.price);

    const button = document.createElement("button");
    button.className = "favorite-add";
    button.type = "button";
    button.textContent = "+ Tambah";
    button.addEventListener("click", () => addToCart(item.name));

    card.append(image, label, title, price, button);
    container.appendChild(card);
  });
}


/* ===== PROMO DARI GOOGLE SHEETS ===== */


function renderPromos() {
  const container = document.getElementById("promoGrid");
  if (!container) return;

  const now = new Date();

  const promos = (window.menuPromos || []).filter(promo => {
    if (!promo.active) return false;

    // Promo mendatang boleh ditampilkan.
    // Promo yang sudah berakhir disembunyikan.
    const end = promo.endDate
      ? new Date(promo.endDate + "T23:59:59")
      : null;

    if (end && !Number.isNaN(end.getTime()) && now > end) {
      return false;
    }

    return true;
  });

  if (promos.length === 0) {
    container.innerHTML =
      '<p class="feature-empty">Belum ada promo aktif saat ini.</p>';
    return;
  }

  container.replaceChildren();

  promos.forEach((promo, index) => {
    const namaPromo = String(promo.menuName || "")
  .trim()
  .toLowerCase();

    const menuItem = (menu || []).find(item =>
      String(item.name || "").trim().toLowerCase() === namaPromo
    );

    console.log("Pencocokan promo:", {
      namaPromo: promo.menuName,
      menuDitemukan: menuItem?.name,
      fotoMenu: menuItem?.photo
    });

    const card = document.createElement("article");
    card.className = "promo-card promo-card-visual";
    card.style.animationDelay = `${index * 100}ms`;

    // Foto makanan dari tab Menu.
    const imageWrap = document.createElement("div");
    imageWrap.className = "promo-image-wrap";

    if (menuItem && menuItem.photo) {
      const image = document.createElement("img");
      image.className = "promo-image";
      image.src = menuItem.photo;
      image.alt = menuItem.name;
      image.loading = "lazy";

      image.onerror = () => {
        imageWrap.classList.add("promo-image-fallback");
        image.remove();
      };

      imageWrap.appendChild(image);
    } else {
      imageWrap.classList.add("promo-image-fallback");

      const placeholder = document.createElement("span");
      placeholder.className = "promo-image-placeholder";
      placeholder.textContent = "🍽️";
      imageWrap.appendChild(placeholder);
    }

    const badge = document.createElement("span");
    badge.className = "promo-label";
    badge.textContent = promo.discount
      ? `PROMO ${promo.discount}`
      : "PROMO SPESIAL";

    imageWrap.appendChild(badge);

    const content = document.createElement("div");
    content.className = "promo-content";

    const title = document.createElement("h3");
    title.textContent = promo.title || "Promo Spesial";

    const description = document.createElement("p");
    description.className = "promo-description";
    description.textContent = promo.description || "";

    const menuName = document.createElement("p");
    menuName.className = "promo-menu-name";
    menuName.textContent = promo.menuName
      ? `Menu: ${promo.menuName}`
      : "Lihat pilihan menu kami";

    content.append(title, description, menuName);

    // Harga normal dan harga promo.
    const priceBox = document.createElement("div");
    priceBox.className = "promo-prices";

    const normalPrice = menuItem
      ? Number(menuItem.price) || 0
      : 0;

    const salePrice = Number(promo.promoPrice) || 0;

    if (normalPrice > 0 && salePrice > 0 && salePrice < normalPrice) {
      const oldPrice = document.createElement("del");
      oldPrice.className = "promo-old-price";
      oldPrice.textContent = formatRupiah(normalPrice);

      const newPrice = document.createElement("strong");
      newPrice.className = "promo-new-price";
      newPrice.textContent = formatRupiah(salePrice);

      priceBox.append(oldPrice, newPrice);
    } else if (normalPrice > 0) {
      const regularPrice = document.createElement("strong");
      regularPrice.className = "promo-new-price";
      regularPrice.textContent = formatRupiah(normalPrice);
      priceBox.appendChild(regularPrice);
    } else {
      const priceNote = document.createElement("span");
      priceNote.className = "promo-price-note";
      priceNote.textContent = "Hubungi restoran untuk harga";
      priceBox.appendChild(priceNote);
    }

    const period = document.createElement("small");
    period.className = "promo-period";
    period.textContent =
      `Periode: ${promo.startDate || "Sekarang"} — ${promo.endDate || "Sampai informasi berikutnya"}`;

    
    const button = document.createElement("button");
    button.type = "button";
    button.className = "promo-menu-button";
    button.textContent = "🛒 Tambah ke Keranjang";

    button.disabled = !menuItem;

    button.addEventListener("click", () => {
      if (!menuItem) {
        alert("Menu promo tidak ditemukan di tab Menu.");
        return;
      }

      // Pastikan harga promo valid sebelum menambah ke keranjang.
      const originalPrice = Number(menuItem.price) || 0;
      const promoPrice = Number(promo.promoPrice) || 0;

      if (promoPrice <= 0 || promoPrice >= originalPrice) {
        alert("Harga promo belum valid. Periksa tab Promo di Google Sheets.");
        return;
      }

      // Gunakan fungsi keranjang yang sudah ada di website.
      if (typeof addToCart !== "function") {
        alert("Fungsi keranjang belum ditemukan.");
        return;
      }

      const savedPrice = menuItem.price;

      try {
        menuItem.price = promoPrice;
        addToCart(menuItem.name);
      } finally {
        menuItem.price = savedPrice;
      }
    });


    content.append(priceBox, period, button);
    card.append(imageWrap, content);
    container.appendChild(card);
  });
}



// Menambah satu menu ke keranjang.
function addToCart(name) {
  const currentQty = cart.get(name) || 0;
  cart.set(name, currentQty + 1);

  cartPanel.classList.add("visible");
  renderCart();
}

// Mengubah jumlah menu, atau menghapus jika jumlah menjadi nol.
function changeQuantity(name, amount) {
  const currentQty = cart.get(name) || 0;
  const newQty = currentQty + amount;

  if (newQty <= 0) {
    cart.delete(name);
  } else {
    cart.set(name, newQty);
  }

  renderCart();
}

// Menghapus menu secara langsung.
function removeItem(name) {
  cart.delete(name);
  renderCart();
}

function renderCart() {
  const box = document.getElementById("cartItems");
  const countElement = document.getElementById("cartCount");
  const totalElement = document.getElementById("cartTotal");

  box.innerHTML = "";

  let total = 0;
  let totalItems = 0;

  if (cart.size === 0) {
    box.innerHTML = "<p>Belum ada menu yang dipilih.</p>";
  }

  cart.forEach((qty, name) => {
    const item = menu.find((product) => product.name === name);

    if (!item) return;

    const subtotal = item.price * qty;
    total += subtotal;
    totalItems += qty;

    const row = document.createElement("div");
    row.className = "cart-row";

    row.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span class="cart-subtotal">${formatRupiah(subtotal)}</span>
      </div>

      <div class="cart-actions">
        <div class="quantity-control">
          <button
            class="quantity-btn minus"
            type="button"
            aria-label="Kurangi ${item.name}"
          >−</button>

          <span class="quantity-number">${qty}</span>

          <button
            class="quantity-btn plus"
            type="button"
            aria-label="Tambah ${item.name}"
          >+</button>
        </div>

        <button class="remove-btn" type="button">
          Hapus
        </button>
      </div>
    `;

    row.querySelector(".minus").addEventListener("click", () => {
      changeQuantity(name, -1);
    });

    row.querySelector(".plus").addEventListener("click", () => {
      changeQuantity(name, 1);
    });

    row.querySelector(".remove-btn").addEventListener("click", () => {
      removeItem(name);
    });

    box.appendChild(row);
  });

  countElement.textContent = totalItems;
  totalElement.textContent = formatRupiah(total);
}


function checkout() {
  if (cart.size === 0) {
    alert("Keranjang masih kosong. Silakan pilih menu terlebih dahulu.");
    return;
  }

  const lines = [];
  let total = 0;

  cart.forEach((qty, name) => {
    const item = menu.find((product) => product.name === name);
    if (!item) return;

    const subtotal = item.price * qty;
    total += subtotal;

    lines.push(
      `- ${item.name} x ${qty} = ${formatRupiah(subtotal)}`
    );
  });

  const message = [
    "Halo Masakan Emak, saya ingin memesan:",
    "",
    ...lines,
    "",
    `Total pesanan: ${formatRupiah(total)}`,
    "",
    "Mohon konfirmasi ketersediaan menu dan cara pembayarannya. Terima kasih."
  ].join("\n");

  const url =
    `https://wa.me/${String(window.menuSettings?.whatsapp || WHATSAPP_NUMBER)
      .replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

// Event pencarian menu.
search.addEventListener("input", renderMenu);

document.getElementById("searchBtn").addEventListener("click", renderMenu);

document.querySelector(".category-bar").addEventListener("click", (event) => {
  const tombol = event.target.closest("[data-category]");
  if (!tombol) return;

  activeCategory = tombol.dataset.category;

  document.querySelectorAll(".category-chip").forEach((chip) => {
    chip.classList.toggle("active", chip === tombol);
  });

  renderMenu();
});


/* ===== PANEL KONFIRMASI PESANAN ===== */

function showOrderConfirmation() {
  const whatsappNumber = String(
    (window.menuSettings || {}).whatsapp || WHATSAPP_NUMBER
  ).replace(/\D/g, "");

  if (!/^\d{10,15}$/.test(whatsappNumber)) {
    alert("Nomor WhatsApp belum valid. Periksa tab Pengaturan di Google Sheets.");
    return;
  }

  let total = 0;
  let itemsHTML = "";

  cart.forEach((qty, name) => {
    const item = menu.find((product) => product.name === name);
    if (!item) return;

    const subtotal = item.price * qty;
    total += subtotal;

    itemsHTML += `
      <div class="demo-checkout-item">
        <div>
          <strong>${item.name}</strong>
          <p>${qty} × ${formatRupiah(item.price)}</p>
        </div>
        <strong>${formatRupiah(subtotal)}</strong>
      </div>
    `;
  });

  const oldModal = document.querySelector(".demo-checkout-overlay");
  if (oldModal) oldModal.remove();

  const overlay = document.createElement("div");
  overlay.className = "demo-checkout-overlay";

  overlay.innerHTML = `
    <div class="demo-checkout-modal" role="dialog"
         aria-modal="true" aria-labelledby="checkoutTitle">

      <button class="demo-checkout-close"
              type="button" aria-label="Tutup">&times;</button>

      <p class="demo-checkout-label">KONFIRMASI PESANAN</p>
      <h2 id="checkoutTitle">Ringkasan Pesanan</h2>

      <p class="demo-checkout-info">
        Periksa pesanan kamu sebelum melanjutkan ke WhatsApp.
      </p>

      <div class="demo-checkout-items">
        ${itemsHTML}
      </div>

      <div class="demo-checkout-total">
        <span>Total pesanan</span>
        <strong>${formatRupiah(total)}</strong>
      </div>

      <p class="demo-checkout-status">
        Pesanan belum dikirim ke restoran.
        Kamu masih perlu menekan tombol Kirim di WhatsApp.
      </p>

      <button class="demo-checkout-confirm" type="button">
        Konfirmasi & lanjutkan ke WhatsApp
      </button>

      <button class="demo-checkout-cancel" type="button">
        Kembali ke Menu
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  function closeModal() {
    overlay.remove();
  }

  overlay.querySelector(".demo-checkout-close")
    .addEventListener("click", closeModal);

  overlay.querySelector(".demo-checkout-cancel")
    .addEventListener("click", closeModal);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  overlay.querySelector(".demo-checkout-confirm")
    .addEventListener("click", () => {
      const whatsappNumber = String(
        (window.menuSettings || {}).whatsapp || WHATSAPP_NUMBER
      ).replace(/\D/g, "");

      if (!/^\d{10,15}$/.test(whatsappNumber)) {
        alert("Nomor WhatsApp belum valid. Periksa tab Pengaturan.");
        return;
      }

      const lines = [];
      let orderTotal = 0;

      cart.forEach((qty, name) => {
        const item = menu.find((product) => product.name === name);
        if (!item) return;

        const subtotal = item.price * qty;
        orderTotal += subtotal;

        lines.push(
          `- ${item.name} x ${qty} = ${formatRupiah(subtotal)}`
        );
      });

      const message = [
        "Halo Masakan Emak, saya ingin memesan:",
        "",
        ...lines,
        "",
        `Total pesanan: ${formatRupiah(orderTotal)}`,
        "",
        "Mohon konfirmasi ketersediaan menu dan cara pembayarannya. Terima kasih."
      ].join("\n");

      const url =
        `https://wa.me/${String(window.menuSettings?.whatsapp || WHATSAPP_NUMBER)
          .replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank", "noopener,noreferrer");
    });
}

/* ===== PANEL KONFIRMASI PESANAN ===== */

function showOrderConfirmation() {
  if (cart.size === 0) {
    alert("Keranjang masih kosong. Silakan pilih menu terlebih dahulu.");
    return;
  }

  let total = 0;
  let itemsHTML = "";

  cart.forEach((qty, name) => {
    const item = menu.find((product) => product.name === name);
    if (!item) return;

    const subtotal = item.price * qty;
    total += subtotal;

    itemsHTML += `
      <div class="demo-checkout-item">
        <div>
          <strong>${item.name}</strong>
          <p>${qty} × ${formatRupiah(item.price)}</p>
        </div>
        <strong>${formatRupiah(subtotal)}</strong>
      </div>
    `;
  });

  const oldModal = document.querySelector(".demo-checkout-overlay");
  if (oldModal) oldModal.remove();

  const overlay = document.createElement("div");
  overlay.className = "demo-checkout-overlay";

  overlay.innerHTML = `
    <div class="demo-checkout-modal" role="dialog"
         aria-modal="true" aria-labelledby="checkoutTitle">

      <button class="demo-checkout-close"
              type="button" aria-label="Tutup">&times;</button>

      <p class="demo-checkout-label">KONFIRMASI PESANAN</p>
      <h2 id="checkoutTitle">Ringkasan Pesanan</h2>

      <p class="demo-checkout-info">
        Periksa pesanan kamu sebelum melanjutkan ke WhatsApp.
      </p>

      <div class="demo-checkout-items">
        ${itemsHTML}
      </div>

      <div class="demo-checkout-total">
        <span>Total pesanan</span>
        <strong>${formatRupiah(total)}</strong>
      </div>

      <p class="demo-checkout-status">
        Pesanan belum dikirim ke restoran.
        Kamu masih perlu menekan tombol Kirim di WhatsApp.
      </p>

      <button class="demo-checkout-confirm" type="button">
        Konfirmasi & lanjutkan ke WhatsApp
      </button>

      <button class="demo-checkout-cancel" type="button">
        Kembali ke Menu
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  function closeModal() {
    overlay.remove();
  }

  overlay.querySelector(".demo-checkout-close")
    .addEventListener("click", closeModal);

  overlay.querySelector(".demo-checkout-cancel")
    .addEventListener("click", closeModal);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  overlay.querySelector(".demo-checkout-confirm")
    .addEventListener("click", () => {
      const whatsappNumber = String(
        (window.menuSettings || {}).whatsapp || WHATSAPP_NUMBER
      ).replace(/\D/g, "");

      if (!/^\d{10,15}$/.test(whatsappNumber)) {
        alert("Nomor WhatsApp belum valid. Periksa tab Pengaturan.");
        return;
      }

      const lines = [];
      let orderTotal = 0;

      cart.forEach((qty, name) => {
        const item = menu.find((product) => product.name === name);
        if (!item) return;

        const subtotal = item.price * qty;
        orderTotal += subtotal;

        lines.push(
          `- ${item.name} x ${qty} = ${formatRupiah(subtotal)}`
        );
      });

      const message = [
        "Halo Masakan Emak, saya ingin memesan:",
        "",
        ...lines,
        "",
        `Total pesanan: ${formatRupiah(orderTotal)}`,
        "",
        "Mohon konfirmasi ketersediaan menu dan cara pembayarannya. Terima kasih."
      ].join("\n");

      const url =
        `https://wa.me/${String(window.menuSettings?.whatsapp || WHATSAPP_NUMBER)
          .replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank", "noopener,noreferrer");
    });
}

/* ===== HUBUNGKAN TOMBOL CHECKOUT ===== */

document.getElementById("checkoutBtn")
  .addEventListener("click", showOrderConfirmation);

// Tampilkan menu dan kondisi keranjang saat halaman dibuka.
renderMenu();
renderCart();
renderFavorites();
renderPromos();


/* ===== GOOGLE SHEETS MENU API ===== */

const MENU_API_URL =
  "https://script.google.com/macros/s/AKfycbwnkojK3Ylt2KODn8rFPLeoTQSVs6Y-4rtySvMqz8xs6T3Pxfq2hB02onEoA2xL5s8/exec";

function ambilMenuDariGoogleSheets() {
  return new Promise((resolve, reject) => {
    const callbackName =
      "menuCallback_" + Date.now() + "_" +
      Math.floor(Math.random() * 10000);

    const scriptTag = document.createElement("script");
    let selesai = false;

    const timeout = setTimeout(() => {
      bersihkan();
      reject(new Error("Waktu pengambilan menu habis."));
    }, 15000);

    function bersihkan() {
      if (selesai) return;
      selesai = true;
      clearTimeout(timeout);
      delete window[callbackName];
      scriptTag.remove();
    }

    window[callbackName] = (data) => {
      bersihkan();

      if (!data || !Array.isArray(data.items)) {
        reject(new Error("Data menu tidak valid."));
        return;
      }

      
      window.menuSettings = data.settings || {};
      window.menuOperatingHours = data.operatingHours || [];

      // Simpan semua promo dari Google Apps Script.
      window.menuPromos = Array.isArray(data.promos)
        ? data.promos
        : [];

      console.log("Jumlah promo dari Google Sheets:", window.menuPromos.length);

      resolve(data.items);

    };

    scriptTag.onerror = () => {
      bersihkan();
      reject(new Error("Gagal menghubungi API menu."));
    };

    scriptTag.src =
      MENU_API_URL + "?callback=" +
      encodeURIComponent(callbackName);

    document.head.appendChild(scriptTag);
  });
}

ambilMenuDariGoogleSheets()
  .then((items) => {
    tampilkanPengaturanRestoran();
    // Gunakan menu cadangan jika spreadsheet masih kosong.
    if (items.length === 0) {
      console.warn("Data menu kosong. Menu cadangan digunakan.");
      return;
    }

    
    function siapkanUrlFoto(url) {
      const value = String(url || "").trim();

      if (!value) return "";

      if (!value.includes("drive.google.com")) {
        return value;
      }

      const match =
        value.match(/\/file\/d\/([^/?#]+)/) ||
        value.match(/[?&]id=([^&#]+)/);

      if (!match || !match[1]) return value;

      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }


    const menuTerbaru = items.map((item) => ({
      id: String(item.id || ""),
      name: String(item.name || ""),
      price: Number(item.price) || 0,
      photo: siapkanUrlFoto(item.image),
      category: String(item.category || ""),
      favorite: ["TRUE", "YA", "YES", "1"]
        .includes(String(item.favorit ?? item.favorite ?? "").trim().toUpperCase()),
      onPromo: ["TRUE", "YA", "YES", "1"]
        .includes(String(item.promo ?? "").trim().toUpperCase())
    })).filter((item) =>
      item.name &&
      item.price >= 0 &&
      ["Makanan", "Minuman", "Dessert"].includes(item.category)
    );

    if (menuTerbaru.length === 0) {
      console.warn("Data menu tidak valid. Menu cadangan digunakan.");
      return;
    }

    // Ganti menu di website dengan data terbaru dari Sheets.
    menu = menuTerbaru;

    // Hapus item keranjang yang sudah tidak tersedia.
    for (const name of cart.keys()) {
      if (!menu.some((item) => item.name === name)) {
        cart.delete(name);
      }
    }

    // Perbarui kartu menu dan total keranjang.
    renderMenu();
    renderCart();
    renderFavorites();
    renderPromos();

    console.log("Menu berhasil dimuat dari Google Sheets:", menu.length);
  })
  .catch((error) => {
    // Jika API gagal, website tetap memakai menu cadangan.
    console.warn(
      "API menu gagal. Menggunakan menu cadangan.",
      error
    );
  });


const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {
  reservationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("reservationName").value.trim();
    const date = document.getElementById("reservationDate").value;
    const time = document.getElementById("reservationTime").value;
    const guests = document.getElementById("reservationGuests").value;
    const notes = document.getElementById("reservationNotes").value.trim();

    const whatsappNumber = "6281234567890"; // GANTI dengan nomor yang benar

    const message = [
      "Halo Masakan Emak, saya ingin mengajukan reservasi meja.",
      "",
      `Nama: ${name}`,
      `Tanggal: ${date}`,
      `Jam: ${time}`,
      `Jumlah orang: ${guests}`,
      `Catatan: ${notes || "-"}`,
      "",
      "Mohon konfirmasi ketersediaan meja. Terima kasih."
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}


/* FLOATING CART — BUKA/TUTUP */
(() => {
  const toggle = document.getElementById('cartFloatToggle');
  const countBadge = document.getElementById('cartFloatCount');
  const cartCount = document.getElementById('cartCount');
  const panel = document.getElementById('pesanan');

  if (!toggle || !countBadge || !cartCount || !panel) return;

  function syncCartCount() {
    countBadge.textContent = cartCount.textContent.trim() || '0';
  }

  function setCartOpen(open) {
    document.body.classList.toggle('cart-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute(
      'aria-label',
      open ? 'Tutup keranjang pesanan' : 'Buka keranjang pesanan'
    );
  }

  toggle.addEventListener('click', () => {
    setCartOpen(!document.body.classList.contains('cart-open'));
  });

  // Tutup dengan tombol Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setCartOpen(false);
  });

  // Perbarui badge ketika jumlah keranjang berubah
  new MutationObserver(syncCartCount).observe(cartCount, {
    childList: true,
    characterData: true,
    subtree: true
  });

  syncCartCount();
})();

/* ========================================
   MASAKAN EMAK — SCROLL REVEAL
======================================== */
(() => {
  const selectors = [
    '.food-card',
    '.review-card',
    '.reservation-section',
    '.location-section'
  ].join(',');

  // Fallback untuk browser tanpa IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(selectors).forEach((element) => {
      element.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -35px 0px'
  });

  function revealElements(root = document) {
    if (root.matches?.(selectors)) {
      if (!root.classList.contains('reveal-on-scroll')) {
        root.classList.add('reveal-on-scroll');
        observer.observe(root);
      }
    }

    root.querySelectorAll?.(selectors).forEach((element) => {
      if (!element.classList.contains('reveal-on-scroll')) {
        element.classList.add('reveal-on-scroll');
        observer.observe(element);
      }
    });
  }

  revealElements();

  // Menu dirender oleh JavaScript, jadi pantau kartu baru juga.
  const menu = document.querySelector('#menu');

  if (menu) {
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            revealElements(node);
          }
        });
      });
    }).observe(menu, {
      childList: true,
      subtree: true
    });
  }
})();

/* FEEDBACK SENTUH TOMBOL TAMBAH */
document.addEventListener('click', (event) => {
  const button = event.target.closest('.bag-button');
  if (!button) return;

  button.classList.remove('just-added');

  // Memicu ulang animasi
  void button.offsetWidth;
  button.classList.add('just-added');

  window.setTimeout(() => {
    button.classList.remove('just-added');
  }, 450);
});

/* FEEDBACK TAMBAH — CEPAT */
document.addEventListener('click', (event) => {
  const button = event.target.closest('.bag-button');
  if (!button) return;

  button.classList.add('just-added');

  window.setTimeout(() => {
    button.classList.remove('just-added');
  }, 220);
});



function tampilkanPengaturanRestoran() {
  const settings = window.menuSettings || {};
  const hours = window.menuOperatingHours || [];

  
  // Status tutup sementara dari Google Sheets
  const restoranTutup =
    String(settings.tutup_sementara || "").toUpperCase() === "TRUE";

  const pesanTutup = document.getElementById("pesanTutupSementara");

  if (pesanTutup) {
    pesanTutup.hidden = !restoranTutup;
  }

  const tombolReservasi = document.querySelector(
    "#reservationForm button[type='submit']"
  );

  if (tombolReservasi) {
    tombolReservasi.disabled = restoranTutup;
    tombolReservasi.textContent = restoranTutup
      ? "Reservasi Ditutup Sementara"
      : "Kirim Rencana Kunjungan";
  }

    // ===== INFORMASI RESTORAN DARI GOOGLE SHEETS =====

  const namaRestoran = String(
    settings.nama_restoran || "Masakan Emak"
  ).trim();

  const bagianNama = namaRestoran.split(/\s+/);
  const namaAkhir = bagianNama.length > 1
    ? bagianNama.pop()
    : "";

  const namaUtama = bagianNama.join(" ") || namaRestoran;

  const elemenNamaUtama = document.getElementById("namaRestoranUtama");
  const elemenNamaAkhir = document.getElementById("namaRestoranAkhir");

  if (elemenNamaUtama) {
    elemenNamaUtama.textContent = namaUtama;
  }

  if (elemenNamaAkhir) {
    elemenNamaAkhir.textContent = namaAkhir;
    elemenNamaAkhir.hidden = !namaAkhir;
  }

  // Nama restoran di reservasi dan footer
  const namaReservasi = document.getElementById("namaRestoranReservasi");
  if (namaReservasi) {
    namaReservasi.textContent = namaRestoran.toUpperCase();
  }

  const namaFooter = document.getElementById("namaRestoranFooter");
  if (namaFooter) {
    namaFooter.textContent = namaRestoran;
  }

  // Judul tab browser
  const judulHalaman = document.getElementById("judulHalaman");
  if (judulHalaman) {
    judulHalaman.textContent = namaRestoran + " — Beranda";
  }

  // Judul peta
  const petaRestoran = document.getElementById("petaRestoran");
  if (petaRestoran) {
    petaRestoran.title = "Lokasi " + namaRestoran;
  }

  // Sapaan header
  const brandArea = document.querySelector(".brand-area p");
  if (brandArea && settings.sapaan_restoran) {
    brandArea.textContent = settings.sapaan_restoran;
  }

  // Deskripsi footer
  const deskripsiFooter = document.querySelector(".footer-logo + p");
  if (deskripsiFooter && settings.deskripsi_restoran) {
    deskripsiFooter.textContent = settings.deskripsi_restoran;
  }

  const judulReview = document.getElementById("judulReview");
  if (judulReview && settings.judul_review) {
    judulReview.textContent = settings.judul_review;
  }

  const namaDapurReservasi = document.getElementById("namaDapurReservasi");
  if (namaDapurReservasi) {
    namaDapurReservasi.textContent = "DARI DAPUR " + namaRestoran.toUpperCase();
  }


  // Menghubungkan tautan Instagram dari Google Sheets
  const instagram = document.querySelector(
    '[data-setting="instagram_url"]'
  );

  if (instagram && settings.instagram_url) {
    instagram.href = settings.instagram_url;
  }

    // Menghubungkan tautan TikTok dari Google Sheets
  const tiktok = document.querySelector(
    '[data-setting="tiktok_url"]'
  );

  if (tiktok && settings.tiktok_url) {
    tiktok.href = settings.tiktok_url;
  }

  
  // Menghubungkan tautan Facebook dari Google Sheets
  const facebook = document.querySelector(
    '[data-setting="facebook_url"]'
  );

  if (facebook && settings.facebook_url) {
    facebook.href = settings.facebook_url;
  }

  
  // Menghubungkan tautan WhatsApp dari Google Sheets
  const whatsappSocial = document.querySelector(
    '[data-setting="whatsapp_social"]'
  );

  const nomorWhatsApp = String(settings.whatsapp || "").replace(/\D/g, "");

  if (whatsappSocial && nomorWhatsApp) {
    whatsappSocial.href = `https://wa.me/${nomorWhatsApp}`;
  }

  
  // Menghubungkan GoFood dari Google Sheets
  const gofood = document.querySelector(
    '[data-setting="gofood_url"]'
  );

  if (gofood && settings.gofood_url) {
    gofood.href = settings.gofood_url;
  }

  
  // Menghubungkan GrabFood dari Google Sheets
  const grabfood = document.querySelector(
    '[data-setting="grabfood_url"]'
  );

  if (grabfood && settings.grabfood_url) {
    grabfood.href = settings.grabfood_url;
  }

  
  // Menghubungkan ShopeeFood dari Google Sheets
  const shopeefood = document.querySelector(
    '[data-setting="shopeefood_url"]'
  );

  if (shopeefood && settings.shopeefood_url) {
    shopeefood.href = settings.shopeefood_url;
  }

  // Perbarui alamat restoran
  const alamat = document.getElementById('alamatRestoran');
  if (alamat && settings.alamat) {
    alamat.textContent = '📍 ' + settings.alamat;
  }

  const alamatFooter = document.getElementById('alamatFooter');
  if (alamatFooter && settings.alamat) {
    alamatFooter.textContent = '📍 ' + settings.alamat;
  }

  // Perbarui tautan Google Maps
  const maps = document.getElementById('mapsRestoran');
  if (maps && settings.maps_url) {
    maps.href = settings.maps_url;
  }

  const copyright = document.getElementById("copyrightRestoran");
  if (copyright && settings.copyright_restoran) {
    copyright.textContent = settings.copyright_restoran;
  }
  
  // Perbarui jam operasional
  const jam = document.getElementById('jamOperasionalRestoran');

  if (jam && hours.length > 0) {
    const judul = jam.querySelector('h3');
    jam.replaceChildren();

    if (judul) {
      jam.appendChild(judul);
    } else {
      const heading = document.createElement('h3');
      heading.textContent = 'Jam Operasional';
      jam.appendChild(heading);
    }

    const daftarJam = document.createElement('p');

    daftarJam.style.whiteSpace = 'pre-line';
    
    const hariKerja = hours.filter(item =>
      ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].includes(item.day)
    );

    const akhirPekan = hours.filter(item =>
      ['Sabtu', 'Minggu'].includes(item.day)
    );

    function formatJadwal(daftarHari, label) {
      if (daftarHari.length === 0) return '';

      const pertama = daftarHari[0];

      const jadwalSama = daftarHari.every(item =>
        item.open === pertama.open &&
        item.close === pertama.close &&
        item.closed === pertama.closed
      );

      if (jadwalSama) {
        return pertama.closed
          ? `${label}: Tutup`
          : `${label}: ${pertama.open}–${pertama.close} WIB`;
      }

      return daftarHari.map(item =>
        item.closed
          ? `${item.day}: Tutup`
          : `${item.day}: ${item.open}–${item.close} WIB`
      ).join('\n');
    }

    daftarJam.textContent = [
      formatJadwal(hariKerja, 'Senin–Jumat'),
      formatJadwal(akhirPekan, 'Sabtu–Minggu')
    ].filter(Boolean).join('\n');


    jam.appendChild(daftarJam);
  }
    // Perbarui jam operasional footer
  const jamFooter = document.getElementById('jamFooter');

  if (jamFooter && hours.length > 0) {
    const hariKerja = hours.filter(item =>
      ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].includes(item.day)
    );

    const akhirPekan = hours.filter(item =>
      ['Sabtu', 'Minggu'].includes(item.day)
    );

    function formatJamFooter(daftarHari, label) {
      if (daftarHari.length === 0) return '';

      const pertama = daftarHari[0];
      const jadwalSama = daftarHari.every(item =>
        item.open === pertama.open &&
        item.close === pertama.close &&
        item.closed === pertama.closed
      );

      if (jadwalSama) {
        return pertama.closed
          ? `${label}: Tutup`
          : `${label}: ${pertama.open}–${pertama.close} WIB`;
      }

      return daftarHari.map(item =>
        item.closed
          ? `${item.day}: Tutup`
          : `${item.day}: ${item.open}–${item.close} WIB`
      ).join('\n');
    }

    jamFooter.replaceChildren();

    const judulJam = document.createElement('p');
    judulJam.textContent = 'Jam operasional:';
    jamFooter.appendChild(judulJam);

    [
      formatJamFooter(hariKerja, 'Senin–Jumat'),
      formatJamFooter(akhirPekan, 'Sabtu–Minggu')
    ].filter(Boolean).forEach(teks => {
      const p = document.createElement('p');
      p.style.whiteSpace = 'pre-line';
      p.textContent = teks;
      jamFooter.appendChild(p);
    });
  }
  
}
