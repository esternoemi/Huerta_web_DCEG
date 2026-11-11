const claveCarritoLocal = "huertaCarrito";

function leerCarrito() {
    try {
        const contenido = localStorage.getItem(claveCarritoLocal);
        const carrito = contenido ? JSON.parse(contenido) : [];

        return Array.isArray(carrito)
            ? carrito.filter((item) => typeof item.id === "string" && Number.isInteger(item.cantidad) && item.cantidad > 0)
            : [];
    } catch {
        return [];
    }
}

function formatoPrecio(valor) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(valor);
}

function mostrarMensajeCarrito(texto, tipo = "info") {
    const mensaje = document.getElementById("mensaje-carrito");

    if (mensaje) {
        mensaje.textContent = texto;
        mensaje.className = `alert alert-${tipo}`;
    }
}

function actualizarContadorCarrito(carrito = leerCarrito()) {
    const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);

    document.querySelectorAll("[data-contador-carrito]").forEach((enlace) => {
        enlace.textContent = `Carrito (${cantidad})`;
        enlace.setAttribute("aria-label", `Carrito de compras, ${cantidad} productos`);
    });
}

function guardarCarrito(carrito) {
    localStorage.setItem(claveCarritoLocal, JSON.stringify(carrito));
    actualizarContadorCarrito(carrito);
    renderizarCarrito();
}

function agregarProductoAlCarrito(idProducto, cantidadIngresada = 1) {
    const producto = productos[idProducto];
    const stock = producto ? obtenerStockDisponible(producto) : 0;
    const cantidad = Number(cantidadIngresada);

    if (!producto || !Number.isFinite(producto.precioNumero) || stock < 1) {
        mostrarMensajeCarrito("Este producto no está disponible para compra.", "warning");
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
        mostrarMensajeCarrito("Ingresa una cantidad entera mayor que cero.", "warning");
        return;
    }

    try {
        const carrito = leerCarrito();
        const itemExistente = carrito.find((item) => item.id === idProducto);
        const nuevaCantidad = (itemExistente?.cantidad || 0) + cantidad;

        if (nuevaCantidad > stock) {
            mostrarMensajeCarrito(`Solo hay ${stock} unidades disponibles de ${producto.nombre}.`, "warning");
            return;
        }

        if (itemExistente) {
            itemExistente.cantidad = nuevaCantidad;
        } else {
            carrito.push({ id: idProducto, cantidad });
        }

        guardarCarrito(carrito);
        mostrarMensajeCarrito(`${producto.nombre} se agregó al carrito.`, "success");
    } catch {
        mostrarMensajeCarrito("No se pudo guardar el carrito en este navegador.", "danger");
    }
}

function crearLineaCarrito(item) {
    const producto = productos[item.id];
    const stock = obtenerStockDisponible(producto);
    const articulo = document.createElement("article");
    const fila = document.createElement("div");
    const columnaImagen = document.createElement("div");
    const imagen = document.createElement("img");
    const columnaDetalle = document.createElement("div");
    const nombre = document.createElement("h2");
    const precio = document.createElement("p");
    const etiquetaUnidad = document.createElement("label");
    const cantidad = document.createElement("input");
    const errorCantidad = document.createElement("p");
    const columnaSubtotal = document.createElement("div");
    const subtotal = document.createElement("strong");
    const quitar = document.createElement("button");

    articulo.className = "panel item-carrito mb-3";
    fila.className = "row g-3 align-items-center";
    columnaImagen.className = "col-4 col-md-3";
    imagen.src = obtenerRutaImagen(producto);
    imagen.alt = producto.nombre;
    columnaImagen.append(imagen);
    columnaDetalle.className = "col-8 col-md-5";
    nombre.className = "h5 mb-2";
    nombre.textContent = producto.nombre;
    precio.className = "precio mb-3";
    precio.textContent = formatoPrecio(producto.precioNumero);
    etiquetaUnidad.className = "form-label mb-1";
    etiquetaUnidad.textContent = "Cantidad";
    etiquetaUnidad.htmlFor = `cantidad-${item.id}`;
    cantidad.className = "form-control cantidad-carrito";
    cantidad.id = `cantidad-${item.id}`;
    cantidad.type = "number";
    cantidad.min = "1";
    cantidad.max = String(stock);
    cantidad.step = "1";
    cantidad.value = String(item.cantidad);
    cantidad.dataset.productoId = item.id;
    cantidad.setAttribute("aria-label", `Cantidad de ${producto.nombre}`);
    errorCantidad.className = "form-text";
    errorCantidad.textContent = `Máximo disponible: ${stock}.`;
    columnaDetalle.append(nombre, precio, etiquetaUnidad, cantidad, errorCantidad);
    columnaSubtotal.className = "col-md-4 d-flex flex-column align-items-md-end gap-2";
    subtotal.className = "precio";
    subtotal.textContent = formatoPrecio(producto.precioNumero * item.cantidad);
    quitar.className = "btn btn-outline-danger btn-sm";
    quitar.type = "button";
    quitar.dataset.quitarCarrito = item.id;
    quitar.textContent = "Quitar";
    columnaSubtotal.append(subtotal, quitar);
    fila.append(columnaImagen, columnaDetalle, columnaSubtotal);
    articulo.append(fila);

    return articulo;
}

