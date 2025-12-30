import { BASE_URL } from "../config.js";

const PRODUCTS_URL = `${BASE_URL}data/db.json`;

export async function getProducts() {
  try {
    const res = await fetch(PRODUCTS_URL);

    if (!res.ok) {
      throw new Error(`Failed to fetch products`);
    }

    const data = await res.json();

    return data.products;
  } catch (err) {
    console.error("Error while fetching products:", err);
    return []; // return empty array to prevent crashes
  }
}
