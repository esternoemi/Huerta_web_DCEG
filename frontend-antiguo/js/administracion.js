const sesionAdministracion = leerSesionUsuario();
const tablaUsuarios = document.getElementById("usuarios-administrados");
const mensajeAdministracion = document.getElementById("mensaje-administracion");
const formularioUsuario = document.getElementById("formulario-usuario");
const modalUsuario = bootstrap.Modal.getOrCreateInstance(document.getElementById("modal-usuario"));
const tablaProductos = document.getElementById("productos-administrados");
const mensajeProductos = document.getElementById("mensaje-productos");
const formularioProducto = document.getElementById("formulario-producto");
const modalProducto = bootstrap.Modal.getOrCreateInstance(document.getElementById("modal-producto"));
const campoContrasena = document.getElementById("usuario-contrasena");
const productosAdministrados = Object.fromEntries(Object.entries(productos).map(([id, productoBase]) => {
    const disponibilidad = /^(\d+)\s+(.+)$/u.exec(productoBase.disponibilidad.trim());

    return [id, {
        ...productoBase,
        id,
        stock: disponibilidad ? Number(disponibilidad[1]) : 0,
        unidadStock: disponibilidad ? disponibilidad[2] : "unidades",
        proximamente: !disponibilidad
    }];
}));
let correoEnEdicion = null;

if (!sesionAdministracion || sesionAdministracion.rol !== "administrador") {
    window.location.replace(sesionAdministracion?.rol === "vendedor" ? "vendedor.html" : "login.html");
} else {
    document.getElementById("administrador-actual").textContent = sesionAdministracion.nombre;
    renderizarUsuarios();
    renderizarProductos();
}

function renderizarUsuarios() {
    try {
        const usuariosLocales = leerUsuariosLocales();
        const usuariosVisibles = [
            ...usuariosDemostracion.map((usuario) => ({ ...usuario, demostracion: true })),
            ...usuariosLocales.map((usuario) => ({
                ...usuario,
                rol: ["administrador", "vendedor"].includes(usuario.rol) ? usuario.rol : "cliente",
                demostracion: false
            }))
        ];

        tablaUsuarios.replaceChildren();

        if (usuariosVisibles.length === 0) {
            const filaVacia = document.createElement("tr");
            const celdaVacia = document.createElement("td");
            celdaVacia.colSpan = 5;
            celdaVacia.className = "text-center text-body-secondary py-4";
            celdaVacia.textContent = "No hay usuarios registrados.";
            filaVacia.append(celdaVacia);
            tablaUsuarios.append(filaVacia);
            return;
        }

        usuariosVisibles.forEach((usuario) => {
            const fila = document.createElement("tr");
            const nombre = document.createElement("td");
            const correo = document.createElement("td");
            const telefono = document.createElement("td");
            const rol = document.createElement("td");
            const acciones = document.createElement("td");

            nombre.textContent = `${usuario.nombre} ${usuario.apellido}`;
            correo.textContent = usuario.correo;
            telefono.textContent = usuario.telefono || "No informado";
            rol.textContent = usuario.rol === "administrador"
                ? "Administrador"
                : usuario.rol === "vendedor" ? "Vendedor" : "Cliente";

            if (usuario.demostracion) {
                acciones.textContent = "Cuenta protegida";
            } else if (usuario.correo.toLowerCase() === sesionAdministracion.correo.toLowerCase()) {
                acciones.textContent = "Sesión actual";
            } else {
                const grupoAcciones = document.createElement("div");
                grupoAcciones.className = "d-flex flex-wrap gap-2";

                const botonEditar = document.createElement("button");
                botonEditar.type = "button";
                botonEditar.className = "btn btn-sm btn-outline-success";
                botonEditar.textContent = "Editar";
                botonEditar.addEventListener("click", () => abrirEdicionUsuario(usuario));

                const botonEliminar = document.createElement("button");
                botonEliminar.type = "button";
                botonEliminar.className = "btn btn-sm btn-outline-danger";
                botonEliminar.textContent = "Eliminar";
                botonEliminar.addEventListener("click", () => eliminarUsuario(usuario.correo));

                grupoAcciones.append(botonEditar, botonEliminar);
                acciones.append(grupoAcciones);
            }

            fila.append(nombre, correo, telefono, rol, acciones);
            tablaUsuarios.append(fila);
        });
    } catch {
        mensajeAdministracion.textContent = "No se pudieron leer las cuentas guardadas en este navegador.";
        mensajeAdministracion.className = "alert alert-danger";
    }
}