function renderizarCarrito() {
    const contenedor = document.getElementById("items-carrito");

    if (!contenedor) {
        return;
    }

    const carrito = leerCarrito().filter((item) => {
        const producto = productos[item.id];
        return producto && Number.isFinite(producto.precioNumero) && obtenerStockDisponible(producto) > 0;
    });
    const carritoVacio = document.getElementById("carrito-vacio");
    const resumen = document.getElementById("resumen-carrito");
    const botonVaciar = document.getElementById("vaciar-carrito");
    const subtotal = carrito.reduce((total, item) => total + productos[item.id].precioNumero * item.cantidad, 0);

    contenedor.replaceChildren(...carrito.map(crearLineaCarrito));
    carritoVacio.hidden = carrito.length > 0;
    resumen.hidden = carrito.length === 0;
    botonVaciar.disabled = carrito.length === 0;
    document.getElementById("subtotal-carrito").textContent = formatoPrecio(subtotal);
    document.getElementById("total-carrito").textContent = formatoPrecio(subtotal);
    actualizarContadorCarrito(carrito);

    contenedor.querySelectorAll("[data-quitar-carrito]").forEach((boton) => {
        boton.addEventListener("click", () => {
            const carritoActualizado = leerCarrito().filter((item) => item.id !== boton.dataset.quitarCarrito);
            guardarCarrito(carritoActualizado);
            mostrarMensajeCarrito("Producto quitado del carrito.", "success");
        });
    });

    contenedor.querySelectorAll(".cantidad-carrito").forEach((campo) => {
        campo.addEventListener("change", () => {
            const cantidad = Number(campo.value);
            const stock = Number(campo.max);

            if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > stock) {
                campo.value = String(carrito.find((item) => item.id === campo.dataset.productoId).cantidad);
                mostrarMensajeCarrito(`La cantidad debe ser un entero entre 1 y ${stock}.`, "warning");
                return;
            }

            const carritoActualizado = leerCarrito().map((item) => item.id === campo.dataset.productoId
                ? { ...item, cantidad }
                : item);
            guardarCarrito(carritoActualizado);
        });
    });
}

function crearOrdenDesdeCarrito() {
    const carrito = leerCarrito();

    if (carrito.length === 0) {
        mostrarMensajeCarrito("Agrega productos antes de confirmar el pedido.", "warning");
        return;
    }

    const items = [];

    for (const item of carrito) {
        const producto = productos[item.id];
        const stock = producto ? obtenerStockDisponible(producto) : 0;

        if (!producto || !Number.isFinite(producto.precioNumero) || item.cantidad > stock) {
            mostrarMensajeCarrito("Revisa la disponibilidad de los productos antes de confirmar el pedido.", "warning");
            return;
        }

        items.push({
            id: item.id,
            nombre: producto.nombre,
            cantidad: item.cantidad,
            precioUnitario: producto.precioNumero,
            subtotal: producto.precioNumero * item.cantidad
        });
    }

    try {
        const ordenes = JSON.parse(localStorage.getItem("huertaOrdenes") || "[]");

        if (!Array.isArray(ordenes)) {
            throw new Error("El almacenamiento de órdenes no tiene un formato válido.");
        }

        let cliente = { nombre: "Invitado", correo: "" };

        try {
            const sesionCliente = JSON.parse(sessionStorage.getItem("huertaSesion") || "null");

            if (sesionCliente?.rol === "cliente") {
                cliente = { nombre: sesionCliente.nombre, correo: sesionCliente.correo };
            }
        } catch {
            sessionStorage.removeItem("huertaSesion");
        }

        const orden = {
            id: `ORD-${Date.now()}`,
            fecha: new Date().toISOString(),
            cliente,
            estado: "Recibida",
            items,
            total: items.reduce((total, item) => total + item.subtotal, 0)
        };

        ordenes.push(orden);
        localStorage.setItem("huertaOrdenes", JSON.stringify(ordenes));
        guardarCarrito([]);
        mostrarMensajeCarrito(`Pedido ${orden.id} creado para demostración. No se procesó un pago.`, "success");
    } catch {
        mostrarMensajeCarrito("No se pudo guardar el pedido en este navegador.", "danger");
    }
}

document.querySelectorAll("[data-agregar-carrito]").forEach((boton) => {
    boton.addEventListener("click", () => {
        const campoCantidad = document.getElementById("cantidad");
        const cantidad = boton.id === "boton-agregar-carrito" && campoCantidad
            ? Number(campoCantidad.value)
            : 1;

        if (campoCantidad && boton.id === "boton-agregar-carrito" && !validarCampo(campoCantidad)) {
            return;
        }

        agregarProductoAlCarrito(boton.dataset.agregarCarrito, cantidad);
    });
});

const botonVaciarCarrito = document.getElementById("vaciar-carrito");

if (botonVaciarCarrito) {
    botonVaciarCarrito.addEventListener("click", () => {
        try {
            guardarCarrito([]);
            mostrarMensajeCarrito("Se vació el carrito.", "success");
        } catch {
            mostrarMensajeCarrito("No se pudo vaciar el carrito.", "danger");
        }
    });
}

const botonContinuarCompra = document.getElementById("continuar-compra");

if (botonContinuarCompra) {
    botonContinuarCompra.addEventListener("click", () => {
        crearOrdenDesdeCarrito();
    });
}

actualizarContadorCarrito();
renderizarCarrito();