import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
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
  const [menuAbierto, setMenuAbierto] = useState(false);

  const claseEnlace = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  function manejarCierreSesion() {
    if (cerrarSesion()) {
      navigate("/", { replace: true });
    }
  }

  return (
    <>
      <header className="encabezado">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand marca" to="/">
              Huerto Hogar
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              aria-controls="menu-principal"
              aria-expanded={menuAbierto}
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuAbierto((abierto) => !abierto)}
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              id="menu-principal"
              className={`collapse navbar-collapse${menuAbierto ? " show" : ""}`}
            >
              <div className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
                <NavLink className={claseEnlace} to="/productos" onClick={() => setMenuAbierto(false)}>Productos</NavLink>
                <NavLink className={claseEnlace} to="/categorias" onClick={() => setMenuAbierto(false)}>Categorías</NavLink>
                <NavLink className={claseEnlace} to="/ofertas" onClick={() => setMenuAbierto(false)}>Ofertas</NavLink>
                <NavLink className={claseEnlace} to="/nosotros" onClick={() => setMenuAbierto(false)}>Nosotros</NavLink>
                <NavLink className={claseEnlace} to="/blogs" onClick={() => setMenuAbierto(false)}>Blogs</NavLink>
                <NavLink className={claseEnlace} to="/contacto" onClick={() => setMenuAbierto(false)}>Contacto</NavLink>
                <NavLink
                  className={claseEnlace}
                  to="/carrito"
                  aria-label={`Carrito de compras, ${cantidadTotal} productos`}
                  onClick={() => setMenuAbierto(false)}
                >
                  Carrito <span className="badge text-bg-success">{cantidadTotal}</span>
                </NavLink>
                {usuario ? (
                  <>
                    <span className="nav-link text-nowrap">
                      Hola, {usuario.nombre}
                    </span>
                    {obtenerRutaPanel(usuario.rol) && (
                      <NavLink
                        className={claseEnlace}
                        to={obtenerRutaPanel(usuario.rol)}
                        onClick={() => setMenuAbierto(false)}
                      >
                        Mi panel
                      </NavLink>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm ms-lg-2"
                      onClick={() => {
                        setMenuAbierto(false);
                        manejarCierreSesion();
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <NavLink className={claseEnlace} to="/login" onClick={() => setMenuAbierto(false)}>Ingresar</NavLink>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div>
        <Outlet />
      </div>
      <footer className="pie-pagina">
        <div className="container">Huerto Hogar</div>
      </footer>
    </>
  );
}
