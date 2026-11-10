import { useContext } from "react";
import { OrderContext } from "./orderContext.js";

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === null) {
    throw new Error("useOrders debe usarse dentro de OrderProvider.");
  }
  return context;
}
