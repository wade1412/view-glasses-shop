export const productDetailsState = {
  products: [],
  currentProduct: null,
};

export const productDetailsHTML = ({
  name,
  id,
  image,
  color,
  frame,
  price,
  category,
  description,
}) => `
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
              <span id="qty-number" class="qty-number">1</span>
              <span class="product-qty" data-product-id=${id} data-action="add">+</span>
            </div>
        </div>
      </div>
    `;

export const relatedProductsHTML = (items) => `
<h3 class="reveal" data-reveal="scroll">You might also like</h3>
<div class="related-grid">
  ${items
    .map(
      (p, index) => `
      <a 
        class="related-card-wrapper reveal"
        data-reveal="scroll"
        style="--reveal-order: ${index * 2}s"
        href="./productDetails.html?id=${p.id}">
        
        <div class="related-card">
            <div class="related-card-img-container">
              <img src="${p.image}" />
            </div>
            <div class="related-card-text">
                <p>${p.name}</p>
                <span>$${p.price}</span>
            </div>
        </div>

      </a>
    `
    )
    .join("")}
</div>
`;
