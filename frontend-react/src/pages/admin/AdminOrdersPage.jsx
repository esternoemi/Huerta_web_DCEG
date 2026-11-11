import { Link } from "react-router-dom";
import { useOrders } from "../../context/useOrders.js";
import { formatoCLP } from "../../services/formatService.js";
import { EmptyState, PageError } from "../../components/shared/PageFeedback.jsx";

export default function AdminOrdersPage() {
  const { ordenes, error } = useOrders();
  const recientes = [...ordenes].sort(
    (a, b) => new Date(b.creadoEn) - new Date(a.creadoEn),
  );

  return (
    <section className="container-fluid">
      <h1 className="h3 mb-3">Órdenes</h1>
      <p className="text-muted">
        Compras registradas en esta demostración local.
      </p>
      {error && <PageError mensaje={`No se pudieron cargar las órdenes: ${error}`} />}
      {!error && recientes.length === 0 && (
        <EmptyState mensaje="Aún no hay órdenes registradas. Cuando se confirme una compra, aparecerá aquí." />
      )}
      {!error && recientes.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Orden</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Resultado</th>
                    <th>Total</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {recientes.map((orden) => (
                    <tr key={orden.id}>
                      <td>{orden.id}</td>
                      <td>{new Date(orden.creadoEn).toLocaleString("es-CL")}</td>
                      <td>{orden.cliente.nombre} {orden.cliente.apellido}</td>
                      <td>
                        <span className={`badge ${orden.resultadoDemostracion === "exito" ? "text-bg-success" : "text-bg-secondary"}`}>
                          {orden.resultadoDemostracion === "exito" ? "Aprobada (demo)" : "Rechazada (demo)"}
                        </span>
                      </td>
                      <td>{formatoCLP(orden.total)}</td>
                      <td>
                        <Link className="btn btn-sm btn-outline-success" to={`/admin/ordenes/${encodeURIComponent(orden.id)}`}>
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
