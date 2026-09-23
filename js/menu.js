const botonMenu = document.querySelector('#boton-menu');
const menuPrincipal = document.querySelector('#menu-principal');

if (botonMenu && menuPrincipal) {
    botonMenu.addEventListener('click', function () {
        menuPrincipal.classList.toggle('d-none');
    });
}