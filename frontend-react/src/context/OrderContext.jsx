import { useCallback, useState } from "react";
import { OrderContext } from "./orderContext.js";
import { orderService } from "../services/orderService.js";

function obtenerMensaje(error) {
  return error instanceof Error ? error.message : "Error desconocido.";
}

function cargarOrdenes() {
  try {
    return { ordenes: orderService.listar(), error: null };
  } catch (error) {
    return { ordenes: [], error: obtenerMensaje(error) };
  }
}

export function OrderProvider({ children }) {
  const [estado, setEstado] = useState(cargarOrdenes);

  const recargar = useCallback(() => {
    try {
      const ordenes = orderService.listar();
      setEstado({ ordenes, error: null });
      return ordenes;
    } catch (error) {
      setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
      throw error;
    }
  }, []);

  const buscar = useCallback((id) => orderService.buscar(id), []);

  const crear = useCallback((datosCheckout) => {
    try {
      const orden = orderService.crear(datosCheckout);
      setEstado({ ordenes: orderService.listar(), error: null });
      return orden;
    } catch (error) {
      setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
      throw error;
    }
  }, []);

  return (
    <OrderContext.Provider value={{ ...estado, recargar, buscar, crear }}>
      {children}
    </OrderContext.Provider>
  );
}
