const botonMenu = document.querySelector('#boton-menu');
const menuPrincipal = document.querySelector('#menu-principal');

if (menuPrincipal) {
    try {
        const sesionUsuario = JSON.parse(sessionStorage.getItem("huertaSesion") || "null");

        if (sesionUsuario?.rol === "administrador") {
            const listaNavegacion = menuPrincipal.querySelector(".navbar-nav");

            if (listaNavegacion && !document.getElementById("enlace-administracion")) {
                const elementoNavegacion = document.createElement("li");
                const enlaceAdministracion = document.createElement("a");

                elementoNavegacion.className = "nav-item";
                enlaceAdministracion.id = "enlace-administracion";
                enlaceAdministracion.className = "boton boton-claro";
                enlaceAdministracion.href = window.location.pathname.includes("/paginas/")
                    ? "administracion.html"
                    : "paginas/administracion.html";
                enlaceAdministracion.textContent = "Administración";
                elementoNavegacion.append(enlaceAdministracion);
                listaNavegacion.append(elementoNavegacion);
            }
        }
    } catch {
        sessionStorage.removeItem("huertaSesion");
    }
}

if (botonMenu && menuPrincipal) {
    botonMenu.addEventListener('click', function () {
        menuPrincipal.classList.toggle('d-none');
    });
}