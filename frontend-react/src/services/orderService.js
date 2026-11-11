import { calcularLineas } from "./cartService.js";
import { validarCheckout } from "./checkoutService.js";
import { productService } from "./productService.js";
import { guardarLista, leerLista } from "./storage.js";

const CLAVE_ORDENES = "huertaOrdenesReact";
const CLAVE_CARRITO = "huertaCarrito";
const RESULTADOS = new Set(["exito", "error"]);

function leerOrdenes() {
  return leerLista(CLAVE_ORDENES, []);
}

function validarTexto(valor, campo) {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new Error(`El campo ${campo} es obligatorio.`);
  }
  return valor.trim();
}

function validarDatosCheckout(datos) {
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    throw new TypeError("Los datos del checkout deben ser un objeto.");
  }
  if (!datos.cliente || typeof datos.cliente !== "object") {
    throw new Error("Faltan los datos del cliente.");
  }
  if (!datos.entrega || typeof datos.entrega !== "object") {
    throw new Error("Faltan los datos de entrega.");
  }

  const correo = validarTexto(datos.cliente.correo, "correo");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(correo)) {
    throw new Error("El correo del cliente no es válido.");
  }

  const erroresCheckout = validarCheckout({
    nombre: datos.cliente.nombre,
    apellido: datos.cliente.apellido,
    correo,
    calle: datos.entrega.calle,
    region: datos.entrega.region,
    comuna: datos.entrega.comuna,
  });
  if (Object.keys(erroresCheckout).length > 0) {
    throw new Error(Object.values(erroresCheckout)[0]);
  }

  return {
    cliente: {
      nombre: validarTexto(datos.cliente.nombre, "nombre"),
      apellido: validarTexto(datos.cliente.apellido, "apellido"),
      correo: correo.toLocaleLowerCase("es"),
    },
    entrega: {
      calle: validarTexto(datos.entrega.calle, "calle"),
      departamento: String(datos.entrega.departamento ?? "").trim(),
      region: validarTexto(datos.entrega.region, "región"),
      comuna: validarTexto(datos.entrega.comuna, "comuna"),
      indicaciones: String(datos.entrega.indicaciones ?? "").trim(),
    },
    resultadoDemostracion: datos.resultadoDemostracion ?? "exito",
  };
}

function crearId(ordenes) {
  let id;
  do {
    id = `ORD-${new Date().getFullYear()}-${globalThis.crypto.randomUUID()}`;
  } while (ordenes.some((orden) => orden.id === id));
  return id;
}

export const orderService = {
  listar() {
    return leerOrdenes();
  },

  buscar(id) {
    return leerOrdenes().find((orden) => orden.id === id) ?? null;
  },

  crear(datosCheckout) {
    const checkout = validarDatosCheckout(datosCheckout);
    if (!RESULTADOS.has(checkout.resultadoDemostracion)) {
      throw new Error("El resultado de demostración debe ser exito o error.");
    }

    const carrito = leerLista(CLAVE_CARRITO, []);
    if (carrito.length === 0) {
      throw new Error("No se puede crear una orden con el carrito vacío.");
    }

    const lineasActuales = calcularLineas(carrito, productService.listar());
    const ordenes = leerOrdenes();
    const orden = {
      id: crearId(ordenes),
      creadoEn: new Date().toISOString(),
      estado: checkout.resultadoDemostracion === "exito" ? "recibida" : "rechazada",
      resultadoDemostracion: checkout.resultadoDemostracion,
      cliente: checkout.cliente,
      entrega: checkout.entrega,
      lineas: lineasActuales.map(({ producto, cantidad, subtotal }) => ({
        id: producto.id,
        nombre: producto.nombre,
        precioUnitario: producto.precio,
        unidadVenta: producto.unidadVenta,
        cantidad,
        subtotal,
        imagen: producto.imagen,
      })),
      total: lineasActuales.reduce((total, linea) => total + linea.subtotal, 0),
    };

    guardarLista(CLAVE_ORDENES, [...ordenes, orden]);
    return orden;
  },
};
