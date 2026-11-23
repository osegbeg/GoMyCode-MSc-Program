import { Product } from "../models/Product.js";

export class ProductBuilder {
  constructor(name, price) {
    if (!name || price == null) {
      throw new Error("Product requires at least a name and base price.");
    }
    this.config = { name, price };
  }

  withCategory(category) {
    this.config.category = category;
    return this;
  }

  withWarranty(months) {
    this.config.warrantyMonths = months;
    return this;
  }

  withGiftWrap(enabled = true) {
    this.config.giftWrapped = enabled;
    return this;
  }

  build() {
    return new Product(this.config);
  }
}