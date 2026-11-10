import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <header className="encabezado">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand marca" to="/">
              Huerto Hogar
            </Link>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/productos">Productos</Link>
              <Link to="/categorias">Categorías</Link>
              <Link to="/ofertas">Ofertas</Link>
              <Link to="/carrito">Carrito</Link>
              <Link to="/login">Ingresar</Link>
            </div>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="pie-pagina">
        <div className="container">Huerto Hogar</div>
      </footer>
    </>
  );
}