function mostrarMensajeAdministracion(texto, tipo = "success") {
    mensajeAdministracion.textContent = texto;
    mensajeAdministracion.className = `alert alert-${tipo}`;
}

function abrirEdicionUsuario(usuario) {
    correoEnEdicion = usuario.correo;
    formularioUsuario.elements.nombre.value = usuario.nombre;
    formularioUsuario.elements.apellido.value = usuario.apellido;
    formularioUsuario.elements.run.value = usuario.run || "";
    formularioUsuario.elements.correo.value = usuario.correo;
    formularioUsuario.elements.telefono.value = usuario.telefono || "";
    establecerFechaNacimiento(formularioUsuario.elements.fechaNacimiento, usuario.fechaNacimiento);
    formularioUsuario.elements.direccion.value = usuario.direccion || "";
    seleccionarUbicacion("usuario", usuario.region, usuario.comuna);
    formularioUsuario.elements.rol.value = ["administrador", "vendedor"].includes(usuario.rol) ? usuario.rol : "cliente";
    formularioUsuario.elements.rol.disabled = usuario.correo.toLowerCase() === sesionAdministracion.correo.toLowerCase();
    document.getElementById("titulo-modal-usuario").textContent = "Editar usuario";
    document.getElementById("campo-rol-usuario").hidden = false;
    campoContrasena.required = false;
    campoContrasena.value = "";
    document.getElementById("usuario-contrasena-ayuda").textContent = "Déjala vacía para conservar la contraseña actual.";
    limpiarFormularioUsuario();
    modalUsuario.show();
}

function abrirNuevoUsuario() {
    correoEnEdicion = null;
    formularioUsuario.reset();
    establecerFechaNacimiento(formularioUsuario.elements.fechaNacimiento, "");
    formularioUsuario.elements.region.dispatchEvent(new Event("change", { bubbles: true }));
    formularioUsuario.elements.rol.disabled = false;
    document.getElementById("titulo-modal-usuario").textContent = "Agregar usuario";
    document.getElementById("campo-rol-usuario").hidden = false;
    campoContrasena.required = true;
    document.getElementById("usuario-contrasena-ayuda").textContent = "";
    limpiarFormularioUsuario();
}

function limpiarFormularioUsuario() {
    formularioUsuario.querySelectorAll("[data-regla]").forEach((campo) => limpiarError(campo));
    campoContrasena.classList.remove("is-invalid");
    campoContrasena.removeAttribute("aria-invalid");
    document.getElementById("usuario-contrasena-error").textContent = "";
}

function guardarUsuario(evento) {
    evento.preventDefault();

    if (!validarFormulario(formularioUsuario)) {
        return;
    }

    const contrasenaIngresada = campoContrasena.value;
    const errorContrasena = contrasenaIngresada || !correoEnEdicion
        ? reglasValidacion.contrasena(contrasenaIngresada)
        : "";

    if (errorContrasena) {
        campoContrasena.classList.add("is-invalid");
        campoContrasena.setAttribute("aria-invalid", "true");
        document.getElementById("usuario-contrasena-error").textContent = errorContrasena;
        campoContrasena.focus();
        return;
    }

    try {
        const usuariosLocales = leerUsuariosLocales();
        const usuarioNuevo = {
            run: formularioUsuario.elements.run.value.trim().toLocaleUpperCase("es"),
            nombre: formularioUsuario.elements.nombre.value.trim(),
            apellido: formularioUsuario.elements.apellido.value.trim(),
            correo: formularioUsuario.elements.correo.value.trim().toLowerCase(),
            telefono: formularioUsuario.elements.telefono.value.trim(),
            fechaNacimiento: formularioUsuario.elements.fechaNacimiento.value,
            region: formularioUsuario.elements.region.value,
            comuna: formularioUsuario.elements.comuna.value,
            direccion: formularioUsuario.elements.direccion.value.trim(),
            rol: formularioUsuario.elements.rol.value
        };
        const correoDuplicado = [...usuariosDemostracion, ...usuariosLocales].some((usuario) =>
            usuario.correo.trim().toLowerCase() === usuarioNuevo.correo
            && usuario.correo.trim().toLowerCase() !== correoEnEdicion?.toLowerCase()
        );

        if (correoDuplicado) {
            mostrarMensajeAdministracion("Ya existe una cuenta con ese correo electrónico.", "warning");
            return;
        }

        if (contrasenaIngresada) {
            usuarioNuevo.contrasena = contrasenaIngresada;
        }

        if (correoEnEdicion) {
            const indiceUsuario = usuariosLocales.findIndex((usuario) =>
                usuario.correo.toLowerCase() === correoEnEdicion.toLowerCase()
            );

            if (indiceUsuario < 0) {
                mostrarMensajeAdministracion("No se encontró el usuario que intentas editar.", "danger");
                return;
            }

            usuarioNuevo.contrasena ||= usuariosLocales[indiceUsuario].contrasena;
            usuariosLocales[indiceUsuario] = usuarioNuevo;
        } else {
            usuarioNuevo.contrasena = contrasenaIngresada;
            usuariosLocales.push(usuarioNuevo);
        }

        guardarUsuariosLocales(usuariosLocales);
        modalUsuario.hide();
        mostrarMensajeAdministracion(correoEnEdicion ? "Usuario actualizado." : "Usuario agregado.");
        renderizarUsuarios();
    } catch {
        mostrarMensajeAdministracion("No se pudo guardar el usuario en este navegador.", "danger");
    }
}

