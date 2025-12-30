export const IS_PROD = location.hostname !== "localhost";
export const BASE_URL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/view-glasses-shop/";
export const BASE_PATH = import.meta.env?.BASE_URL || "/view-glasses-shop/";
