import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="col-12 col-lg-2 border-end py-3">
          <nav aria-label="Administración" className="nav flex-column gap-2">
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/ordenes">Órdenes</Link>
            <Link to="/admin/productos">Productos</Link>
            <Link to="/admin/categorias">Categorías</Link>
            <Link to="/admin/usuarios">Usuarios</Link>
            <Link to="/admin/reportes">Reportes</Link>
            <Link to="/admin/perfil">Perfil</Link>
            <Link to="/">Volver a la tienda</Link>
          </nav>
        </aside>
        <main className="col-12 col-lg-10 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
