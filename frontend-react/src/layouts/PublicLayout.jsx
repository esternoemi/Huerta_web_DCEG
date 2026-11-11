import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { useCart } from "../context/useCart.js";

function obtenerRutaPanel(rol) {
  if (rol === "administrador") {
    return "/admin";
  }
  if (rol === "vendedor") {
    return "/vendedor/productos";
  }
  return null;
}

export default function PublicLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const { cantidadTotal } = useCart();
  const navigate = useNavigate();

  function manejarCierreSesion() {
    cerrarSesion();
    navigate("/", { replace: true });
  }

  return (
    <>
      <header className="encabezado">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand marca" to="/">
              Huerto Hogar
            </Link>
            <div className="d-flex flex-wrap align-items-center gap-3">
              <Link to="/productos">Productos</Link>
              <Link to="/categorias">Categorías</Link>
              <Link to="/ofertas">Ofertas</Link>
              <Link
                to="/carrito"
                aria-label={`Carrito de compras, ${cantidadTotal} productos`}
              >
                Carrito <span className="badge text-bg-success">{cantidadTotal}</span>
              </Link>
              {usuario ? (
                <>
                  <span className="text-nowrap">
                    Hola, {usuario.nombre}
                  </span>
                  {obtenerRutaPanel(usuario.rol) && (
                    <Link to={obtenerRutaPanel(usuario.rol)}>Mi panel</Link>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={manejarCierreSesion}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link to="/login">Ingresar</Link>
              )}
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
