const sesionVendedorActual = leerSesionUsuario();
const parametrosVendedor = new URLSearchParams(window.location.search);

if (!sesionVendedorActual || sesionVendedorActual.rol !== "vendedor") {
    const paginaDestino = sesionVendedorActual?.rol === "administrador" ? "administracion.html" : "login.html";
    window.location.replace(paginaDestino);
} else {
    document.getElementById("vendedor-actual").textContent = sesionVendedorActual.nombre;

    function formatoPrecioVendedor(valor) {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        }).format(valor);
    }

    function formatoFechaVendedor(valor) {
        const fecha = new Date(valor);

        if (Number.isNaN(fecha.getTime())) {
            return "Fecha no disponible";
        }

        const dia = String(fecha.getDate()).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const anio = fecha.getFullYear();
        const hora = String(fecha.getHours()).padStart(2, "0");
        const minuto = String(fecha.getMinutes()).padStart(2, "0");

        return `${dia}/${mes}/${anio} ${hora}:${minuto}`;
    }

    function agregarCelda(fila, contenido) {
        const celda = document.createElement("td");
        celda.textContent = contenido;
        fila.append(celda);
        return celda;
    }

    function listarProductosVendedor() {
        const tabla = document.getElementById("productos-vendedor");

        Object.entries(productos).forEach(([id, productoActual]) => {
            const fila = document.createElement("tr");
            const stock = obtenerStockDisponible(productoActual);
            const detalle = document.createElement("a");

            agregarCelda(fila, id);
            agregarCelda(fila, productoActual.nombre);
            agregarCelda(fila, productoActual.categoria);
            agregarCelda(fila, Number.isFinite(productoActual.precioNumero)
                ? formatoPrecioVendedor(productoActual.precioNumero)
                : "Próximamente");
            agregarCelda(fila, stock > 0 ? `${stock} ${productoActual.disponibilidad.replace(/^\d+\s*/u, "")}` : "No disponible");
            detalle.className = "enlace";
            detalle.href = `vendedor.html?producto=${encodeURIComponent(id)}`;
            detalle.textContent = "Ver detalle";
            agregarCelda(fila, "").append(detalle);
            tabla.append(fila);
        });
    }

    function mostrarDetalleProductoVendedor(idProducto) {
        const productoActual = productos[idProducto];

        if (!productoActual) {
            document.getElementById("mensaje-vendedor").textContent = "No se encontró ese producto.";
            document.getElementById("mensaje-vendedor").className = "alert alert-warning";
            document.getElementById("seccion-productos-vendedor").hidden = true;
            return;
        }

        document.getElementById("seccion-productos-vendedor").hidden = true;
        document.getElementById("detalle-producto-vendedor").hidden = false;
        document.getElementById("imagen-producto-vendedor").src = obtenerRutaImagen(productoActual);
        document.getElementById("imagen-producto-vendedor").alt = productoActual.nombre;
        document.getElementById("categoria-producto-vendedor").textContent = productoActual.categoria;
        document.getElementById("nombre-producto-vendedor").textContent = productoActual.nombre;
        document.getElementById("precio-producto-vendedor").textContent = Number.isFinite(productoActual.precioNumero)
            ? formatoPrecioVendedor(productoActual.precioNumero)
            : "Próximamente";
        document.getElementById("descripcion-producto-vendedor").textContent = productoActual.descripcion;
        document.getElementById("origen-producto-vendedor").textContent = productoActual.origen;
        document.getElementById("stock-producto-vendedor").textContent = productoActual.disponibilidad;
    }

    function leerOrdenesVendedor() {
        try {
            const ordenes = JSON.parse(localStorage.getItem("huertaOrdenes") || "[]");
            return Array.isArray(ordenes) ? ordenes : [];
        } catch {
            return [];
        }
    }

    function renderizarOrdenesVendedor() {
        const ordenes = leerOrdenesVendedor().slice().reverse();
        const tabla = document.getElementById("ordenes-vendedor");

        document.getElementById("ordenes-vacias").hidden = ordenes.length > 0;
        document.getElementById("tabla-ordenes-contenedor").hidden = ordenes.length === 0;

        ordenes.forEach((orden) => {
            const fila = document.createElement("tr");
            const detalle = document.createElement("a");

            agregarCelda(fila, orden.id);
            agregarCelda(fila, formatoFechaVendedor(orden.fecha));
            agregarCelda(fila, orden.cliente.nombre);
            agregarCelda(fila, orden.estado);
            agregarCelda(fila, formatoPrecioVendedor(orden.total));
            detalle.className = "enlace";
            detalle.href = `vendedor.html?orden=${encodeURIComponent(orden.id)}`;
            detalle.textContent = "Ver detalle";
            agregarCelda(fila, "").append(detalle);
            tabla.append(fila);
        });
    }

    function mostrarDetalleOrdenVendedor(idOrden) {
        const orden = leerOrdenesVendedor().find((ordenActual) => ordenActual.id === idOrden);

        if (!orden) {
            document.getElementById("seccion-productos-vendedor").hidden = true;
            document.getElementById("mensaje-vendedor").textContent = "No se encontró esa orden.";
            document.getElementById("mensaje-vendedor").className = "alert alert-warning";
            document.getElementById("seccion-ordenes-vendedor").hidden = false;
            renderizarOrdenesVendedor();
            return;
        }

        document.getElementById("seccion-productos-vendedor").hidden = true;
        document.getElementById("seccion-ordenes-vendedor").hidden = true;
        document.getElementById("detalle-orden-vendedor").hidden = false;
        document.getElementById("titulo-detalle-orden-vendedor").textContent = `Orden ${orden.id}`;
        document.getElementById("fecha-orden-vendedor").textContent = formatoFechaVendedor(orden.fecha);
        document.getElementById("cliente-orden-vendedor").textContent = orden.cliente.nombre;
        document.getElementById("correo-orden-vendedor").textContent = orden.cliente.correo || "No informado";
        document.getElementById("estado-orden-vendedor").textContent = orden.estado;
        document.getElementById("total-orden-vendedor").textContent = formatoPrecioVendedor(orden.total);

        const lineas = document.getElementById("lineas-orden-vendedor");
        orden.items.forEach((item) => {
            const fila = document.createElement("tr");
            agregarCelda(fila, item.nombre);
            agregarCelda(fila, String(item.cantidad));
            agregarCelda(fila, formatoPrecioVendedor(item.precioUnitario));
            agregarCelda(fila, formatoPrecioVendedor(item.subtotal));
            lineas.append(fila);
        });
    }

    function cambiarSeccionVendedor(vista) {
        const verOrdenes = vista === "ordenes";
        document.getElementById("seccion-productos-vendedor").hidden = verOrdenes;
        document.getElementById("seccion-ordenes-vendedor").hidden = !verOrdenes;
        document.querySelectorAll("[data-vista-vendedor]").forEach((enlace) => {
            const seleccionado = enlace.dataset.vistaVendedor === vista;
            enlace.classList.toggle("activo", seleccionado);
            if (seleccionado) {
                enlace.setAttribute("aria-current", "page");
            } else {
                enlace.removeAttribute("aria-current");
            }
        });
    }

    listarProductosVendedor();

    if (parametrosVendedor.has("producto")) {
        mostrarDetalleProductoVendedor(parametrosVendedor.get("producto"));
    } else if (parametrosVendedor.has("orden")) {
        mostrarDetalleOrdenVendedor(parametrosVendedor.get("orden"));
    } else {
        const vistaVendedor = parametrosVendedor.get("vista") === "ordenes" ? "ordenes" : "productos";
        cambiarSeccionVendedor(vistaVendedor);

        if (vistaVendedor === "ordenes") {
            renderizarOrdenesVendedor();
        }
    }

    document.getElementById("cerrar-sesion-vendedor").addEventListener("click", () => {
        cerrarSesionUsuario();
        window.location.href = "login.html";
    });
}