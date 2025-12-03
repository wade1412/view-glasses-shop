import { getProducts } from "../api.js";
import { revealOnPageLoad } from "../animations.js";
import "../cart/cartController.js";
import { cart } from "../cart/cart.js";
import { renderCartItems, updateCartItemCount } from "../cart/cartUI.js";

document.addEventListener("DOMContentLoaded", revealOnPageLoad);

const params = new URLSearchParams(window.location.search);
const currentProdId = Number(params.get("id"));
const productDetailsMain = document.getElementById("product-details-main");
const relatedProductsSection = document.getElementById(
  "related-products-section"
);

let products = [];

const renderProductDetails = ({
  id,
  image,
  name,
  price,
  category,
  color,
  frame,
  description,
}) => {
  productDetailsMain.innerHTML = `
    <div class="product-details-image">
        <img src="${image}" alt="${name} - ${color} ${frame}" loading="lazy"/>
    </div>
    <div class="product-details-container">
        <section class="product-details-section">
            <h3 class="product-details-name">${name}</h3>
            <p class="product-details-price">$${price}</p>
            <p class="product-details-category">Category: ${category}</p>
            <p class="product-details-color">Color: ${color}</p>
            <p class="product-details-frame">Frame: ${frame}</p>
            <p class="product-details-description">${description}</p>
        </section>
        <div class="product-details-button-div">
            <button class="product-details-add-to-cart-button" data-product-id="${id}" type="button">Add to cart</button>
            <div class="product-quantity">
              <span class="product-qty" data-product-id=${id} data-action="remove">-</span>
              <span id="qty-number">1</span>
              <span class="product-qty" data-product-id=${id} data-action="add">+</span>
            </div>
        </div>
      </div>
    `;
};

const findProductAndRender = async () => {
  let rawResp = await getProducts();
  products = rawResp.map((rawPr) => ({ ...rawPr, id: Number(rawPr.id) }));
  const product = products.find((p) => p.id === currentProdId);
  if (!product) {
    productDetailsMain.innerHTML = "<p>Product not found</p>";
    return;
  }
  renderProductDetails(product);
};

const renderRelatedProducts = () => {
  const foundProduct = products.find((prod) => prod.id === currentProdId);
  let related = products
    .filter(
      (prod) =>
        prod.category === foundProduct.category && prod.id !== currentProdId
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  relatedProductsSection.innerHTML = `
  <h3>You might also  like</h3>
  <div class="related-grid">
    ${related
      .map(
        (product) => `
        <a class="related-card-wrapper" href="./productDetails.html?id=${product.id}">
          <div class="related-card">
            <div class="related-card-img-container">
            <img src="${product.image}" /></div>
            <p>${product.name}</p>
            <span>$${product.price}</span>
          </div>
        </a>
        `
      )
      .join("")}
  </div>
  `;
};

await findProductAndRender();
requestAnimationFrame(() => {
  animateFadeIn(productDetailsMain, 50);
  animateFadeIn(relatedProductsSection, 150);
});
renderRelatedProducts();
requestAnimationFrame(() => observeCards());

const addProductQtyToCart = (prodId, prodQty, prodArr) => {
  const foundProduct = prodArr.find((prod) => prod.id === prodId);
  if (!foundProduct) {
    console.warn("Product by this ID not found");
    return;
  }
  cart.addItemWithQty(foundProduct, prodQty);
};

const addCurrentProductToCart = (target) => {
  const currentQty = Number(document.getElementById("qty-number").textContent);
  const currentProdId = Number(target.dataset.productId);

  addProductQtyToCart(currentProdId, currentQty, products);
  updateCartItemCount(cart.items.length);
  renderCartItems();

  target.classList.add("added");
  target.textContent = "Added!";

  setTimeout(() => {
    target.classList.remove("added");
    target.textContent = "Add to cart";
  }, 700);
};

const updateQty = (target) => {
  const productQtyElement = document.getElementById("qty-number");
  let qtyNumber = Number(productQtyElement.textContent);
  const qtyAction = target.dataset.action;
  if (qtyAction === "add") qtyNumber++;
  if (qtyAction === "remove" && qtyNumber > 1) qtyNumber--;

  productQtyElement.classList.remove("quantity-change");
  void productQtyElement.offsetWidth;
  productQtyElement.classList.add("quantity-change");

  productQtyElement.addEventListener(
    "animationend",
    () => {
      productQtyElement.classList.remove("quantity-change");
    },
    { once: true }
  );

  productQtyElement.textContent = qtyNumber;
};

const animateFadeIn = (element, timeout = 0) => {
  setTimeout(() => element.classList.add("slide-in"), timeout);
};

productDetailsMain.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("product-details-add-to-cart-button")) {
    addCurrentProductToCart(target);
  }
  if (target.classList.contains("product-qty")) {
    updateQty(target);
  }
});

const observeCards = () => {
  const cards = document.querySelectorAll(".related-card-wrapper");
  if (!cards || cards.length === 0) {
    console.warn("observeCards: no cards found");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  cards.forEach((card) => observer.observe(card));
};
