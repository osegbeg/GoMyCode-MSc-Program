import { Customer } from "./models/Customer.js";
import { ProductBuilder } from "./patterns/ProductBuilder.js";
import {
  PercentageDiscountStrategy,
  BulkThresholdDiscountStrategy,
} from "./patterns/DiscountStrategies.js";
import { ShoppingCart } from "./services/ShoppingCart.js";

// 1. Builder Pattern: Construct complex Product objects fluently
const laptop = new ProductBuilder("ProBook 15 Laptop", 1200)
  .withCategory("Electronics")
  .withWarranty(24)
  .withGiftWrap(true)
  .build();

const mouse = new ProductBuilder("Wireless Ergonomic Mouse", 40)
  .withCategory("Accessories")
  .build();

// 2. Observer Pattern: Customers subscribe to price drops
const goldenJoe = new Customer("Golden-Joe", "goldenjoe@example.com");
const victory = new Customer("Victory", "victory@example.com");

laptop.subscribe(goldenJoe);
laptop.subscribe(victory);

console.log("--- Triggering Price Drop Event ---");
laptop.setPrice(1050); // Automatically notifies both Golden-Joe and Victory

// 3. Strategy Pattern: Calculate checkout with swappable discount strategies
const cart = new ShoppingCart(new PercentageDiscountStrategy(15)); // 15% VIP discount
cart.addProduct(laptop, 1);
cart.addProduct(mouse, 2);
cart.checkout();

console.log("\n--- Switching Discount Strategy to Bulk Threshold ($100 off over $1000) ---");
cart.setDiscountStrategy(new BulkThresholdDiscountStrategy(1000, 100));
cart.checkout();