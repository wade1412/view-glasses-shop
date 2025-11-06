import { cart } from "./cart.js";
import { renderCartItems, updateCartItemCount } from "./cartUI.js";

const showCartButton = document.getElementById("cart-header-button");
const body = document.querySelector("body");
const cartContainer = document.getElementById("cart-container");
const closeCartButton = document.getElementById("close-cart-button");
const clearCartButton = document.getElementById("clear-cart-button");

const removeCartItem = (id) => {
  const itemEl = document.querySelector(`[data-cart-item-id="${id}"]`);
  if (!itemEl) {
    console.warn("Item El in DOM not found");
    return;
  }

  itemEl.classList.add("cart-item--removing");
  cart.items = cart.items.filter((item) => item.id !== id);
  updateCartItemCount(cart.items.length);
  itemEl.addEventListener(
    "animationend",
    () => {
      renderCartItems();
    },
    { once: true }
  );
};

const changeProductQty = (itemProductId, qtyChange) => {
  const foundItem = cart.items.find((item) => item.id === itemProductId);
  if (!foundItem) {
    console.warn("Item by this id wasnt found", itemProductId);
    return;
  }
  if (qtyChange == "add") foundItem.quantity++;
  if (qtyChange == "remove") {
    if (foundItem.quantity <= 1) {
      removeCartItem(foundItem.id);
      return;
    }
    foundItem.quantity--;
  }
};

const clearCartItems = () => {
  const cartItemsEls = document.querySelectorAll(".cart-item");
  cartItemsEls.forEach((cartItemEl, index) => {
    cartItemEl.style.animationDelay = `${index * 60}ms`;
    cartItemEl.classList.add("cart-item--removing");
  });

  const lastCartItemEl = cartItemsEls[cartItemsEls.length - 1];
  if (!lastCartItemEl) return;

  lastCartItemEl.addEventListener(
    "animationend",
    () => {
      cart.items = [];
      updateCartItemCount(0);
      renderCartItems();
    },
    { once: true }
  );
};

//DOM listeners

cartContainer.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("qty")) {
    const itemId = Number(positionClick.getAttribute("data-cart-item-id"));
    const action = positionClick.getAttribute("data-action");
    const willRemove =
      action === "remove" &&
      cart.items.find((item) => item.id === itemId)?.quantity <= 1;
    changeProductQty(itemId, action);

    if (!willRemove) {
      updateCartItemCount(cart.items.length);
      renderCartItems();
    }
  }
});

showCartButton.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeCartButton.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

clearCartButton.addEventListener("click", () => {
  if (cart.items.length === 0) {
    body.classList.toggle("showCart");
    return;
  }

  clearCartItems();
});
