function validarCarrito(carrito) {
  if (!Array.isArray(carrito)) {
    throw new TypeError("El carrito debe ser una lista.");
  }
}

function validarCantidad(cantidad) {
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw new Error("La cantidad debe ser un entero mayor que cero.");
  }
}

function validarProductoComprable(producto) {
  if (
    !producto ||
    producto.activo === false ||
    !Number.isFinite(producto.precio) ||
    producto.precio < 0 ||
    !Number.isInteger(producto.stock) ||
    producto.stock < 1
  ) {
    throw new Error("Este producto no está disponible para compra.");
  }
}

function obtenerPrecioVigente(producto) {
  return Number.isFinite(producto.precioOferta) &&
    producto.precioOferta >= 0 &&
    producto.precioOferta < producto.precio
    ? producto.precioOferta
    : producto.precio;
}

function buscarLinea(carrito, idProducto) {
  return carrito.find((linea) => linea.id === idProducto);
}

export function agregarLinea(carrito, producto, cantidad = 1) {
  validarCarrito(carrito);
  validarProductoComprable(producto);
  validarCantidad(cantidad);

  const existente = buscarLinea(carrito, producto.id);
  const cantidadFinal = (existente?.cantidad ?? 0) + cantidad;
  if (cantidadFinal > producto.stock) {
    throw new Error(`Stock insuficiente para ${producto.nombre}.`);
  }

  return existente
    ? carrito.map((linea) =>
        linea.id === producto.id
          ? { ...linea, cantidad: cantidadFinal }
          : linea,
      )
    : [...carrito, { id: producto.id, cantidad }];
}

export function cambiarCantidadLinea(carrito, producto, cantidad) {
  validarCarrito(carrito);
  validarProductoComprable(producto);
  validarCantidad(cantidad);

  if (!buscarLinea(carrito, producto.id)) {
    throw new Error(`El producto ${producto.id} no está en el carrito.`);
  }
  if (cantidad > producto.stock) {
    throw new Error(`Stock insuficiente para ${producto.nombre}.`);
  }

  return carrito.map((linea) =>
    linea.id === producto.id ? { ...linea, cantidad } : linea,
  );
}

export function quitarLinea(carrito, idProducto) {
  validarCarrito(carrito);
  return carrito.filter((linea) => linea.id !== idProducto);
}

export function vaciarCarrito() {
  return [];
}

export function calcularLineas(carrito, productos) {
  validarCarrito(carrito);
  if (!Array.isArray(productos)) {
    throw new TypeError("Los productos deben ser una lista.");
  }

  return carrito.map((linea) => {
    validarCantidad(linea.cantidad);
    const producto = productos.find((item) => item.id === linea.id);
    if (!producto) {
      throw new Error(`No existe el producto ${linea.id}.`);
    }
    validarProductoComprable(producto);
    if (linea.cantidad > producto.stock) {
      throw new Error(`Stock insuficiente para ${producto.nombre}.`);
    }

    const precioVigente = obtenerPrecioVigente(producto);
    const productoEnLinea =
      precioVigente === producto.precio
        ? producto
        : { ...producto, precio: precioVigente };

    return {
      producto: productoEnLinea,
      cantidad: linea.cantidad,
      subtotal: precioVigente * linea.cantidad,
    };
  });
}

export function calcularTotal(carrito, productos) {
  return calcularLineas(carrito, productos).reduce(
    (total, linea) => total + linea.subtotal,
    0,
  );
}

export function calcularCantidadTotal(carrito) {
  validarCarrito(carrito);
  return carrito.reduce((total, linea) => {
    validarCantidad(linea.cantidad);
    return total + linea.cantidad;
  }, 0);
}
