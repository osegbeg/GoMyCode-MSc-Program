# Online Shopping Cart System — Iterative Refactoring & Design Patterns

## Repository Structure (Iterative Progression)
* `iterations/v1-messy-cart.js` — Initial rough implementation containing code smells.
* `iterations/v2-clean-refactored.js` — First refactoring pass applying clean code practices without patterns.
* `src/` — Final modular ES Module architecture integrating **Builder**, **Strategy**, and **Observer** patterns.

---

## Summary Report

### 1. What Changes Were Made and Why
* **Iteration 1 → Iteration 2 (Code Smell Removal):** Eliminated global state (`var arr`), dead code blocks (`if (false)`), cryptic identifiers (`a, b, c, d, t`), and magic numbers (`0.075`, `0.2`). Extracted single-purpose methods (`calculateSubtotal()`, `applyTax()`, `printReceipt()`) and removed duplicated line-item math.
* **Iteration 2 → Iteration 3 (Pattern Integration):** Split the single file into cohesive ES modules (`models/`, `patterns/`, `services/`) and replaced hardcoded `if/else` discount branches with polymorphic discount strategies, fluent product construction, and event-driven price-drop alerts.

### 2. How Clean Code Principles Were Followed
* **Single Responsibility Principle (SRP):** `Product` manages product state and price observers, `ProductBuilder` handles object assembly, `DiscountStrategy` classes encapsulate pricing rules, and `ShoppingCart` coordinates checkout totals.
* **DRY (Don't Repeat Yourself):** Line-item totals and tax calculations were centralized into single reusable methods rather than repeated across loops.
* **Meaningful Naming & Encapsulation:** Private fields (`#price`, `#observers`) prevent external state corruption, and named constants (`TAX_RATE`) make business rules self-documenting.

### 3. How Design Patterns Improved the Design
* **Builder Pattern (`ProductBuilder`):** Eliminated telescoping constructor arguments when creating products with optional attributes (warranty, category, gift wrap).
* **Strategy Pattern (`DiscountStrategy`):** Satisfied the Open/Closed Principle—new promotions (percentage, bulk threshold, seasonal coupons) can be added or swapped at runtime without modifying `ShoppingCart`.
* **Observer Pattern (`Product` → `Customer`):** Decoupled price updates from customer notification logic, allowing any number of users to subscribe to or unsubscribe from price-drop alerts dynamically.