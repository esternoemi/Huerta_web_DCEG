
import { Link, useParams } from "react-router-dom";
import { useOrders } from "../context/useOrders.js";

const formatoCLP = (valor) =>
    valor.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    });

const PurchaseResultPage = () => {
    const { resultado, id } = useParams();
    const { buscar } = useOrders();

    const orden = buscar(id);

    if (!orden) {
        return (
            <main className="container my-5 text-center">
                <h1>Orden no encontrada</h1>
                <p>No se encontró la compra solicitada.</p>
                <Link to="/productos" className="btn btn-success">
                    Volver a productos
                </Link>
            </main>
        );
    }

    const compraExitosa =
        orden.estado === "recibida" &&
        resultado === "exito";

    return (
        <main className="container my-5">
            <div className="card shadow-sm">
                <div className="card-body p-4 text-center">
                    <h1 className={
                        compraExitosa
                            ? "text-success mb-3"
                            : "text-danger mb-3"
                    }>
                        {compraExitosa
                            ? "¡Compra realizada exitosamente!"
                            : "Compra rechazada"}
                    </h1>

                    <p>
                        {compraExitosa
                            ? "Tu pedido fue registrado correctamente."
                            : "No fue posible completar la compra."}
                    </p>

                    <p>
                        <strong>Número de orden:</strong> {orden.id}
                    </p>

                    <p>
                        <strong>Cliente:</strong>{" "}
                        {orden.cliente.nombre} {orden.cliente.apellido}
                    </p>

                    <p>
                        <strong>Correo:</strong> {orden.cliente.correo}
                    </p>

                    <hr />

                    <h2 className="h4 mb-3">Resumen del pedido</h2>

                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orden.lineas.map((linea) => (
                                    <tr key={linea.id}>
                                        <td>{linea.nombre}</td>
                                        <td>{linea.cantidad}</td>
                                        <td>{formatoCLP(linea.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h3 className="h4 mt-3">
                        Total: {formatoCLP(orden.total)}
                    </h3>

                    <Link
                        to="/productos"
                        className="btn btn-success mt-3"
                    >
                        Volver a productos
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default PurchaseResultPage;
