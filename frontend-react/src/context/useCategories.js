import { useContext } from "react";
import { CategoryContext } from "./categoryContext.js";

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === null) {
    throw new Error("useCategories debe usarse dentro de CategoryProvider.");
  }
  return context;
}
