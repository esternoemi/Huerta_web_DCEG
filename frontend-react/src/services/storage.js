export function leerLista(clave, datosIniciales) {
  const texto = window.localStorage.getItem(clave);

  if (texto === null) {
    guardarLista(clave, datosIniciales);
    return datosIniciales;
  }

  let valor;
  try {
    valor = JSON.parse(texto);
  } catch (error) {
    throw new Error(`Los datos "${clave}" no son JSON válido.`, {
      cause: error,
    });
  }

  if (!Array.isArray(valor)) {
    throw new Error(`Los datos "${clave}" deben ser una lista.`);
  }

  return valor;
}

export function guardarLista(clave, lista) {
  if (!Array.isArray(lista)) {
    throw new TypeError(
      `No se puede guardar "${clave}": se esperaba una lista.`,
    );
  }

  window.localStorage.setItem(clave, JSON.stringify(lista));
}
