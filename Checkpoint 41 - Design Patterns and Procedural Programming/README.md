# Shopping Cart System: Procedural vs. Singleton Design Pattern

## Project Files
* `proceduralCart.js` — Initial procedural implementation relying on global state and standalone functions.
* `singletonCart.js` — Refactored implementation applying the **Singleton Pattern** with private fields (`#items`, `#instance`).

---

## Reflection Report

### Challenges Faced During the Refactor
The primary challenge during refactoring was decoupling the cart's data from the global scope while keeping the public API intuitive. In the procedural version, `cart` was a global array accessible—and modifiable—by any function or external script. Transitioning to a Singleton required enclosing the state inside private class fields (`#items`) and intercepting both `ShoppingCart.getInstance()` and direct `new ShoppingCart()` calls so duplicate cart instances could never be accidentally initialized. Additionally, moving from loose global functions to encapsulated methods meant adding input validation inside `addItem` to protect internal state integrity.

### How Using a Design Pattern Improved the Code
Applying the Singleton Pattern eliminated global namespace pollution and prevented external code from corrupting the `items` array directly (e.g., `cart = null`). All state transitions—adding, removing, viewing, and clearing items—now pass through controlled methods on a single authoritative instance. This guarantees state consistency across multiple modules or UI components while making the code easier to debug, test, and extend with future features such as discount strategies or tax calculations.

### When to Choose a Design Pattern Over Procedural Code
Procedural programming works well for small, one-off scripts, linear data transformations, or quick prototypes where shared state is minimal. However, a design pattern like Singleton, Module, or Strategy should be chosen when an application grows across multiple files, manages shared state across components, requires strict encapsulation, or demands long-term maintainability and scalability.