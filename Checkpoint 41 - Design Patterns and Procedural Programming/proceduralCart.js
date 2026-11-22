// Deliverable 1: Procedural Programming Implementation

// Global variable storing cart state
let cart = [];

function addItem(name, quantity, price) {
  const existingItem = cart.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price = price;
  } else {
    cart.push({ name, quantity, price });
  }
}

function viewCart() {
  if (cart.length === 0) {
    console.log("Cart is empty. Total: 0.00 TND");
    return;
  }

  let total = 0;
  for (const item of cart) {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;
    console.log(`${item.name} (x${item.quantity}) - ${itemTotal.toFixed(2)} TND`);
  }
  console.log(`Total: ${total.toFixed(2)} TND`);
}

function removeItem(name) {
  cart = cart.filter((item) => item.name.toLowerCase() !== name.toLowerCase());
}

function clearCart() {
  cart = [];
  console.log("Cart cleared.");
}

// --- Execution / Example Behavior ---
console.log("=== Procedural Shopping Cart ===");
addItem("Apple", 2, 1.5);
addItem("Orange", 3, 2.0);
viewCart();

console.log("\n--- Removing Apple ---");
removeItem("Apple");
viewCart();

console.log("\n--- Clearing Cart ---");
clearCart();
viewCart();