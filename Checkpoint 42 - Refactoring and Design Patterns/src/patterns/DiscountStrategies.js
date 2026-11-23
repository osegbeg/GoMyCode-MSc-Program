export class NoDiscountStrategy {
  calculateDiscount(subtotal) {
    return 0;
  }
}

export class PercentageDiscountStrategy {
  constructor(percentage) {
    this.percentage = percentage;
  }

  calculateDiscount(subtotal) {
    return subtotal * (this.percentage / 100);
  }
}

export class BulkThresholdDiscountStrategy {
  constructor(threshold, flatDiscount) {
    this.threshold = threshold;
    this.flatDiscount = flatDiscount;
  }

  calculateDiscount(subtotal) {
    return subtotal >= this.threshold ? this.flatDiscount : 0;
  }
}