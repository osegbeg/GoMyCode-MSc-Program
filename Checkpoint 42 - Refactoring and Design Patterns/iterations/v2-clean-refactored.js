// ITERATION 2: Clean Refactored Code (No Design Patterns Yet)
// Improvements: Descriptive names, extracted methods, named constants, dead code removed

const TAX_RATE = 0.075;

class CartItem {
  constructor(name, unitPrice, quantity) {
    this.name = name;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
  }

  getLineTotal() {
    return this.unitPrice * this.quantity;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(name, unitPrice, quantity) {
    const existing = this.items.find((item) => item.name === name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push(new CartItem(name, unitPrice, quantity));
    }
  }

  calculateSubtotal() {
    return this.items.reduce((sum, item) => sum + item.getLineTotal(), 0);
  }

  applyTax(amount) {
    return amount * (1 + TAX_RATE);
  }

  printReceipt(discountAmount = 0) {
    const subtotal = this.calculateSubtotal();
    const discountedTotal = Math.max(0, subtotal - discountAmount);
    const finalTotal = this.applyTax(discountedTotal);

    console.log("=== Receipt ===");
    for (const item of this.items) {
      console.log(`${item.name} (x${item.quantity}) - $${item.getLineTotal().toFixed(2)}`);
    }
    console.log(`Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`Discount: -$${discountAmount.toFixed(2)}`);
    console.log(`Total (incl. 7.5% tax): $${finalTotal.toFixed(2)}`);
  }
}

const cart = new ShoppingCart();
cart.addItem("Laptop", 1200, 1);
cart.addItem("Mouse", 25, 2);
cart.printReceipt(250);