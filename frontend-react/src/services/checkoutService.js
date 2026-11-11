import { obtenerComunas } from "../data/ubicaciones.js";

const CAMPOS_REQUERIDOS = [
  ["nombre", "nombre"],
  ["apellido", "apellido"],
  ["correo", "correo"],
  ["calle", "calle"],
  ["region", "región"],
  ["comuna", "comuna"],
];

export function validarCheckout(formulario) {
  const errores = {};
  const datos = formulario && typeof formulario === "object" ? formulario : {};

  for (const [campo, etiqueta] of CAMPOS_REQUERIDOS) {
    if (typeof datos[campo] !== "string" || datos[campo].trim() === "") {
      errores[campo] = `El campo ${etiqueta} es obligatorio.`;
    }
  }

  if (
    typeof datos.correo === "string" &&
    datos.correo.trim() !== "" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(datos.correo.trim())
  ) {
    errores.correo = "Ingresa un correo electrónico válido.";
  }

  if (
    typeof datos.region === "string" &&
    datos.region.trim() !== "" &&
    typeof datos.comuna === "string" &&
    datos.comuna.trim() !== "" &&
    !obtenerComunas(datos.region.trim()).includes(datos.comuna.trim())
  ) {
    errores.comuna = "Selecciona una comuna perteneciente a la región.";
  }

  return errores;
}
