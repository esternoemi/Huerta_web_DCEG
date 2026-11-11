import { useCallback, useState } from "react";
import { AuthContext } from "./authContext.js";
import { useUsers } from "./useUsers.js";
import { authService } from "../services/authService.js";

function obtenerMensaje(error) {
  return error instanceof Error ? error.message : "Error desconocido.";
}

function cargarSesion() {
  try {
    return { usuario: authService.leerSesion(), error: null };
  } catch (error) {
    return { usuario: null, error: obtenerMensaje(error) };
  }
}

export function AuthProvider({ children }) {
  const { crear: crearUsuario } = useUsers();
  const [estado, setEstado] = useState(cargarSesion);

  const iniciarSesion = useCallback(async (datos) => {
    const usuarioAutenticado = await authService.iniciarSesion(datos);
    setEstado({ usuario: usuarioAutenticado, error: null });
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
    try {
      authService.cerrarSesion();
      setEstado({ usuario: null, error: null });
      return true;
    } catch (error) {
      setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario: estado.usuario,
        error: estado.error,
        iniciarSesion,
        registrarCliente,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
