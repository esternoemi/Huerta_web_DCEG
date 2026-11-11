import { formatoCLP } from "../../services/formatService.js";

export default function OrderDetails({ orden }) {
  return (
    <>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">Datos del cliente</h2>
          <p>
            <strong>Nombre:</strong> {orden.cliente.nombre}{" "}
            {orden.cliente.apellido}
          </p>
          <p className="mb-0">
            <strong>Correo:</strong> {orden.cliente.correo}
          </p>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">Entrega</h2>
          <p>
            {orden.entrega.calle}
            {orden.entrega.departamento
              ? `, departamento ${orden.entrega.departamento}`
              : ""}
            , {orden.entrega.comuna}, {orden.entrega.region}
          </p>
          {orden.entrega.indicaciones && (
            <p className="mb-0">
              <strong>Indicaciones:</strong> {orden.entrega.indicaciones}
            </p>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5">Productos de la orden</h2>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
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
              <tfoot>
                <tr>
                  <th colSpan="3" className="text-end">Total</th>
                  <th>{formatoCLP(orden.total)}</th>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="small text-muted mb-0">
            Valores guardados en la orden de demostración; no son un cobro real.
          </p>
        </div>
      </div>
    </>
  );
}
