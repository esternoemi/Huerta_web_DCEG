import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function rutaInicio(usuario) {
  if (usuario?.rol === "administrador") {
    return "/admin";
  }
  if (usuario?.rol === "vendedor") {
    return "/vendedor/productos";
  }
  return "/";
}

export function RequireRole({ role }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  if (usuario.rol !== role) {
    return <Navigate to={rutaInicio(usuario)} replace />;
  }
  return <Outlet />;
}
