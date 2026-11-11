import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function VendorLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  function salir() {
    if (cerrarSesion()) navigate("/", { replace: true });
  }

  return (
    <>
      <header className="encabezado">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2 py-3">
          <Link to="/" className="navbar-brand marca">Huerto Hogar</Link>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="text-muted">Panel de vendedor · {usuario?.nombre}</span>
            <button type="button" className="btn btn-outline-success btn-sm" onClick={salir}>Cerrar sesión</button>
          </div>
        </div>
      </header>
      <div className="container my-4">
        <nav aria-label="Vendedor" className="nav nav-pills gap-2 mb-4">
          <NavLink to="/vendedor/productos" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Productos</NavLink>
          <NavLink to="/vendedor/ordenes" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Órdenes</NavLink>
          <Link to="/" className="nav-link">Volver a la tienda</Link>
        </nav>
        <Outlet />
      </div>
    </>
  );
}
