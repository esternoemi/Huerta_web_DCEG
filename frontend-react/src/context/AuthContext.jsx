import { useCallback, useState } from "react";
import { AuthContext } from "./authContext.js";
import { useUsers } from "./useUsers.js";
import { authService } from "../services/authService.js";

export function AuthProvider({ children }) {
  const { crear: crearUsuario } = useUsers();
  const [usuario, setUsuario] = useState(() => authService.leerSesion());

  const iniciarSesion = useCallback(async (datos) => {
    const usuarioAutenticado = await authService.iniciarSesion(datos);
    setUsuario(usuarioAutenticado);
    return usuarioAutenticado;
  }, []);

  const registrarCliente = useCallback(
    (datos) => {
      if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        throw new TypeError("Los datos del registro deben ser un objeto.");
      }
      return crearUsuario({ ...datos, rol: "cliente" });
    },
    [crearUsuario],
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
