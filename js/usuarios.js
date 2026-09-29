const usuariosDemostracion = [
    {
        nombre: "Usuario",
        apellido: "Prueba",
        correo: "prueba@huertahogar.cl",
        contrasena: "Huerta#2026",
        telefono: "912345678"
    }
];

const claveUsuariosLocales = "huertaUsuarios";

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