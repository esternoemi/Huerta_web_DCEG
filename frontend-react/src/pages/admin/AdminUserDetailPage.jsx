import { Link, useParams } from "react-router-dom";
import { useUsers } from "../../context/useUsers.js";
import { EmptyState, PageError } from "../../components/shared/PageFeedback.jsx";

const CAMPOS = [
  ["RUN", "run"], ["Nombre", "nombre"], ["Apellido", "apellido"],
  ["Correo", "correo"], ["Rol", "rol"], ["Fecha de nacimiento", "fechaNacimiento"],
  ["Región", "region"], ["Comuna", "comuna"], ["Dirección", "direccion"], ["Teléfono", "telefono"],
];

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const { usuarios, error } = useUsers();
  if (error) return <PageError mensaje={`No se pudo cargar el perfil: ${error}`} />;
  const usuario = usuarios.find((item) => item.id === id);
  if (!usuario) return <EmptyState mensaje="No encontramos ese usuario."><div className="mt-2"><Link to="/admin/usuarios">Volver a usuarios</Link></div></EmptyState>;

  return (
    <section className="container-fluid">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">Perfil de {usuario.nombre} {usuario.apellido}</h1>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to={`/admin/usuarios/${encodeURIComponent(usuario.id)}/compras`}>Ver compras</Link>
          <Link className="btn btn-success" to={`/admin/usuarios/${encodeURIComponent(usuario.id)}/editar`}>Editar</Link>
        </div>
      </div>
      <div className="card shadow-sm"><div className="card-body">
        <dl className="row mb-0">{CAMPOS.map(([etiqueta, campo]) => (
          <div className="col-12 col-md-6 mb-3" key={campo}><dt>{etiqueta}</dt><dd className="mb-0">{usuario[campo] || "No informado"}</dd></div>
        ))}</dl>
        <p className="small text-muted mt-3 mb-0">Las contraseñas y credenciales no se muestran.</p>
      </div></div>
    </section>
  );
}
