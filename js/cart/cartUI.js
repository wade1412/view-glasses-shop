import { cart } from "./cart.js";

export const renderCartItems = () => {
  const cartItemsDiv = document.getElementById("cart-items-div");

  cartItemsDiv.innerHTML = ``;

  cartItemsDiv.innerHTML = cart.items
    .map(
      (item) => `
        <div class="cart-item" id=${item.id}>
          <div class="item-image">
            <img src="${item.image}" alt=${item.name} loading="lazy"/>
          </div>
          <div class="item-name">${item.name}</div>
          <div class="item-price">$${item.price}</div>
          <div class="item-quantity">
            <span><</span>
            <span>${item.quantity}</span>
            <span>></span>
          </div>
        </div>
        `
    )
    .join("");

  document.getElementById(
    "cart-total-price"
  ).textContent = `$${cart.getTotal()}`;
};
