const sesionAdministracion = leerSesionUsuario();
const tablaUsuarios = document.getElementById("usuarios-administrados");
const mensajeAdministracion = document.getElementById("mensaje-administracion");

if (!sesionAdministracion || sesionAdministracion.rol !== "administrador") {
    window.location.replace("login.html");
} else {
    document.getElementById("administrador-actual").textContent = sesionAdministracion.nombre;
    renderizarUsuarios();
}

function renderizarUsuarios() {
    try {
        const usuariosLocales = leerUsuariosLocales();
        const usuariosVisibles = [
            ...usuariosDemostracion.map((usuario) => ({ ...usuario, demostracion: true })),
            ...usuariosLocales.map((usuario) => ({
                ...usuario,
                rol: usuario.rol === "administrador" ? "administrador" : "cliente",
                demostracion: false
            }))
        ];

        tablaUsuarios.replaceChildren();

        usuariosVisibles.forEach((usuario) => {
            const fila = document.createElement("tr");
            const nombre = document.createElement("td");
            const correo = document.createElement("td");
            const rol = document.createElement("td");
            const acciones = document.createElement("td");

            nombre.textContent = `${usuario.nombre} ${usuario.apellido}`;
            correo.textContent = usuario.correo;
            rol.textContent = usuario.rol === "administrador" ? "Administrador" : "Cliente";

            if (usuario.demostracion) {
                acciones.textContent = "Cuenta administradora de demostración";
            } else {
                const botonRol = document.createElement("button");
                botonRol.type = "button";
                botonRol.className = usuario.rol === "administrador"
                    ? "btn btn-sm btn-outline-secondary"
                    : "btn btn-sm btn-outline-success";
                botonRol.textContent = usuario.rol === "administrador"
                    ? "Cambiar a cliente"
                    : "Hacer administrador";
                botonRol.addEventListener("click", () => cambiarRolUsuario(usuario.correo));
                acciones.append(botonRol);
            }

            fila.append(nombre, correo, rol, acciones);
            tablaUsuarios.append(fila);
        });
    } catch {
        mensajeAdministracion.textContent = "No se pudieron leer las cuentas guardadas en este navegador.";
        mensajeAdministracion.className = "alert alert-danger";
    }
}

function cambiarRolUsuario(correoUsuario) {
    try {
        const usuariosLocales = leerUsuariosLocales();
        const usuario = usuariosLocales.find((elemento) =>
            elemento.correo.toLowerCase() === correoUsuario.toLowerCase()
        );

        if (!usuario) {
            return;
        }

        usuario.rol = usuario.rol === "administrador" ? "cliente" : "administrador";
        guardarUsuariosLocales(usuariosLocales);
        mensajeAdministracion.textContent = `Rol actualizado para ${usuario.correo}.`;
        mensajeAdministracion.className = "alert alert-success";
        renderizarUsuarios();
    } catch {
        mensajeAdministracion.textContent = "No se pudo actualizar el rol del usuario.";
        mensajeAdministracion.className = "alert alert-danger";
    }
}

document.getElementById("cerrar-sesion").addEventListener("click", () => {
    cerrarSesionUsuario();
    window.location.href = "login.html";
});