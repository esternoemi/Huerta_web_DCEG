import { useCallback, useState } from "react";
import { CategoryContext } from "./categoryContext.js";
import { categoryService } from "../services/categoryService.js";

function obtenerMensaje(error) {
  return error instanceof Error ? error.message : "Error desconocido.";
}

function cargarCategorias() {
  try {
    return { categorias: categoryService.listar(), error: null };
  } catch (error) {
    return { categorias: [], error: obtenerMensaje(error) };
  }
}

export function CategoryProvider({ children }) {
  const [estado, setEstado] = useState(cargarCategorias);

  const recargar = useCallback(() => {
    try {
      const categorias = categoryService.listar();
      setEstado({ categorias, error: null });
      return categorias;
    } catch (error) {
      setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
      throw error;
    }
  }, []);

  const crear = useCallback((categoria) => {
    const creada = categoryService.crear(categoria);
    setEstado({ categorias: categoryService.listar(), error: null });
    return creada;
  }, []);

  const actualizar = useCallback((id, cambios) => {
    const actualizada = categoryService.actualizar(id, cambios);
    setEstado({ categorias: categoryService.listar(), error: null });
    return actualizada;
  }, []);

  const eliminar = useCallback((id) => {
    categoryService.eliminar(id);
    setEstado({ categorias: categoryService.listar(), error: null });
  }, []);

  return (
    <CategoryContext.Provider
      value={{ ...estado, recargar, crear, actualizar, eliminar }}
    >
      {children}
    </CategoryContext.Provider>
  );
}
