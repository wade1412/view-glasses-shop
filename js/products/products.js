import { getProducts } from "../api/api.js";
import { productsContainer, fadeRender } from "./productsUI.js";
import {
  addToCartWithAnimation,
  viewProductWithAnimation,
} from "./productsUI.js";

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
    fadeRender(undefined, "Products list failed to load");
  }
});

productsContainer.addEventListener("click", (event) => {
  const addBtn = event.target.closest(".add-to-cart-button");
  const viewBtn = event.target.closest(".view-product");

  if (addBtn) {
    event.preventDefault();
    event.stopPropagation();
    addToCartWithAnimation(addBtn, allProducts);
    return;
  }
  if (viewBtn) {
    viewProductWithAnimation(viewBtn);
  }
});
