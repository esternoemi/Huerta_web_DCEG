import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { CartContext } from "./cartContext.js";
import { useProducts } from "./useProducts.js";
import { productService } from "../services/productService.js";
import {
  agregarLinea,
  calcularCantidadTotal,
  calcularLineas,
  cambiarCantidadLinea,
  quitarLinea,
  vaciarCarrito,
} from "../services/cartService.js";
import { guardarLista, leerLista } from "../services/storage.js";

const CLAVE = "huertaCarrito";

function obtenerMensaje(error) {
  return error instanceof Error ? error.message : "Error desconocido.";
}

function cargarCarrito() {
  try {
    const carrito = leerLista(CLAVE, []);
    const productos = productService.listar();
    return {
      carrito,
      lineas: calcularLineas(carrito, productos),
      error: null,
      errorCarga: false,
    };
  } catch (error) {
    return {
      carrito: [],
      lineas: [],
      error: obtenerMensaje(error),
      errorCarga: true,
    };
  }
}

export function CartProvider({ children }) {
  const { productos, error: errorProductos } = useProducts();
  const [estado, setEstado] = useState(cargarCarrito);

  useEffect(() => {
    if (estado.errorCarga) {
      return;
    }

    if (errorProductos) {
      setEstado((actual) => ({ ...actual, error: errorProductos }));
      return;
    }

    try {
      const lineas = calcularLineas(estado.carrito, productos);
      setEstado((actual) => ({ ...actual, lineas, error: null }));
    } catch (error) {
      setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
    }
  }, [estado.carrito, estado.errorCarga, errorProductos, productos]);

  const guardarCarritoActualizado = useCallback((carrito) => {
    try {
      const productos = productService.listar();
      const lineas = calcularLineas(carrito, productos);
      guardarLista(CLAVE, carrito);
      setEstado({
        carrito,
        lineas,
        error: null,
        errorCarga: false,
      });
      return lineas;
    } catch (error) {
      setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
      throw error;
    }
  }, []);

  const agregar = useCallback(
    (id, cantidad) => {
      try {
        if (estado.errorCarga) {
          throw new Error(estado.error);
        }

        const producto = productService.buscar(id);
        const carrito = agregarLinea(estado.carrito, producto, cantidad);
        guardarCarritoActualizado(carrito);
      } catch (error) {
        setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
        throw error;
      }
    },
    [estado, guardarCarritoActualizado],
  );

  const cambiarCantidad = useCallback(
    (id, cantidad) => {
      try {
        if (estado.errorCarga) {
          throw new Error(estado.error);
        }

        const producto = productService.buscar(id);
        const carrito = cambiarCantidadLinea(
          estado.carrito,
          producto,
          cantidad,
        );
        guardarCarritoActualizado(carrito);
      } catch (error) {
        setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
        throw error;
      }
    },
    [estado, guardarCarritoActualizado],
  );

  const quitar = useCallback(
    (id) => {
      try {
        if (estado.errorCarga) {
          throw new Error(estado.error);
        }
        guardarCarritoActualizado(quitarLinea(estado.carrito, id));
      } catch (error) {
        setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
        throw error;
      }
    },
    [estado, guardarCarritoActualizado],
  );

  const vaciar = useCallback(() => {
    guardarCarritoActualizado(vaciarCarrito());
  }, [guardarCarritoActualizado]);

  const cantidadTotal = estado.lineas.length
    ? calcularCantidadTotal(estado.carrito)
    : 0;
  const total = estado.lineas.reduce((suma, linea) => suma + linea.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        lineas: estado.lineas,
        cantidadTotal,
        total,
        error: estado.error,
        agregar,
        cambiarCantidad,
        quitar,
        vaciar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
