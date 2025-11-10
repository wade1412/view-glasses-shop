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

productsContainer.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (!positionClick.classList.contains("add-to-cart-button")) return;

  const prodId = Number(positionClick.getAttribute("data-product-id"));
  addProductToCart(prodId, allProducts);
  updateCartItemCount(cart.items.length);
  renderCartItems();

  positionClick.classList.add("added");
  positionClick.textContent = "Added!";

  setTimeout(() => {
    positionClick.classList.remove("added");
    positionClick.textContent = "Add to cart";
  }, 700);
});
