export class Customer {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  onPriceDrop(product, oldPrice, newPrice) {
    console.log(
      `[Price Alert -> ${this.name} (${this.email})]: '${product.name}' dropped from $${oldPrice.toFixed(2)} to $${newPrice.toFixed(2)}!`
    );
  }
} 