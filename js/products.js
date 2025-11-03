import { getProductById, getProducts } from "./api.js";
import { cart } from "./cart/cart.js";
import { renderCartItems } from "./cart/cartUI.js";

const productsContainer = document.getElementById("products-container");

let rawResp = [];
let allProducts = [];

const renderProducts = (data) => {
  productsContainer.innerHTML = ``;

  // Render each product
  productsContainer.innerHTML = data
    .map(
      ({ id, image, name, price, category, color, frame, description }) =>
        `
        <div class="product-card" id="${id}">
            <div class="product-image-div">
            <img class="product-image" src="${image}" alt="${name} - ${color} ${frame}" loading="lazy"/>
            </div>
            <h3 class="product-name">${name}</h3>
            <p class="product-price">$${price}</p>
            <p class="product-category">Category: ${category}</p>
            <p class="product-color">Color: ${color}</p>
            <p class="product-frame">Frame: ${frame}</p>
            <p class="product-description">${description}</p>
            <div class="cart-view-container">
            <button class="add-to-cart-button" data-product-id="${id}" type="button">Add to cart</button>
            <a class="view-product-link" id="view-product-link"><p class="view-product ">View</p></a></div>
          </div>
        `
    )
    .join("");
};

//toggle fade class, fade-in is visible, slowly appears; fade-out - slowly dissappears;
const setFade = (state) => {
  if (!productsContainer.classList.contains(state)) {
    productsContainer.classList.remove("fade-in", "fade-out");
    productsContainer.classList.add(state);
  }
};

const fadeTimeout = 325;

// render products/msg with a fade-in animation
const fadeRender = (data, message) => {
  //make the products fade-out
  setFade("fade-out");

  setTimeout(() => {
    if (message) {
      productsContainer.innerHTML = `<p class="no-result">${message}</p>`;
    } else {
      renderProducts(data);
    }
    setFade("fade-in"); //products fade-in
  }, fadeTimeout);
};

// Render products on page load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    setFade("fade-in");
    rawResp = await getProducts();
    allProducts = rawResp.map((rawPr) => ({ ...rawPr, id: Number(rawPr.id) }));
    fadeRender(allProducts);
  } catch (err) {
    console.error("Failed to load products:", err);
    productsContainer.textContent = `Failed to load products.`;
  }
});

// ----Search Functionality----
const searchInput = document.getElementById("search-input");
const clearSearchButton = document.getElementById("clear-search-button");

const searchProductByInput = (str) => {
  const formattedStr = str.trim().toLowerCase();

  if (formattedStr === "") return fadeRender(allProducts);

  const searchResult = allProducts.filter((product) =>
    Object.values(product).some((el) =>
      String(el).toLowerCase().includes(formattedStr)
    )
  );

  if (searchResult.length === 0)
    return fadeRender(null, "No products match your search 😢");

  fadeRender(searchResult);
};

let debounce;

searchInput.addEventListener("input", () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    let inpVal = searchInput.value;
    searchProductByInput(inpVal);
  }, 250);
});

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  sortOption.value = "all";
  state.sortBy = "all";
  state.sortDirection = "ascending";
  updateSortIndicator(state.sortDirection);
  fadeRender(allProducts);
});

//----Sort Functionality----//
const sortOption = document.getElementById("sort-option");
const sortIndicator = document.getElementById("sort-indicator");

// sorting direction state obj, ascending by def
const state = {
  sortBy: null,
  sortDirection: "ascending",
};

const sortProducts = (optionValue, productsArr, direction = "ascending") => {
  if (optionValue === "all") return productsArr;

  const sortedArr = [...productsArr].sort((a, b) => {
    const valA =
      typeof a[optionValue] === "number"
        ? a[optionValue]
        : a[optionValue].toLowerCase();
    const valB =
      typeof a[optionValue] === "number"
        ? b[optionValue]
        : b[optionValue].toLowerCase();

    if (valA < valB) return direction === "ascending" ? -1 : 1; // check direction, sort based on the direction
    if (valA > valB) return direction === "ascending" ? 1 : -1;

    return 0;
  });

  return sortedArr;
};

const updateSortIndicator = (direction) => {
  if (direction === "ascending") {
    sortIndicator.classList.remove("descending");
    sortIndicator.classList.add("ascending");
  } else {
    sortIndicator.classList.remove("ascending");
    sortIndicator.classList.add("descending");
  }
};

const renderSortedProducts = () => {
  const sortedProducts = sortProducts(
    state.sortBy,
    allProducts,
    state.sortDirection
  );
  fadeRender(sortedProducts);
};

sortIndicator.addEventListener("click", () => {
  state.sortDirection =
    state.sortDirection === "ascending" ? "descending" : "ascending";

  updateSortIndicator(state.sortDirection);

  state.sortBy = sortOption.value;
  renderSortedProducts();
});

sortOption.addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  renderSortedProducts();
});

// Cart Functionality

const showCartButton = document.getElementById("cart-header-button");
const body = document.querySelector("body");
const cartContainer = document.getElementById("cart-container");
const closeCartButton = document.getElementById("close-cart-button");
const clearCartButton = document.getElementById("clear-cart-button");

showCartButton.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeCartButton.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

clearCartButton.addEventListener("click", () => {
  cart.items = [];
  renderCartItems();
});

const addProductToCart = (addProductId, productsArr) => {
  const foundProduct = productsArr.find(
    (product) => product.id === addProductId
  );
  if (!foundProduct) {
    console.warn("Product by this id wasnt found", addProductId);
    return;
  }
  cart.addItem(foundProduct);
};

const changeProductQty = (itemProductId, qtyChange) => {
  const foundItem = cart.items.find((item) => item.id === itemProductId);
  if (!foundItem) {
    console.warn("Item by this id wasnt found", itemProductId);
    return;
  }
  if (qtyChange == "add") foundItem.quantity++;
  if (qtyChange == "remove") {
    foundItem.quantity--;
    if (foundItem.quantity <= 0) {
      const itemIndex = cart.items.indexOf(foundItem);
      if (itemIndex > -1) cart.items.splice(itemIndex, 1);
    }
  }
};

productsContainer.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("add-to-cart-button")) {
    const prodId = Number(positionClick.getAttribute("data-product-id"));
    addProductToCart(prodId, allProducts);
    renderCartItems();
  }
});

cartContainer.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("qty")) {
    const itemId = Number(positionClick.getAttribute("data-cart-item-id"));
    changeProductQty(itemId, positionClick.getAttribute("data-action"));
    renderCartItems();
  }
});
