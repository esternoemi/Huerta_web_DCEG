export function formatoCLP(valor) {
  if (!Number.isFinite(valor)) {
    throw new TypeError("El precio debe ser un número finito.");
  }

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}
