import { useCallback, useState } from "react";
import { ProductContext } from "./productContext.js";
import { productService } from "../services/productService.js";

function obtenerMensaje(error) {
  return error instanceof Error ? error.message : "Error desconocido.";
}

function cargarProductos() {
  try {
    return { productos: productService.listar(), error: null };
  } catch (error) {
    return { productos: [], error: obtenerMensaje(error) };
  }
}

export function ProductProvider({ children }) {
  const [estado, setEstado] = useState(cargarProductos);

  const recargar = useCallback(() => {
    try {
      const productos = productService.listar();
      setEstado({ productos, error: null });
      return productos;
    } catch (error) {
      setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
      throw error;
    }
  }, []);

  const crear = useCallback((producto) => {
    const creado = productService.crear(producto);
    setEstado({ productos: productService.listar(), error: null });
    return creado;
  }, []);

  const actualizar = useCallback((id, cambios) => {
    const actualizado = productService.actualizar(id, cambios);
    setEstado({ productos: productService.listar(), error: null });
    return actualizado;
  }, []);

  const eliminar = useCallback((id) => {
    productService.eliminar(id);
    setEstado({ productos: productService.listar(), error: null });
  }, []);

  return (
    <ProductContext.Provider
      value={{ ...estado, recargar, crear, actualizar, eliminar }}
    >
      {children}
    </ProductContext.Provider>
  );
}
