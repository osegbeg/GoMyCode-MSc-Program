import { NoDiscountStrategy } from "../patterns/DiscountStrategies.js";

const TAX_RATE = 0.075;

export class ShoppingCart {
  constructor(discountStrategy = new NoDiscountStrategy()) {
    this.items = [];
    this.discountStrategy = discountStrategy;
  }

  setDiscountStrategy(strategy) {
    this.discountStrategy = strategy;
  }

  addProduct(product, quantity = 1) {
    const existing = this.items.find((entry) => entry.product.name === product.name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  calculateSubtotal() {
    return this.items.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  }

  checkout() {
    const subtotal = this.calculateSubtotal();
    const discount = this.discountStrategy.calculateDiscount(subtotal);
    const taxableAmount = Math.max(0, subtotal - discount);
    const total = taxableAmount * (1 + TAX_RATE);

    console.log("\n=== Final Checkout Summary ===");
    for (const { product, quantity } of this.items) {
      const extras = [
        product.category,
        product.warrantyMonths ? `${product.warrantyMonths}mo warranty` : null,
        product.giftWrapped ? "Gift Wrapped" : null,
      ]
        .filter(Boolean)
        .join(", ");

      console.log(
        `• ${product.name} [${extras}] (x${quantity}) - $${(product.price * quantity).toFixed(2)}`
      );
    }
    console.log(`Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`Discount: -$${discount.toFixed(2)}`);
    console.log(`Total (incl. 7.5% tax): $${total.toFixed(2)}`);
  }
}