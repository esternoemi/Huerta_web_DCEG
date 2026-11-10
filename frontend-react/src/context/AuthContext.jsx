import { useCallback, useState } from "react";
import { AuthContext } from "./authContext.js";
import { authService } from "../services/authService.js";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => authService.leerSesion());

  const iniciarSesion = useCallback(async (datos) => {
    const usuarioAutenticado = await authService.iniciarSesion(datos);
    setUsuario(usuarioAutenticado);
    return usuarioAutenticado;
  }, []);

  const registrarCliente = useCallback(
    (datos) => authService.registrarCliente(datos),
    [],
  );

  const cerrarSesion = useCallback(() => {
    authService.cerrarSesion();
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ usuario, iniciarSesion, registrarCliente, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}
