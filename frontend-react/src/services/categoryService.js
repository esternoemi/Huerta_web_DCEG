import { categoriasIniciales } from "../data/seedData.js";
import { productService } from "./productService.js";
import { guardarLista, leerLista } from "./storage.js";

const CLAVE = "huertaCategorias";

function leerTodas() {
  return leerLista(CLAVE, categoriasIniciales);
}

function validarCategoria(categoria) {
  if (!categoria || typeof categoria !== "object" || Array.isArray(categoria)) {
    throw new TypeError("La categoría debe ser un objeto.");
  }
  if (typeof categoria.id !== "string" || categoria.id.trim() === "") {
    throw new TypeError("La categoría debe tener un ID.");
  }
  if (
    typeof categoria.nombre !== "string" ||
    categoria.nombre.trim() === ""
  ) {
    throw new TypeError("La categoría debe tener un nombre.");
  }
}

export const categoryService = {
  listar() {
    return leerTodas();
  },

  buscar(id) {
    return leerTodas().find((categoria) => categoria.id === id) ?? null;
  },

  crear(categoria) {
    validarCategoria(categoria);
    const nuevaCategoria = {
      ...categoria,
      id: categoria.id.trim(),
      nombre: categoria.nombre.trim(),
    };
    const categorias = leerTodas();

    if (categorias.some((item) => item.id === nuevaCategoria.id)) {
      throw new Error(`Ya existe la categoría ${nuevaCategoria.id}.`);
    }

    const nuevasCategorias = [...categorias, nuevaCategoria];
    guardarLista(CLAVE, nuevasCategorias);
    return nuevaCategoria;
  },

  actualizar(id, cambios) {
    if (!cambios || typeof cambios !== "object" || Array.isArray(cambios)) {
      throw new TypeError("Los cambios de la categoría deben ser un objeto.");
    }

    const categorias = leerTodas();
    const indice = categorias.findIndex((categoria) => categoria.id === id);
    if (indice < 0) {
      throw new Error(`No existe la categoría ${id}.`);
    }

    const actualizada = { ...categorias[indice], ...cambios, id };
    validarCategoria(actualizada);
    const nuevasCategorias = categorias.map((categoria, index) =>
      index === indice ? actualizada : categoria,
    );
    guardarLista(CLAVE, nuevasCategorias);
    return actualizada;
  },

  eliminar(id) {
    const categorias = leerTodas();
    if (!categorias.some((categoria) => categoria.id === id)) {
      throw new Error(`No existe la categoría ${id}.`);
    }
    if (productService.listar().some((producto) => producto.categoriaId === id)) {
      throw new Error(
        "No se puede eliminar la categoría porque tiene productos asociados.",
      );
    }

    guardarLista(
      CLAVE,
      categorias.filter((categoria) => categoria.id !== id),
    );
  },
};
