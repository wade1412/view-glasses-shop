export { fadeRender };

export const productsContainer = document.getElementById("products-container");

if (!productsContainer) {
  console.error("productsContainer not found in DOM");
}

/*Product card template*/
const productCardHTML = ({
  id,
  image,
  name,
  price,
  category,
  color,
  frame,
  description,
}) =>
  `
        <div class="product-card" id="${id}">
            <div class="product-image-div">
              <img class="product-image" 
              src="${image}" 
              alt="${name} - ${color} ${frame}" 
              loading="lazy"
              />
            </div>
            <div class="product-info">
              <h3 class="product-name">${name}</h3>
              <p class="product-price">$${price}</p>
              <div class="product-types">
                <p class="product-category">Category: ${category}</p>
                <p class="product-color">Color: ${color}</p>
                <p class="product-frame">Frame: ${frame}</p>
              </div>
              <p class="product-description">${description}</p>
            </div>
            <div class="cart-view-container">
              <button 
                class="add-to-cart-button" 
                data-product-id="${id}" 
                type="button"
                data-default-label="Add to cart"
                >
                  Add to cart 
              </button>
              <a class="view-product-link" id="view-product-link" href="./productDetails.html?id=${id}">
                <p class="view-product ">View</p>
              </a>
            </div>
          </div>
        `;
/*Render functions*/
const renderProducts = (data) => {
  return data.map(productCardHTML).join("");
};

const renderMessage = (message) => `<p class="no-results">${message}</p>`;
const FADE_DURATION_MS = 325; //must match CSS .product-grid fade transition

//toggle fade class, fade-in is visible, slowly appears; fade-out - slowly dissappears;
const setFade = (state) => {
  productsContainer.classList.remove("fade-in", "fade-out");
  productsContainer.classList.add(state);
};

// render products/msg with a fade-in animation
const fadeRender = (data, message = "") => {
  if (!productsContainer) return;

  //make the products fade-out
  setFade("fade-out");

  setTimeout(() => {
    productsContainer.innerHTML = message
      ? renderMessage(message)
      : renderProducts(data);

    setFade("fade-in"); //products fade-in
  }, FADE_DURATION_MS);
};
