export const cart = {
  items: [],

  addItem(product) {
    const existingProduct = this.items.find((item) => item.id === product.id);
    //check if cart has this product

    if (existingProduct) {
      existingProduct.quantity += product.quantity || 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.saveState();
  },

  updateQuantity(id, qty) {
    const item = this.items.find((item) => item.id === id);
    if (item) item.quantity = qty;
    this.saveState();
  },

  getTotal() {
    return this.items.reduce((sum, el) => sum + el.price * el.quantity, 0);
  },

  saveState() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  },

  loadState() {
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
  },
};
