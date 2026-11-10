import { useState } from "react";
import ProductCard from "../components/catalog/ProductCard.jsx";
import { useProducts } from "../context/useProducts.js";

const ProductsPage = () => {
    const { productos, error } = useProducts();
    const [busqueda, setBusqueda] = useState("");

    const productosFiltrados = productos.filter((producto) =>
        producto.activo &&
        producto.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (
        <main className="container my-5">
            <h1 className="text-center mb-4 fs-1">
                Nuestros Productos
            </h1>

            <div className="row mb-4">
                <div className="col-md-6 mx-auto">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Buscar productos..."
                        aria-label="Buscar productos por nombre"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {!error && productosFiltrados.length === 0 && (
                <div className="alert alert-info text-center">
                    No se encontraron productos.
                </div>
            )}

            <div className="row g-4">
                {!error && productosFiltrados.map((producto) => (
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
