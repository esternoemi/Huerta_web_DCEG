import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart.js";

const formatoCLP = (valor) =>
    valor.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    });

const CartPage = () => {
    const {
        lineas,
        total,
        error,
        cambiarCantidad,
        quitar,
        vaciar,
    } = useCart();

    const [errorLocal, setErrorLocal] = useState("");

    const actualizarCantidad = (id, valor) => {
        setErrorLocal("");

        const cantidad = Number(valor);

        try {
            cambiarCantidad(id, cantidad);
        } catch (err) {
            setErrorLocal(err.message);
        }
    };

    const eliminarProducto = (id) => {
        setErrorLocal("");

        try {
            quitar(id);
        } catch (err) {
            setErrorLocal(err.message);
        }
    };

    const limpiarCarrito = () => {
        setErrorLocal("");

        try {
            vaciar();
        } catch (err) {
            setErrorLocal(err.message);
        }
    };

    return (
        <main className="container my-5">
            <h1 className="text-center mb-4 fs-1">
                Carrito de Compras
            </h1>

            {(errorLocal || error) && (
                <div className="alert alert-danger" role="alert">
                    {errorLocal || error}
                </div>
            )}

            {lineas.length === 0 ? (
                <div className="text-center py-5">
                    <h2>Tu carrito está vacío 🛒</h2>

                    <p className="text-muted">
                        Todavía no has agregado productos.
                    </p>

                    <Link
                        to="/productos"
                        className="btn btn-success"
                    >
                        Ver productos
                    </Link>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio unitario</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lineas.map((linea) => (
                                    <tr key={linea.producto.id}>
                                        <td>
                                            {linea.producto.nombre}
                                        </td>

                                        <td>
                                            {formatoCLP(linea.producto.precio)}
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                max={linea.producto.stock}
                                                value={linea.cantidad}
                                                onChange={(e) =>
                                                    actualizarCantidad(
                                                        linea.producto.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="form-control"
                                                style={{ width: "90px" }}
                                                aria-label={`Cantidad de ${linea.producto.nombre}`}
                                            />
                                        </td>

                                        <td>
                                            {formatoCLP(linea.subtotal)}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    eliminarProducto(
                                                        linea.producto.id
                                                    )
                                                }
                                            >
                                                Quitar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-end">
                            Total: {formatoCLP(total)}
                        </h3>

                        <div className="d-flex flex-wrap justify-content-end gap-2">
                            <Link
                                to="/productos"
                                className="btn btn-outline-success"
                            >
                                Seguir comprando
                            </Link>

                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={limpiarCarrito}
                            >
                                Vaciar carrito
                            </button>

                            <Link
                                to="/checkout"
                                className="btn btn-success"
                            >
                                Continuar compra
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};

export default CartPage;
