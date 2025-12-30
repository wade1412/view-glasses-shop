import { IS_PROD } from "../config.js";

const generateOrderId = () => crypto.randomUUID?.() || `order_${Date.now()}`;

export const createOrder = async (cart) => {
  if (!cart?.items?.length) {
    throw new Error("Cart is currently empty");
  }

  const orderPayload = {
    id: generateOrderId(),
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

  if (IS_PROD) {
    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem("orders")) || [];
    } catch {
      orders = [];
    }

    orders.push(orderPayload);
    localStorage.setItem("orders", JSON.stringify(orders));
    return orderPayload;
  }

  return res.json();
};
