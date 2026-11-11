import { Link } from "react-router-dom";
import { useUsers } from "../../context/useUsers.js";
import { useAuth } from "../../context/useAuth.js";
import { EmptyState, PageError } from "../../components/shared/PageFeedback.jsx";

export default function AdminUsersPage() {
  const { usuarios, error } = useUsers();
  const { usuario: actual } = useAuth();

  if (error) return <PageError mensaje={`No se pudieron cargar los usuarios: ${error}`} />;

  return (
    <section className="container-fluid">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div><h1 className="h3 mb-1">Usuarios</h1><p className="text-muted mb-0">Perfiles de demostración; no se muestran contraseñas.</p></div>
        <Link className="btn btn-success" to="/admin/usuarios/nuevo">Nuevo usuario</Link>
      </div>
      {usuarios.length === 0 ? <EmptyState mensaje="Aún no hay usuarios registrados en este navegador." /> : (
        <div className="card shadow-sm"><div className="card-body"><div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
            <tbody>{usuarios.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre} {item.apellido}{item.id === actual?.id ? " (tú)" : ""}</td>
                <td>{item.correo}</td><td><span className="badge text-bg-secondary">{item.rol}</span></td>
                <td className="d-flex flex-wrap gap-2">
                  <Link className="btn btn-sm btn-outline-success" to={`/admin/usuarios/${encodeURIComponent(item.id)}`}>Ver</Link>
                  <Link className="btn btn-sm btn-outline-primary" to={`/admin/usuarios/${encodeURIComponent(item.id)}/editar`}>Editar</Link>
                  <Link className="btn btn-sm btn-outline-secondary" to={`/admin/usuarios/${encodeURIComponent(item.id)}/compras`}>Compras</Link>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div></div></div>
      )}
    </section>
  );
}
