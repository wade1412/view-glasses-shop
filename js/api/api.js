const PRODUCTS_URL = "../../data/db.json";

export async function getProducts() {
  try {
    const res = await fetch(PRODUCTS_URL);
    console.log("fetched fine");
    if (!res.ok) {
      throw new Error(`Failed to fetch products`);
    }

    const data = await res.json();
    console.log(data);
    return Array.isArray(data.products) ? data.products : [];
  } catch (err) {
    console.error("Error while fetching products:", err);
    return []; // return empty array to prevent crashes
  }
}
