import { useContext } from "react";
import { CartContext } from "./cartContext.js";

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart debe usarse dentro de CartProvider.");
  }
  return context;
}
