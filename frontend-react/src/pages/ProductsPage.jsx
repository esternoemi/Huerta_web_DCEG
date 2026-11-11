import { useState } from "react";
import ProductCard from "../components/catalog/ProductCard.jsx";
import { useProducts } from "../context/useProducts.js";
import { useCategories } from "../context/useCategories.js";

const ProductsPage = () => {
    const { productos, error } = useProducts();
    const { categorias, error: errorCategorias } = useCategories();
    const [busqueda, setBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    const productosFiltrados = productos.filter((producto) =>
        producto.activo &&
        producto.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase()) &&
        (!categoriaSeleccionada ||
            producto.categoriaId === categoriaSeleccionada)
    );

    return (
        <main className="container my-5">
            <h1 className="text-center mb-4 fs-1">
                Nuestros Productos
            </h1>

            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Buscar productos..."
                        aria-label="Buscar productos por nombre"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="filtro-categoria" className="visually-hidden">
                        Filtrar por categoría
                    </label>
                    <select
                        id="filtro-categoria"
                        className="form-select"
                        value={categoriaSeleccionada}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        aria-label="Filtrar productos por categoría"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {(error || errorCategorias) && (
                <div className="alert alert-danger" role="alert">
                    {error || errorCategorias}
                </div>
            )}

            {!error && !errorCategorias && productosFiltrados.length === 0 && (
                <div className="alert alert-info text-center">
                    No se encontraron productos.
                </div>
            )}

            <div className="row g-4">
                {!error && !errorCategorias && productosFiltrados.map((producto) => (
                    <div
                        className="col-12 col-md-6 col-lg-4"
                        key={producto.id}
                    >
                        <ProductCard product={producto} />
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ProductsPage;
