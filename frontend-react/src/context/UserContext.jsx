import { useCallback, useState } from "react";
import { UserContext } from "./userContext.js";
import { userService } from "../services/userService.js";

function obtenerMensaje(error) {
  return error instanceof Error ? error.message : "Error desconocido.";
}

function cargarUsuarios() {
  try {
    return { usuarios: userService.listar(), error: null };
  } catch (error) {
    return { usuarios: [], error: obtenerMensaje(error) };
  }
}

export function UserProvider({ children }) {
  const [estado, setEstado] = useState(cargarUsuarios);

  const recargar = useCallback(() => {
    try {
      const usuarios = userService.listar();
      setEstado({ usuarios, error: null });
      return usuarios;
    } catch (error) {
      setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
      throw error;
    }
  }, []);

  const crear = useCallback(async (datos) => {
    try {
      const usuario = await userService.crear(datos);
      setEstado({ usuarios: userService.listar(), error: null });
      return usuario;
    } catch (error) {
      setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
      throw error;
    }
  }, []);

  const actualizar = useCallback(async (id, datos) => {
    try {
      const usuario = await userService.actualizar(id, datos);
      setEstado({ usuarios: userService.listar(), error: null });
      return usuario;
    } catch (error) {
      setEstado((actual) => ({ ...actual, error: obtenerMensaje(error) }));
      throw error;
    }
  }, []);

  return (
    <UserContext.Provider value={{ ...estado, recargar, crear, actualizar }}>
      {children}
    </UserContext.Provider>
  );
}
