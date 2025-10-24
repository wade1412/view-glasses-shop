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

const fadeTimeout = 325;

// render products/msg with a fade-in animation
const fadeRender = (data, message) => {
  setFade("fade-out");

  setTimeout(() => {
    if (message) {
      productsContainer.innerHTML = `<p class="no-result">${message}</p>`;
    } else {
      renderProducts(data);
    }
    setFade("fade-in");
  }, fadeTimeout);
};

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
  fadeRender(allProducts);
});

//----Sort----//
const sortOption = document.getElementById("sort-option");

let sortDirection = "ascending"; // ascending order of the sort by default

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

sortOption.addEventListener("change", (e) => {
  const selectedValue = e.target.value;

  console.log(sortDirection);

  const sortedProducts = sortProducts(
    selectedValue,
    allProducts,
    sortDirection
  );
  renderProducts(sortedProducts);
});
