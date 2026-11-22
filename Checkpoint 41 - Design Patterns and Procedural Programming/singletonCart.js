// Deliverable 2: Refactored Implementation using the Singleton Pattern

class ShoppingCart {
  static #instance = null;
  #items = [];

  constructor() {
    if (ShoppingCart.#instance) {
      return ShoppingCart.#instance;
    }
    ShoppingCart.#instance = this;
  }

  static getInstance() {
    if (!ShoppingCart.#instance) {
      ShoppingCart.#instance = new ShoppingCart();
    }
    return ShoppingCart.#instance;
  }

  addItem(name, quantity, price) {
    if (quantity <= 0 || price < 0) {
      throw new Error("Quantity must be positive and price cannot be negative.");
    }

    const existingItem = this.#items.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = price;
    } else {
      this.#items.push({ name, quantity, price });
    }
  }

  viewCart() {
    if (this.#items.length === 0) {
      console.log("Cart is empty. Total: 0.00 TND");
      return;
    }

    let total = 0;
    for (const item of this.#items) {
      const itemTotal = item.quantity * item.price;
      total += itemTotal;
      console.log(`${item.name} (x${item.quantity}) - ${itemTotal.toFixed(2)} TND`);
    }
    console.log(`Total: ${total.toFixed(2)} TND`);
  }

  removeItem(name) {
    this.#items = this.#items.filter(
      (item) => item.name.toLowerCase() !== name.toLowerCase()
    );
  }

  clearCart() {
    this.#items = [];
    console.log("Cart cleared.");
  }
}

// --- Execution & Singleton Verification ---
console.log("=== Singleton Shopping Cart ===");
const cartA = ShoppingCart.getInstance();
const cartB = new ShoppingCart();

console.log(`Single Instance Verified (cartA === cartB): ${cartA === cartB}\n`);

cartA.addItem("Apple", 2, 1.5);
cartB.addItem("Orange", 3, 2.0); // Modifies the exact same cart instance
cartA.viewCart();

console.log("\n--- Removing Apple ---");
cartB.removeItem("Apple");
cartA.viewCart();

console.log("\n--- Clearing Cart ---");
cartA.clearCart();
cartB.viewCart();