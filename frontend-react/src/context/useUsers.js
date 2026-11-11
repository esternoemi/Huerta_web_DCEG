import { useContext } from "react";
import { UserContext } from "./userContext.js";

export function useUsers() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUsers debe usarse dentro de UserProvider.");
  }
  return context;
}
