import { getProductById, getProducts } from "./api.js";
const productsContainer = document.getElementById("products-container");
const typeFilter = document.getElementById("type-filter");

let allProducts = [];

const renderProducts = (data) => {
  productsContainer.innerHTML = ``;

  // Render each product
  productsContainer.innerHTML = data
    .map(
      ({ id, image, name, price, category, color, frame, description }) =>
        `
        <div class="product-card" id="${id}">
            <img class="product-image" src="${image}" alt="${name} - ${color} ${frame}" loading="lazy"/>
            <h3 class="product-name">${name}</h3>
            <p class="product-price">$${price}</p>
            <p class="product-category">Category: ${category}</p>
            <p class="product-color">Color: ${color}</p>
            <p class="product-frame">Frame: ${frame}</p>
            <p class="product-description">${description}</p>
        </div>
        `
    )
    .join("");
};

// Render products on page load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    setFade("fade-in");
    allProducts = await getProducts();
    renderProducts(allProducts);
  } catch (err) {
    console.error("Failed to load products:", err);
    productsContainer.textContent = `Failed to load products.`;
  }
});

// ----Search----
const searchInput = document.getElementById("search-input");
const clearSearchButton = document.getElementById("clear-search-button");

const setFade = (state) => {
  if (!productsContainer.classList.contains(state)) {
    productsContainer.classList.remove("fade-in", "fade-out");
    productsContainer.classList.add(state);
  }
};

const fadeTimeout = 300;

const searchProductByInput = (str) => {
  const formattedStr = str.trim().toLowerCase();

  if (formattedStr === "") {
    setFade("fade-out");
    setTimeout(() => {
      renderProducts(allProducts);
      setFade("fade-it");
    }, fadeTimeout);
    return;
  }

  const searchResult = allProducts.filter((product) =>
    Object.values(product).some((el) =>
      String(el).toLowerCase().includes(formattedStr)
    )
  );

  if (searchResult.length === 0) {
    // add fade-in animation to the message
    setFade("fade-out");
    setTimeout(() => {
      productsContainer.innerHTML = `<p class="no-result">No products match your search 😢</p>`;
      setFade("fade-in");
    }, fadeTimeout);
    return;
  }

  setFade("fade-out");
  setTimeout(() => {
    renderProducts(searchResult);
    setFade("fade-in");
  }, fadeTimeout);
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
  setFade("fade-out");
  setTimeout(() => {
    renderProducts(allProducts);
    setFade("fade-in");
  }, fadeTimeout);
});
