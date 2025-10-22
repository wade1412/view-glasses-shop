const baseUrl = "http://localhost:4000/products";

export async function getProducts() {
  try {
    const res = await fetch(baseUrl);

    if (!res.ok) {
      throw new Error(`Failed to fetch products`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error while fetching products:", err);
    return []; // return empty array to prevent crashes
  }
}

export async function getProductById(id) {
  try {
    const res = await fetch(`${baseUrl}/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch product by id`);
    }

    const prodData = await res.json();
    return prodData;
  } catch (err) {
    console.error("Error while fetching product by id:", err);
    return null; // return null - if product not found
  }
}
