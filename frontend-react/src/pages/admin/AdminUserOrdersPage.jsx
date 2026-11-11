import { Link, useParams } from "react-router-dom";
import { useUsers } from "../../context/useUsers.js";
import { useOrders } from "../../context/useOrders.js";
import { formatoCLP } from "../../services/formatService.js";
import { EmptyState, PageError } from "../../components/shared/PageFeedback.jsx";

export default function AdminUserOrdersPage() {
  const { id } = useParams();
  const { usuarios, error: errorUsuarios } = useUsers();
  const { ordenes, error: errorOrdenes } = useOrders();
  const usuario = usuarios.find((item) => item.id === id);
  const error = errorUsuarios || errorOrdenes;

  if (error) return <PageError mensaje={`No se pudo cargar el historial: ${error}`} />;
  if (!usuario) return <EmptyState mensaje="No encontramos ese usuario."><div className="mt-2"><Link to="/admin/usuarios">Volver a usuarios</Link></div></EmptyState>;
  const compras = ordenes.filter((orden) => orden.cliente.correo.toLowerCase() === usuario.correo.toLowerCase()).sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));

  return (
    <section className="container-fluid">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div><h1 className="h3 mb-1">Compras de {usuario.nombre} {usuario.apellido}</h1><p className="text-muted mb-0">Se relacionan por correo guardado en la orden.</p></div>
        <Link className="btn btn-outline-secondary" to={`/admin/usuarios/${encodeURIComponent(usuario.id)}`}>Volver al perfil</Link>
      </div>
      {compras.length === 0 ? <EmptyState mensaje="Este usuario aún no tiene órdenes asociadas." /> : (
        <div className="card shadow-sm"><div className="card-body"><div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead><tr><th>Orden</th><th>Fecha</th><th>Resultado</th><th>Total</th><th>Acción</th></tr></thead>
            <tbody>{compras.map((orden) => (
              <tr key={orden.id}><td>{orden.id}</td><td>{new Date(orden.creadoEn).toLocaleString("es-CL")}</td><td>{orden.resultadoDemostracion === "exito" ? "Aprobada (demo)" : "Rechazada (demo)"}</td><td>{formatoCLP(orden.total)}</td><td><Link className="btn btn-sm btn-outline-success" to={`/admin/ordenes/${encodeURIComponent(orden.id)}`}>Ver orden</Link></td></tr>
            ))}</tbody>
          </table>
        </div></div></div>
      )}
    </section>
  );
}
