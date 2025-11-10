import { getProducts } from "../api.js";

const productDetailsMain = document.getElementById("product-details-main");
const params = new URLSearchParams(window.location.search);

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
    <div class="products-details-container">
        <div class="product-details-info">
            <h3 class="product-details-name">${name}</h3>
            <p class="product-details-price">$${price}</p>
            <p class="product-details-category">Category: ${category}</p>
            <p class="product-details-color">Color: ${color}</p>
            <p class="product-details-frame">Frame: ${frame}</p>
            <p class="product-details-description">${description}</p>
        </div>
        <div class="product-details-button-div">
            <button class="add-to-cart-button" data-product-id="${id}" type="button">Add to cart</button>
        </div>
      </div>
    `;
};

const findProductAndRender = async () => {
  let rawResp = await getProducts();
  const products = rawResp.map((rawPr) => ({ ...rawPr, id: Number(rawPr.id) }));
  const productId = Number(params.get("id"));
  const product = products.find((p) => p.id === productId);
  renderProductDetails(product);
};

await findProductAndRender();
