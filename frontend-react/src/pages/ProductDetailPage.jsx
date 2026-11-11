
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProducts } from "../context/useProducts.js";
import { useCart } from "../context/useCart.js";

const ProductDetailPage = () => {
    const { id } = useParams();
    const { productos, error: errorProductos } = useProducts();
    const { agregar } = useCart();

    const [cantidad, setCantidad] = useState(1);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const producto = productos.find(
        (item) => String(item.id) === id && item.activo
    );

    const formatoCLP = (valor) =>
        valor.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
        });

    if (errorProductos) {
        return (
            <main className="container my-5">
                <div className="alert alert-danger" role="alert">
                    {errorProductos}
                </div>
                <Link to="/productos" className="btn btn-outline-success">
                    Volver a productos
                </Link>
            </main>
        );
    }

    if (!producto) {
        return (
            <main className="container my-5 text-center">
                <h1>Producto no encontrado</h1>
                <p>El producto solicitado no existe o no está disponible.</p>
                <Link to="/productos" className="btn btn-success">
                    Volver a productos
                </Link>
            </main>
        );
    }

    const comprable =
        producto.activo &&
        !producto.proximo &&
        Number.isFinite(producto.precio) &&
        producto.stock > 0;

    const tieneOferta =
        Number.isFinite(producto.precioOferta) &&
        Number.isFinite(producto.precio) &&
        producto.precioOferta < producto.precio;

    const agregarAlCarrito = () => {
        setMensaje("");
        setError("");

        if (!Number.isInteger(cantidad) || cantidad < 1) {
            setError("Ingresa una cantidad válida.");
            return;
        }

        if (cantidad > producto.stock) {
            setError("La cantidad supera el stock disponible.");
            return;
        }

        try {
            agregar(producto.id, cantidad);
            setMensaje("Producto agregado al carrito.");
        } catch (err) {
            setError(err.message || "No se pudo agregar el producto.");
        }
    };

    return (
        <main className="container my-5">
            <Link
                to="/productos"
                className="btn btn-outline-secondary mb-4"
            >
                Volver a productos
            </Link>

            <div className="row g-5">
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm p-3">
                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="img-fluid"
                            style={{
                                maxHeight: "400px",
                                width: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <h1 className="mb-3">{producto.nombre}</h1>

                    <p className="lead">{producto.descripcion}</p>

                    {producto.proximo || producto.precio === null ? (
                        <p className="text-warning fw-bold fs-4">
                            Próximamente
                        </p>
                    ) : (
                        <>
                            {tieneOferta ? (
                                <>
                                    <p className="text-muted text-decoration-line-through">
                                        {formatoCLP(producto.precio)}
                                    </p>
                                    <p className="text-danger fw-bold fs-3">
                                        {formatoCLP(producto.precioOferta)}
                                    </p>
                                </>
                            ) : (
                                <p className="text-success fw-bold fs-3">
                                    {formatoCLP(producto.precio)}
                                </p>
                            )}

                            <p>
                                <strong>Unidad de venta:</strong>{" "}
                                {producto.unidadVenta}
                            </p>
                        </>
                    )}

                    <p>
                        <strong>Origen:</strong> {producto.origen}
                    </p>

                    <p>
                        <strong>Disponibilidad:</strong>{" "}
                        {producto.stock > 0
                            ? `${producto.stock} ${producto.unidadStock}`
                            : "Sin stock"}
                    </p>

                    {comprable && (
                        <div className="mb-3">
                            <label
                                htmlFor="cantidad"
                                className="form-label fw-bold"
                            >
                                Cantidad
                            </label>

                            <input
                                id="cantidad"
                                type="number"
                                min="1"
                                max={producto.stock}
                                step="1"
                                className="form-control"
                                style={{ maxWidth: "150px" }}
                                value={cantidad}
                                onChange={(e) => {
                                    setCantidad(Number(e.target.value));
                                    setMensaje("");
                                    setError("");
                                }}
                            />
                        </div>
                    )}

                    <button
                        type="button"
                        className="btn btn-success btn-lg"
                        disabled={!comprable}
                        onClick={agregarAlCarrito}
                    >
                        Agregar al carrito
                    </button>

                    {mensaje && (
                        <div className="alert alert-success mt-3" role="status">
                            {mensaje}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="mt-4">
                        <Link to="/carrito" className="btn btn-outline-success">
                            Ver carrito
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetailPage;
