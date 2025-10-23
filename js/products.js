import { getProductById, getProducts } from "./api.js";
const productsContainer = document.getElementById("products-container");

const renderProducts = (data) => {
  productsContainer.innerHTML = ``;

  //   Check if data is valid and has products
  if (!Array.isArray(data) || data.length === 0) {
    productsContainer.textContent = "No products found";
    return;
  }

  // Render each product
  data.forEach((product) => {
    let productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.id = product.id;
    productCard.innerHTML = `
        <img class="product-image" src="${product.image}" alt="img-${product.name}" />
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price}</p>
        <p class="product-category">Category: ${product.category}</p>
        <p class="product-color">Color: ${product.color}</p>
        <p class="product-description">${product.description}</p>
        `;
    productsContainer.appendChild(productCard);
  });
};

// Render products on page load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const productsData = await getProducts();
    renderProducts(productsData);
  } catch (err) {
    console.error("Failed to load products:", err);
    productsContainer.textContent = `Failed to load products.`;
  }
});
