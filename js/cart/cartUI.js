import { cart } from "./cart.js";

let cartCountInitialized = false;

const cartItemCount = document.getElementById("cart-item-count");

export const renderCartItems = () => {
  const cartItemsDiv = document.getElementById("cart-items-div");

  cartItemsDiv.innerHTML = ``;

  cartItemsDiv.innerHTML = cart.items
    .map(
      (item) => `
        <div class="cart-item" data-cart-item-id=${item.id}>
          <div class="item-image">
            <img src="${item.image}" alt=${item.name} loading="lazy"/>
          </div>
          <div class="item-name">${item.name}</div>
          <div class="item-price">$${item.price}</div>
          <div class="item-quantity">
            <span class="qty" data-cart-item-id=${item.id} data-action="remove">-</span>
            <span>${item.quantity}</span>
            <span class="qty" data-cart-item-id=${item.id} data-action="add">+</span>
          </div>
          </div>
        </div>
        `
    )
    .join("");

  document.getElementById(
    "cart-total-price"
  ).textContent = `$${cart.getTotal()}`;
};

const animateCartItemCount = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  cartItemCount.classList.remove("updated");
  void cartItemCount.offsetWidth;
  cartItemCount.classList.add("updated");

  const onAnimationEnd = () => {
    cartItemCount.classList.remove("updated");
    cartItemCount.removeEventListener("animationend", onAnimationEnd);
  };

  cartItemCount.addEventListener("animationend", onAnimationEnd); //animation runs, only when the previous one finished
};

export const updateCartItemCount = (number, { animate = true } = {}) => {
  if (!cartCountInitialized) {
    cartItemCount.textContent = number;
    cartCountInitialized = true;
    document.body.classList.add("cart-ready");
    return;
  }

  cartItemCount.textContent = number;

  if (animate) {
    animateCartItemCount();
  }
};

export const addProductToCart = (addProductId, productsArr) => {
  const foundProduct = productsArr.find(
    (product) => product.id === addProductId
  );
  if (!foundProduct) {
    console.warn("Product by this id wasnt found", addProductId);
    return;
  }
  cart.addItem(foundProduct);
};
