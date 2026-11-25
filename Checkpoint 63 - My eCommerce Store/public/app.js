const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutForm = document.getElementById("checkoutForm");
const orderStatusEl = document.getElementById("orderStatus");

let products = [];
let cart = [];

async function loadProducts() {
  const params = new URLSearchParams({
    category: categorySelect.value,
    search: searchInput.value,
  });
  const res = await fetch(`/api/products?${params.toString()}`);
  products = await res.json();
  renderProducts();
}

function renderProducts() {
  if (!products.length) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  productGrid.innerHTML = products
    .map(
      (p) => `
      <article class="card">
        <span class="badge">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="price">$${p.price.toFixed(2)}</div>
        <button class="btn primary full" onclick="addToCart(${p.id})">Add to Cart</button>
      </article>
    `
    )
    .join("");
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function updateQty(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCountEl.textContent = count;
  cartTotalEl.textContent = `$${total.toFixed(2)}`;

  if (!cart.length) {
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong><br />
          <span>$${(item.price * item.qty).toFixed(2)}</span>
        </div>
        <div class="qty-controls">
          <button type="button" class="btn secondary" onclick="updateQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button type="button" class="btn secondary" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `
    )
    .join("");
}

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!cart.length) {
    orderStatusEl.textContent = "Add at least one item before checking out.";
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerName, email, items: cart }),
  });

  const data = await res.json();
  if (res.ok) {
    orderStatusEl.textContent = `Order ${data.order.id} confirmed ($${data.order.total.toFixed(2)}).`;
    cart = [];
    renderCart();
    checkoutForm.reset();
  } else {
    orderStatusEl.textContent = data.error || "Checkout failed.";
  }
});

searchInput.addEventListener("input", loadProducts);
categorySelect.addEventListener("change", loadProducts);

loadProducts();
renderCart();
