import { getProducts } from "../../api/api.js";
import { cart } from "../../cart/cart.js";
import { renderCartItems, updateCartItemCount } from "../../cart/cartUI.js";
import { productDetailsHTML, relatedProductsHTML } from "./productDetailsUI.js";
import { productDetailsState as state } from "./productDetailsUI.js";
import { addToCartWithAnimation } from "../productsUI.js";

import "../../animations.js";
import "../../cart/cartController.js";
import { initScrollReveal } from "../../animations.js";

const params = new URLSearchParams(window.location.search);
const currentProdId = Number(params.get("id"));

const productDetailsMain = document.getElementById("product-details-main");
const relatedProductsSection = document.getElementById(
  "related-products-section"
);

//-------- Load Data --------//

async function loadProductPage() {
  const raw = await getProducts();
  state.products = raw.map((p) => ({ ...p, id: Number(p.id) }));

  state.currentProduct = state.products.find((p) => p.id === currentProdId);

  if (!state.currentProduct) {
    productDetailsMain.innerHTML = `<p class="not-found">Product not found</p>`;
    return;
  }

  renderProduct();
  renderRelated();
}

const renderProduct = () => {
  productDetailsMain.innerHTML = productDetailsHTML(state.currentProduct);
};

const renderRelated = () => {
  const related = state.products
    .filter(
      (p) =>
        p.category === state.currentProduct.category && p.id !== currentProdId
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  relatedProductsSection.innerHTML = relatedProductsHTML(related);
  requestAnimationFrame(() => {
    initScrollReveal();
  });
};

//-------- Events --------//

productDetailsMain.addEventListener("click", (e) => {
  const btn = e.target.closest(".product-details-add-to-cart-button");
  const qtyBtn = e.target.closest("[data-action]");

  if (btn) handleAddToCart(btn);
  if (qtyBtn) updateQuantity(qtyBtn);
});

const updateQuantity = (target) => {
  const container = target.closest(".product-quantity");
  const display = container.querySelector(".qty-number");

  let value = Number(display.textContent);
  const action = target.dataset.action;

  if (action === "add") value++;
  if (action === "remove" && value > 1) value--;

  display.textContent = value;

  display.classList.remove("quantity-change");
  void display.offsetHeight;
  display.classList.add("quantity-change");
};

const handleAddToCart = (btn) => {
  const qty = Number(
    productDetailsMain.querySelector(".qty-number").textContent
  );
  const prod = state.currentProduct;

  cart.addItemWithQty(prod, qty);
  updateCartItemCount(cart.items.length);
  renderCartItems();

  btn.textContent = "Added!";
  btn.classList.add("added");

  setTimeout(() => {
    btn.classList.remove("added");
    btn.textContent = "Add to cart";
  }, 700);
};

loadProductPage();

relatedProductsSection.addEventListener("click", (event) => {
  const addBtn = event.target.closest(".related-add-to-cart-button");
  if (!addBtn) return;
  event.preventDefault();
  event.stopPropagation();
  addToCartWithAnimation(addBtn, state.products);
});
