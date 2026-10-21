const WHATSAPP_NUMBER = "6281234567890";
// Ganti nomor di atas sebelum website digunakan oleh restoran.
// Format Indonesia: 62 diikuti nomor HP tanpa angka 0 di depan.


const menu = [
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
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

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
      // Pastikan nomor WhatsApp sudah diganti dengan nomor yang benar.
      if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER) ||
          WHATSAPP_NUMBER === "6281234567890") {
        alert(
          "Silakan ganti WHATSAPP_NUMBER di bagian atas script.js " +
          "dengan nomor WhatsApp restoran yang benar terlebih dahulu."
        );
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
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");
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
      // Pastikan nomor WhatsApp sudah diganti dengan nomor yang benar.
      if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER) ||
          WHATSAPP_NUMBER === "6281234567890") {
        alert(
          "Silakan ganti WHATSAPP_NUMBER di bagian atas script.js " +
          "dengan nomor WhatsApp restoran yang benar terlebih dahulu."
        );
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
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");
    });
}

/* ===== HUBUNGKAN TOMBOL CHECKOUT ===== */

document.getElementById("checkoutBtn")
  .addEventListener("click", showOrderConfirmation);

// Tampilkan menu dan kondisi keranjang saat halaman dibuka.
renderMenu();
renderCart();


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
