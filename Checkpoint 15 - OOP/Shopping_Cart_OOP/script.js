// 1. The Classes (The Blueprint)
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

class ShoppingCartItem {
    constructor(product, quantity = 0) {
        this.product = product;
        this.quantity = quantity;
    }
    calculateTotalPrice() {
        return this.product.price * this.quantity;
    }
}

class ShoppingCart {
    constructor() {
        this.items = [];
    }

    // Add or Update item method
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push(new ShoppingCartItem(product, quantity));
        }
    }

    // Remove item method
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    // Calculate Grand Total method
    getTotalPrice() {
        return this.items.reduce((sum, item) => sum + item.calculateTotalPrice(), 0);
    }
}

// 2. Initialize Data and create a new Instance
const myCart = new ShoppingCart();
// Define products based on the HTML
const products = [
    new Product(1, "Baskets", 100),
    new Product(2, "Socks", 20),
    new Product(3, "Bag", 50)
];

// 3. where I connect the DOM to the objects
const cards = document.querySelectorAll(".card");
const totalDisplay = document.querySelector(".total");

cards.forEach((card, index) => {
    const product = products[index];
    const quantityDisplay = card.querySelector(".quantity");
    const plusBtn = card.querySelector(".fa-plus-circle");
    const minusBtn = card.querySelector(".fa-minus-circle");
    const trashBtn = card.querySelector(".fa-trash-alt");

    // Add(+) Logic
    plusBtn.addEventListener("click", () => {
        myCart.addItem(product, 1);
        updateUI(quantityDisplay, product);
    });

    // Minus(-) Logic
    minusBtn.addEventListener("click", () => {
        const item = myCart.items.find(i => i.product.id === product.id);
        if (item && item.quantity > 0) {
            item.quantity--;
            updateUI(quantityDisplay, product);
        }
    });

    // Trash Logic
    trashBtn.addEventListener("click", () => {
        myCart.removeItem(product.id);
        quantityDisplay.innerHTML = 0;
        updateUI(quantityDisplay, product);
    });
});

// Helper to update the DOM
function updateUI(quantityElement, product) {
    const item = myCart.items.find(i => i.product.id === product.id);
    quantityElement.innerHTML = item ? item.quantity : 0;
    totalDisplay.innerHTML = `${myCart.getTotalPrice()} $`;
}

// Separate Heart Logic
document.querySelectorAll(".fa-heart").forEach(heart => {
    heart.addEventListener("click", function() {
        this.style.color = (this.style.color === "red") ? "" : "red";
    });
});