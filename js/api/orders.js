import { API_BASE } from "../api/api.js";
const ORDERS_URL = `${API_BASE}/orders`;

export const createOrder = async (cart) => {
  if (!cart?.items?.length) {
    throw new Error("Cart is currently empty");
  }

  const orderPayload = {
    items: cart.items.map(({ id, name, price, quantity }) => ({
      id,
      name,
      price,
      quantity,
    })),
    total: cart.getTotal(),
    createdAt: new Date().toISOString(),
    status: "mock-paid",
  };

  const res = await fetch(ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderPayload),
  });

  if (!res.ok) {
    throw new Error("Failed to create order");
  }

  return res.json();
};
