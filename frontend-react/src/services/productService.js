import { productosIniciales } from "../data/seedData.js";
import { guardarLista, leerLista } from "./storage.js";

const CLAVE = "huertaProductos";

function leerTodos() {
  return leerLista(CLAVE, productosIniciales);
}

function guardarTodos(productos) {
  guardarLista(CLAVE, productos);
}

function validarProducto(producto) {
  if (!producto || typeof producto !== "object" || Array.isArray(producto)) {
    throw new TypeError("El producto debe ser un objeto.");
  }
  if (typeof producto.id !== "string" || producto.id.trim() === "") {
    throw new TypeError("El producto debe tener un ID.");
  }
  if (typeof producto.nombre !== "string" || producto.nombre.trim() === "") {
    throw new TypeError("El producto debe tener un nombre.");
  }
  if (
    typeof producto.categoriaId !== "string" ||
    producto.categoriaId.trim() === ""
  ) {
    throw new TypeError("El producto debe tener una categoría.");
  }
  if (
    producto.precio !== null &&
    (!Number.isFinite(producto.precio) || producto.precio < 0)
  ) {
    throw new TypeError("El precio debe ser un número no negativo o null.");
  }
  if (!Number.isInteger(producto.stock) || producto.stock < 0) {
    throw new TypeError("El stock debe ser un entero no negativo.");
  }
  if (typeof producto.activo !== "boolean") {
    throw new TypeError("El estado activo del producto debe ser booleano.");
  }
  if (typeof producto.proximo !== "boolean") {
    throw new TypeError("El estado Próximamente debe ser booleano.");
  }
  if (producto.precio === null && !producto.proximo) {
    throw new Error("Un producto sin precio debe estar marcado Próximamente.");
  }
  if (
    producto.proximo &&
    (producto.precio !== null || producto.stock !== 0)
  ) {
    throw new Error(
      "Un producto Próximamente debe tener precio null y stock cero.",
    );
  }
  if (
    producto.precioOferta !== null &&
    (!Number.isFinite(producto.precioOferta) ||
      producto.precio === null ||
      producto.precioOferta < 0 ||
      producto.precioOferta >= producto.precio)
  ) {
    throw new TypeError(
      "El precio de oferta debe ser menor que el precio normal.",
    );
  }
}

export const productService = {
  listar() {
    return leerTodos();
  },

  buscar(id) {
    return leerTodos().find((producto) => producto.id === id) ?? null;
  },

  crear(producto) {
    validarProducto(producto);
    const productos = leerTodos();

    if (productos.some((item) => item.id === producto.id)) {
      throw new Error(`Ya existe el producto ${producto.id}.`);
    }

    guardarTodos([...productos, producto]);
    return producto;
  },

  actualizar(id, cambios) {
    if (!cambios || typeof cambios !== "object" || Array.isArray(cambios)) {
      throw new TypeError("Los cambios del producto deben ser un objeto.");
    }

    const productos = leerTodos();
    const indice = productos.findIndex((producto) => producto.id === id);
    if (indice < 0) {
      throw new Error(`No existe el producto ${id}.`);
    }

    const actualizado = { ...productos[indice], ...cambios, id };
    validarProducto(actualizado);
    guardarTodos(
      productos.map((producto, index) =>
        index === indice ? actualizado : producto,
      ),
    );
    return actualizado;
  },

  eliminar(id) {
    const productos = leerTodos();
    if (!productos.some((producto) => producto.id === id)) {
      throw new Error(`No existe el producto ${id}.`);
    }

    guardarTodos(productos.filter((producto) => producto.id !== id));
  },
};
