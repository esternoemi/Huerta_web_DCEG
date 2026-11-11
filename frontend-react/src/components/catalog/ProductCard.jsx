
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/useCart.js";

const ProductCard = ({ product }) => {
    const { agregar } = useCart();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const comprable =
        product.activo &&
        !product.proximo &&
        Number.isFinite(product.precio) &&
        product.stock > 0;

    const tieneOferta =
        Number.isFinite(product.precioOferta) &&
        product.precioOferta < product.precio;

    const formatoCLP = (valor) =>
        valor.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
        });

    const agregarAlCarrito = () => {
        setMensaje("");
        setError("");

        try {
            agregar(product.id, 1);
            setMensaje("Producto agregado al carrito.");
        } catch (err) {
            setError(err.message || "No se pudo agregar el producto.");
        }
    };

    return (
        <div className="card h-100 shadow-sm">
            <img
                src={product.imagen}
                className="card-img-top"
                alt={product.nombre}
                style={{ height: "250px", objectFit: "contain" }}
            />

            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.nombre}</h5>

                <p className="card-text">{product.descripcion}</p>

                {product.proximo || product.precio === null ? (
                    <p className="text-warning fw-bold">
                        Próximamente
                    </p>
                ) : (
                    <>
                        {tieneOferta ? (
                            <div>
                                <p className="text-decoration-line-through text-muted mb-1">
                                    {formatoCLP(product.precio)}
                                </p>
                                <p className="text-danger fw-bold">
                                    {formatoCLP(product.precioOferta)}
                                </p>
                            </div>
                        ) : (
                            <p className="fw-bold">
                                {formatoCLP(product.precio)}
                            </p>
                        )}

                        <p className="text-muted">
                            {product.unidadVenta}
                        </p>
                    </>
                )}

                {product.stock === 0 && !product.proximo && (
                    <p className="text-danger">Sin stock</p>
                )}

                <Link
                    to={`/productos/${encodeURIComponent(product.id)}`}
                    className="btn btn-outline-success mt-auto"
                >
                    Ver detalle
                </Link>

                <button
                    type="button"
                    className="btn btn-success mt-2"
                    disabled={!comprable}
                    onClick={agregarAlCarrito}
                >
                    Agregar al carrito
                </button>

                {mensaje && (
                    <p className="text-success mt-2" role="status">
                        {mensaje}
                    </p>
                )}

                {error && (
                    <p className="text-danger mt-2" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
