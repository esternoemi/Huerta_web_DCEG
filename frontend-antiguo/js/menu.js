const botonMenu = document.querySelector('#boton-menu');
const menuPrincipal = document.querySelector('#menu-principal');
let sesionUsuario = null;

try {
    sesionUsuario = JSON.parse(sessionStorage.getItem("huertaSesion") || "null");
} catch {
    sessionStorage.removeItem("huertaSesion");
}

const estaEnPaginas = window.location.pathname.includes("/paginas/");
const paginaVendedor = window.location.pathname.endsWith("/vendedor.html");

if (sesionUsuario?.rol === "vendedor" && !paginaVendedor) {
    window.location.replace(estaEnPaginas ? "vendedor.html" : "paginas/vendedor.html");
} else if (menuPrincipal && sesionUsuario?.rol === "administrador") {
    const listaNavegacion = menuPrincipal.querySelector(".navbar-nav");

    if (listaNavegacion && !document.getElementById("enlace-administracion")) {
        const elementoNavegacion = document.createElement("li");
        const enlaceAdministracion = document.createElement("a");

        elementoNavegacion.className = "nav-item";
        enlaceAdministracion.id = "enlace-administracion";
        enlaceAdministracion.className = "boton boton-claro";
        enlaceAdministracion.href = estaEnPaginas ? "administracion.html" : "paginas/administracion.html";
        enlaceAdministracion.textContent = "Administración";
        elementoNavegacion.append(enlaceAdministracion);
        listaNavegacion.append(elementoNavegacion);
    }
}

if (botonMenu && menuPrincipal) {
    botonMenu.addEventListener('click', function () {
        menuPrincipal.classList.toggle('d-none');
    });
}