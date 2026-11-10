import { useContext } from "react";
import { ProductContext } from "./productContext.js";

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === null) {
    throw new Error("useProducts debe usarse dentro de ProductProvider.");
  }
  return context;
}
