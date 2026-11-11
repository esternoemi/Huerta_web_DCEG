import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function AdminLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  function salir() {
    if (cerrarSesion()) navigate("/", { replace: true });
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="col-12 col-lg-2 border-end py-3">
          <p className="small text-muted">Administración · {usuario?.nombre}</p>
          <nav aria-label="Administración" className="nav flex-column gap-2">
            <NavLink to="/admin" end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Dashboard</NavLink>
            <NavLink to="/admin/ordenes" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Órdenes</NavLink>
            <NavLink to="/admin/productos" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Productos</NavLink>
            <NavLink to="/admin/categorias" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Categorías</NavLink>
            <NavLink to="/admin/usuarios" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Usuarios</NavLink>
            <NavLink to="/admin/reportes" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Reportes</NavLink>
            <NavLink to="/admin/perfil" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Perfil</NavLink>
            <Link to="/">Volver a la tienda</Link>
            <button type="button" className="btn btn-outline-success btn-sm mt-2" onClick={salir}>Cerrar sesión</button>
          </nav>
        </aside>
        <main className="col-12 col-lg-10 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
