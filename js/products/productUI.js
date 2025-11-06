export { fadeRender };

export const productsContainer = document.getElementById("products-container");

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
