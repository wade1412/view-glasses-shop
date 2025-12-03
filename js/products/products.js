import { getProducts } from "../api.js";
import { productsContainer, fadeRender } from "./productsUI.js";
import { cart } from "../cart/cart.js";
import {
  renderCartItems,
  addProductToCart,
  updateCartItemCount,
} from "../cart/cartUI.js";
import "./productsFilters.js";
import "../cart/cartController.js";
import "../animations.js";

export let allProducts = [];

// Render products on page load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    let rawResp = await getProducts();
    allProducts = rawResp.map((rawPr) => ({ ...rawPr, id: Number(rawPr.id) }));
    fadeRender(allProducts);
  } catch (err) {
    console.error("Failed to load products:", err);
    productsContainer.innerHTML = `
      <p class="no-results">We couldn't load products. Please try again later</p>
    `;
  }
});

const viewProductWithAnimation = (target) => {
  target.classList.add("added");
  setTimeout(() => {
    target.classList.remove("added");
  }, 700);
};

const addToCartWithAnimation = (button) => {
  const prodId = Number(button.getAttribute("data-product-id"));
  if (!prodId) return;

  button.disabled = true;

  addProductToCart(prodId, allProducts);
  updateCartItemCount(cart.items.length);
  renderCartItems();

  const defaultLabel = button.dataset.defaultLabel || "Add to cart";

  button.classList.add("added");
  button.textContent = "Added!";

  setTimeout(() => {
    button.classList.remove("added");
    button.textContent = defaultLabel;
    button.disabled = false;
  }, 700);
};

productsContainer.addEventListener("click", (event) => {
  let positionClick = event.target;

  if (positionClick.classList.contains("add-to-cart-button")) {
    addToCartWithAnimation(positionClick);
  }
  if (positionClick.classList.contains("view-product")) {
    viewProductWithAnimation(positionClick);
  }

  return;
});
