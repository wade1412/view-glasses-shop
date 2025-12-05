import { fadeRender } from "./productsUI.js";
import { allProducts } from "./products.js";

const searchInput = document.getElementById("search-input");
const clearSearchButton = document.getElementById("clear-search-button");
const sortOption = document.getElementById("sort-option");
const sortIndicator = document.getElementById("sort-indicator");

//UI state

const viewState = {
  query: "",
  sortBy: "all",
  sortDirection: "ascending",
};

//------------- SEARCH&SORT HELPERS -------------//

const applySearch = (products, query) => {
  const formatted = query.trim().toLowerCase();
  if (!formatted) return products;

  return products.filter((product) => {
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(formatted)
    );
  });
};

const applySort = (productsArr, sortBy, direction = "ascending") => {
  if (!sortBy || sortBy === "all") return productsArr;

  const sortedArr = [...productsArr].sort((a, b) => {
    const rawA = a[sortBy];
    const rawB = b[sortBy];

    const valA = typeof rawA === "number" ? rawA : String(rawA).toLowerCase();
    const valB = typeof rawB === "number" ? rawB : String(rawB).toLowerCase();

    if (valA < valB) return direction === "ascending" ? -1 : 1;
    if (valA > valB) return direction === "ascending" ? 1 : -1;
    return 0;
  });

  return sortedArr;
};

//------------- UI -------------//

const updateSortIndicator = (direction) => {
  sortIndicator.classList.toggle("ascending", direction === "ascending");
  sortIndicator.classList.toggle("descending", direction === "descending");
};

const updateView = () => {
  const afterSearch = applySearch(allProducts, viewState.query);

  if (!afterSearch.length) {
    fadeRender(afterSearch, "No products match your search 😢");
    return;
  }

  const finalList = applySort(
    afterSearch,
    viewState.sortBy,
    viewState.sortDirection
  );

  fadeRender(finalList);
};

//------------- Search Events -------------//

let searchDebounce = null;

searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounce);

  searchDebounce = setTimeout(() => {
    viewState.query = searchInput.value;
    updateView();
  }, 250);
});

clearSearchButton.addEventListener("click", () => {
  viewState.query = "";
  viewState.sortBy = "all";
  viewState.sortDirection = "ascending";

  searchInput.value = "";
  sortOption.value = "all";
  updateSortIndicator(viewState.sortDirection);

  updateView();
});

//------------- Sort Events -------------//

sortIndicator.addEventListener("click", () => {
  viewState.sortDirection =
    viewState.sortDirection === "ascending" ? "descending" : "ascending";

  updateSortIndicator(viewState.sortDirection);

  viewState.sortBy = sortOption.value;

  updateView();
});

sortOption.addEventListener("change", (e) => {
  viewState.sortBy = e.target.value;
  updateView();
});
