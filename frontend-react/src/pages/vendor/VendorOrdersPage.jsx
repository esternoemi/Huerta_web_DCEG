import { Link } from "react-router-dom";
import { useOrders } from "../../context/useOrders.js";
import { formatoCLP } from "../../services/formatService.js";
import { EmptyState, PageError } from "../../components/shared/PageFeedback.jsx";

export default function VendorOrdersPage() {
  const { ordenes, error } = useOrders();
  const recientes = [...ordenes].sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));
  if (error) return <PageError mensaje={`No se pudieron cargar las órdenes: ${error}`} />;

  return (
    <section className="container my-5">
      <h1 className="h3 mb-2">Consulta de órdenes</h1>
      <p className="text-muted mb-4">Vista de solo lectura; los resultados son demostrativos.</p>
      {recientes.length === 0 ? <EmptyState mensaje="Aún no hay órdenes registradas." /> : (
        <div className="card shadow-sm"><div className="card-body"><div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead><tr><th>Orden</th><th>Fecha</th><th>Cliente</th><th>Resultado</th><th>Total</th><th>Detalle</th></tr></thead>
            <tbody>{recientes.map((orden) => (
              <tr key={orden.id}><td>{orden.id}</td><td>{new Date(orden.creadoEn).toLocaleString("es-CL")}</td><td>{orden.cliente.nombre} {orden.cliente.apellido}</td><td>{orden.resultadoDemostracion === "exito" ? "Aprobada (demo)" : "Rechazada (demo)"}</td><td>{formatoCLP(orden.total)}</td><td><Link className="btn btn-sm btn-outline-success" to={`/vendedor/ordenes/${encodeURIComponent(orden.id)}`}>Ver detalle</Link></td></tr>
            ))}</tbody>
          </table>
        </div></div></div>
      )}
    </section>
  );
}
