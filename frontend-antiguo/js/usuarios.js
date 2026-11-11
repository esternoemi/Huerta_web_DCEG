const usuariosDemostracion = [
    {
        nombre: "Usuario",
        apellido: "Prueba",
        correo: "prueba@gmail.com",
        contrasena: "Huerta#26",
        telefono: "912345678",
        rol: "administrador"
    }
];

const claveUsuariosLocales = "huertaUsuarios";
    const claveSesionUsuario = "huertaSesion";

function leerUsuariosLocales() {
    const contenido = localStorage.getItem(claveUsuariosLocales);
    const usuarios = contenido ? JSON.parse(contenido) : [];

    if (!Array.isArray(usuarios)) {
        throw new Error("El almacenamiento de usuarios no tiene un formato válido.");
    }

    return usuarios;
}

function guardarUsuariosLocales(usuarios) {
    localStorage.setItem(claveUsuariosLocales, JSON.stringify(usuarios));
}

function guardarSesionUsuario(usuario) {
    const sesion = {
        correo: usuario.correo,
        nombre: usuario.nombre,
        rol: ["administrador", "vendedor"].includes(usuario.rol) ? usuario.rol : "cliente"
    };

    sessionStorage.setItem(claveSesionUsuario, JSON.stringify(sesion));
}

function leerSesionUsuario() {
    const contenido = sessionStorage.getItem(claveSesionUsuario);
    return contenido ? JSON.parse(contenido) : null;
}

function cerrarSesionUsuario() {
    sessionStorage.removeItem(claveSesionUsuario);
}