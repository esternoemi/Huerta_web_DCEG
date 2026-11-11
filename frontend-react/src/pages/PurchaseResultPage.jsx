import { Link, useParams } from "react-router-dom";
import { useOrders } from "../context/useOrders.js";
import { formatoCLP } from "../services/formatService.js";

export default function PurchaseResultPage() {
  const { resultado, id } = useParams();
  const { buscar, error } = useOrders();
  let errorLectura = error;
  let orden = null;

  if (!errorLectura) {
    try {
      orden = buscar(id);
    } catch (errorBusqueda) {
      errorLectura =
        errorBusqueda instanceof Error
          ? errorBusqueda.message
          : "No se pudo leer la orden.";
    }
  }

  if (errorLectura) {
    return (
      <main className="container my-5 text-center">
        <h1>No se pudo cargar la orden</h1>
        <p role="alert">{errorLectura}</p>
        <Link to="/productos" className="btn btn-success">
          Volver a productos
        </Link>
      </main>
    );
  }

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

  if (resultado !== orden.resultadoDemostracion) {
    return (
      <main className="container my-5 text-center">
        <h1>El resultado no coincide con la orden</h1>
        <p>Revisa el enlace o vuelve a tus productos.</p>
        <Link to="/productos" className="btn btn-success">
          Volver a productos
        </Link>
      </main>
    );
  }

  const compraExitosa = orden.resultadoDemostracion === "exito";

  return (
    <main className="container my-5">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="text-center">
            <h1 className={compraExitosa ? "text-success mb-3" : "text-danger mb-3"}>
              {compraExitosa ? "¡Compra registrada!" : "Compra no completada"}
            </h1>
            <p>
              {compraExitosa
                ? "Tu pedido quedó registrado."
                : "No fue posible completar la compra."}
            </p>
            <div className="alert alert-info" role="note">
              Flujo de compra demostrativo: no se procesó un pago real ni se
              envió un correo.
            </div>
          </div>

          <section aria-labelledby="datos-orden">
            <h2 id="datos-orden" className="h4">Datos de la orden</h2>
            <p><strong>Número de orden:</strong> {orden.id}</p>
            <p>
              <strong>Cliente:</strong> {orden.cliente.nombre}{" "}
              {orden.cliente.apellido}
            </p>
            <p><strong>Correo:</strong> {orden.cliente.correo}</p>
          </section>

          <section aria-labelledby="datos-entrega">
            <h2 id="datos-entrega" className="h4 mt-4">Dirección de entrega</h2>
            <p>
              {orden.entrega.calle}
              {orden.entrega.departamento
                ? `, departamento ${orden.entrega.departamento}`
                : ""}
              , {orden.entrega.comuna}, {orden.entrega.region}
            </p>
            {orden.entrega.indicaciones && (
              <p>
                <strong>Indicaciones:</strong> {orden.entrega.indicaciones}
              </p>
            )}
          </section>

          <section aria-labelledby="resumen-orden">
            <h2 id="resumen-orden" className="h4 mt-4">Resumen del pedido</h2>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Precio unitario</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orden.lineas.map((linea) => (
                    <tr key={linea.id}>
                      <td>
                        {linea.nombre}
                        {linea.unidadVenta ? ` (${linea.unidadVenta})` : ""}
                      </td>
                      <td>{formatoCLP(linea.precioUnitario)}</td>
                      <td>{linea.cantidad}</td>
                      <td>{formatoCLP(linea.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="h4 text-end">Total: {formatoCLP(orden.total)}</p>
          </section>

          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
            {compraExitosa ? (
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => window.print()}
              >
                Imprimir comprobante
              </button>
            ) : (
              <Link to="/checkout" className="btn btn-success">
                Volver a intentar
              </Link>
            )}
            <Link to="/productos" className="btn btn-outline-secondary">
              Volver a productos
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
