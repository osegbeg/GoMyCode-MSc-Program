export class Product {
  #price;
  #observers = [];

  constructor({ name, price, category = "General", warrantyMonths = 0, giftWrapped = false }) {
    this.name = name;
    this.#price = price;
    this.category = category;
    this.warrantyMonths = warrantyMonths;
    this.giftWrapped = giftWrapped;
  }

  get price() {
    return this.#price;
  }

  // Observer Subject methods for price-drop alerts
  subscribe(observer) {
    if (!this.#observers.includes(observer)) {
      this.#observers.push(observer);
    }
  }

  unsubscribe(observer) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  setPrice(newPrice) {
    if (newPrice < 0) throw new Error("Price cannot be negative.");
    const oldPrice = this.#price;
    this.#price = newPrice;

    if (newPrice < oldPrice) {
      this.#notifyPriceDrop(oldPrice, newPrice);
    }
  }

  #notifyPriceDrop(oldPrice, newPrice) {
    for (const observer of this.#observers) {
      observer.onPriceDrop(this, oldPrice, newPrice);
    }
  }
}