function eliminarUsuario(correoUsuario) {
    if (!window.confirm(`¿Eliminar la cuenta de ${correoUsuario}?`)) {
        return;
    }

    try {
        const usuariosLocales = leerUsuariosLocales();
        const usuariosActualizados = usuariosLocales.filter((usuario) =>
            usuario.correo.toLowerCase() !== correoUsuario.toLowerCase()
        );

        if (usuariosActualizados.length === usuariosLocales.length) {
            mostrarMensajeAdministracion("No se encontró el usuario que intentas eliminar.", "warning");
            return;
        }

        guardarUsuariosLocales(usuariosActualizados);
        mostrarMensajeAdministracion("Usuario eliminado.");
        renderizarUsuarios();
    } catch {
        mostrarMensajeAdministracion("No se pudo eliminar el usuario.", "danger");
    }
}

function renderizarProductos() {
    tablaProductos.replaceChildren();

    Object.values(productosAdministrados).forEach((productoActual) => {
        const fila = document.createElement("tr");
        const codigo = document.createElement("td");
        const nombre = document.createElement("td");
        const categoria = document.createElement("td");
        const precio = document.createElement("td");
        const stock = document.createElement("td");
        const estado = document.createElement("td");
        const acciones = document.createElement("td");

        codigo.textContent = productoActual.id;
        nombre.textContent = productoActual.nombre;
        categoria.textContent = productoActual.categoria;
        precio.textContent = productoActual.precio;
        stock.textContent = productoActual.stock > 0
            ? `${productoActual.stock} ${productoActual.unidadStock}`
            : productoActual.proximamente ? "Próximamente" : `0 ${productoActual.unidadStock}`;

        const etiquetaEstado = document.createElement("span");
        etiquetaEstado.className = productoActual.stock > 0
            ? "badge text-bg-success"
            : productoActual.proximamente ? "badge text-bg-info" : "badge text-bg-secondary";
        etiquetaEstado.textContent = productoActual.stock > 0
            ? "Disponible"
            : productoActual.proximamente ? "Próximamente" : "Agotado";
        estado.append(etiquetaEstado);

        const grupoAcciones = document.createElement("div");
        grupoAcciones.className = "d-flex flex-wrap gap-2";

        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.className = "btn btn-sm btn-outline-success";
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", () => abrirEdicionProducto(productoActual.id));

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-sm btn-outline-danger";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.disabled = productoActual.stock === 0 && !productoActual.proximamente;
        botonEliminar.addEventListener("click", () => eliminarProducto(productoActual.id));

        grupoAcciones.append(botonEditar, botonEliminar);
        acciones.append(grupoAcciones);
        fila.append(codigo, nombre, categoria, precio, stock, estado, acciones);
        tablaProductos.append(fila);
    });
}

function abrirNuevoProducto() {
    formularioProducto.reset();
    formularioProducto.elements.identificador.value = "";
    formularioProducto.elements.stock.dataset.modificado = "false";
    document.getElementById("titulo-modal-producto").textContent = "Agregar producto";
}

