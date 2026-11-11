import { guardarLista, leerLista } from "./storage.js";

const CLAVE_MENSAJES = "huertaMensajesContacto";
const MAXIMO_NOMBRE = 100;
const MAXIMO_MENSAJE = 500;
const DOMINIOS_PERMITIDOS = new Set([
  "duoc.cl",
  "profesor.duoc.cl",
  "gmail.com",
]);
const FORMATO_CORREO =
  /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/u;

export function validarContacto(datos) {
  const errores = {};
  const formulario =
    datos && typeof datos === "object" && !Array.isArray(datos) ? datos : {};
  const nombre = typeof formulario.nombre === "string" ? formulario.nombre : "";
  const correo = typeof formulario.correo === "string" ? formulario.correo : "";
  const mensaje =
    typeof formulario.mensaje === "string" ? formulario.mensaje : "";

  if (!nombre.trim()) {
    errores.nombre = "Este campo es obligatorio.";
  } else if (!/^[\p{L}\p{M} ]+$/u.test(nombre.trim())) {
    errores.nombre = "Usa solo letras, incluidas tildes, y espacios.";
  } else if (nombre.length > MAXIMO_NOMBRE) {
    errores.nombre = `No puede superar los ${MAXIMO_NOMBRE} caracteres.`;
  }

  const correoLimpio = correo.trim();
  const dominio = correoLimpio.split("@")[1]?.toLocaleLowerCase("es");
  if (!correoLimpio) {
    errores.correo = "Ingresa tu correo electrónico.";
  } else if (
    !FORMATO_CORREO.test(correoLimpio) ||
    !DOMINIOS_PERMITIDOS.has(dominio)
  ) {
    errores.correo =
      "Usa un correo válido de duoc.cl, profesor.duoc.cl o gmail.com.";
  }

  if (!mensaje.trim()) {
    errores.mensaje = "Escribe un mensaje antes de enviar.";
  } else if (mensaje.length > MAXIMO_MENSAJE) {
    errores.mensaje =
      `El mensaje no puede superar los ${MAXIMO_MENSAJE} caracteres.`;
  }

  return errores;
}

export const contactService = {
  enviar(datos) {
    const errores = validarContacto(datos);
    if (Object.keys(errores).length > 0) {
      throw new Error(Object.values(errores)[0]);
    }

    const mensajes = leerLista(CLAVE_MENSAJES, []);
    const nuevoMensaje = {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim().toLocaleLowerCase("es"),
      mensaje: datos.mensaje.trim(),
      enviadoEn: new Date().toISOString(),
    };

    guardarLista(CLAVE_MENSAJES, [...mensajes, nuevoMensaje]);
    return nuevoMensaje;
  },
};
