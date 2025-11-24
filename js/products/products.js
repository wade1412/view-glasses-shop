import { getProductById, getProducts } from "../api.js";
import { productsContainer, fadeRender } from "./productsUI.js";
import { cart } from "../cart/cart.js";
import {
  renderCartItems,
  addProductToCart,
  updateCartItemCount,
} from "../cart/cartUI.js";
import "./productsFilters.js";
import "../cart/cartController.js";

export let allProducts = [];

// Render products on page load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    let rawResp = await getProducts();
    allProducts = rawResp.map((rawPr) => ({ ...rawPr, id: Number(rawPr.id) }));
    fadeRender(allProducts);
  } catch (err) {
    console.error("Failed to load products:", err);
  }
});

const viewProductWithAnimation = (target) => {
  target.classList.add("added");
  setTimeout(() => {
    target.classList.remove("added");
  }, 700);
};

const addToCartWithAnimation = (target) => {
  const prodId = Number(target.getAttribute("data-product-id"));
  addProductToCart(prodId, allProducts);
  updateCartItemCount(cart.items.length);
  renderCartItems();

  target.classList.add("added");
  target.textContent = "Added!";

  setTimeout(() => {
    target.classList.remove("added");
    target.textContent = "Add to cart";
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
