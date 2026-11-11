import { userService } from "./userService.js";

const CLAVE_SESION = "huertaSesionReact";
const ROLES = new Set(["cliente", "vendedor", "administrador"]);

function validarPerfil(usuario) {
  if (
    !usuario ||
    typeof usuario !== "object" ||
    typeof usuario.id !== "string" ||
    typeof usuario.correo !== "string" ||
    !ROLES.has(usuario.rol)
  ) {
    throw new Error("La sesión guardada no contiene un perfil válido.");
  }
  return usuario;
}

export const authService = {
  guardarSesion(usuario) {
    validarPerfil(usuario);
    window.sessionStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    return usuario;
  },

  leerSesion() {
    const texto = window.sessionStorage.getItem(CLAVE_SESION);
    if (texto === null) {
      return null;
    }

    let usuario;
    try {
      usuario = JSON.parse(texto);
    } catch (error) {
      throw new Error("La sesión guardada no es JSON válido.", {
        cause: error,
      });
    }
    return validarPerfil(usuario);
  },

  async iniciarSesion(datos) {
    if (
      !datos ||
      typeof datos.correo !== "string" ||
      typeof datos.contrasena !== "string"
    ) {
      throw new TypeError("Debes ingresar correo y contraseña.");
    }

    const usuario = await userService.autenticar(
      datos.correo,
      datos.contrasena,
    );
    if (!usuario) {
      throw new Error("El correo o la contraseña no son correctos.");
    }

    return this.guardarSesion(usuario);
  },

  cerrarSesion() {
    window.sessionStorage.removeItem(CLAVE_SESION);
  },
};
