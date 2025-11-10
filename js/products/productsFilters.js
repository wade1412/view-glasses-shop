import { fadeRender } from "./productsUI.js";
import { allProducts } from "./products.js";

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

let debounce = 250;

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