function abrirEdicionProducto(idProducto) {
    const productoActual = productosAdministrados[idProducto];

    if (!productoActual) {
        return;
    }

    formularioProducto.elements.identificador.value = productoActual.id;
    formularioProducto.elements.nombre.value = productoActual.nombre;
    formularioProducto.elements.categoria.value = productoActual.categoria;
    formularioProducto.elements.precio.value = productoActual.precio;
    formularioProducto.elements.stock.value = productoActual.stock;
    formularioProducto.elements.stock.dataset.modificado = "false";
    formularioProducto.elements.unidad.value = productoActual.unidadStock;
    formularioProducto.elements.origen.value = productoActual.origen;
    formularioProducto.elements.imagen.value = productoActual.imagen;
    formularioProducto.elements.descripcion.value = productoActual.descripcion;
    document.getElementById("titulo-modal-producto").textContent = `Editar producto ${productoActual.id}`;
    modalProducto.show();
}

function generarIdProducto(categoria) {
    const prefijosCategoria = {
        "Frutas Frescas": "FR",
        "Verduras Orgánicas": "VR",
        "Productos Orgánicos": "PO",
        "Productos Lácteos": "PL"
    };
    const prefijo = prefijosCategoria[categoria];
    const siguienteNumero = Object.keys(productosAdministrados)
        .filter((id) => id.startsWith(prefijo))
        .map((id) => Number(id.slice(prefijo.length)))
        .reduce((mayor, numero) => Math.max(mayor, numero), 0) + 1;

    return `${prefijo}${String(siguienteNumero).padStart(3, "0")}`;
}

function guardarProducto(evento) {
    evento.preventDefault();

    if (!formularioProducto.reportValidity()) {
        return;
    }

    const campos = formularioProducto.elements;
    const idOriginal = campos.identificador.value;
    const productoExistente = idOriginal ? productosAdministrados[idOriginal] : null;
    const stock = Number(campos.stock.value);
    const proximamente = stock === 0 && (productoExistente
        ? productoExistente.proximamente && campos.stock.dataset.modificado !== "true"
        : campos.precio.value.trim().toLocaleLowerCase("es") === "próximamente");
    const idProducto = productoExistente?.id || generarIdProducto(campos.categoria.value);
    const unidadStock = campos.unidad.value.trim();

    productosAdministrados[idProducto] = {
        id: idProducto,
        nombre: campos.nombre.value.trim(),
        categoria: campos.categoria.value,
        precio: campos.precio.value.trim(),
        descripcion: campos.descripcion.value.trim(),
        origen: campos.origen.value.trim(),
        imagen: campos.imagen.value.trim() || productoExistente?.imagen || "",
        stock,
        unidadStock,
        proximamente,
        disponibilidad: stock > 0 ? `${stock} ${unidadStock}` : proximamente ? "Próximamente" : `0 ${unidadStock}`
    };

    modalProducto.hide();
    mensajeProductos.textContent = productoExistente ? "Producto actualizado." : "Producto agregado.";
    mensajeProductos.className = "alert alert-success";
    renderizarProductos();
}

function eliminarProducto(idProducto) {
    const productoActual = productosAdministrados[idProducto];

    if (!productoActual || !window.confirm(`¿Eliminar ${productoActual.nombre}? El stock quedará en 0.`)) {
        return;
    }

    productoActual.stock = 0;
    productoActual.proximamente = false;
    productoActual.disponibilidad = `0 ${productoActual.unidadStock}`;
    mensajeProductos.textContent = `${productoActual.nombre} quedó agotado (stock 0).`;
    mensajeProductos.className = "alert alert-success";
    renderizarProductos();
}

document.getElementById("agregar-usuario").addEventListener("click", abrirNuevoUsuario);
formularioUsuario.addEventListener("submit", guardarUsuario);
document.getElementById("modal-usuario").addEventListener("hidden.bs.modal", limpiarFormularioUsuario);
document.getElementById("agregar-producto").addEventListener("click", abrirNuevoProducto);
formularioProducto.addEventListener("submit", guardarProducto);
formularioProducto.elements.stock.addEventListener("input", () => {
    formularioProducto.elements.stock.dataset.modificado = "true";
});

document.getElementById("cerrar-sesion").addEventListener("click", () => {
    cerrarSesionUsuario();
    window.location.href = "login.html";
});