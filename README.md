# Huerto Hogar

Sitio web demostrativo de una tienda de productos frescos y orgánicos. Está construido con HTML, CSS y JavaScript, y se ejecuta como sitio estático, sin proceso de compilación.

## Inicio

Desde la carpeta del proyecto, inicia un servidor estático:
En ejemplo con python:
```bash
python -m http.server 8000
```
Abre `http://localhost:8000/` en el navegador. Bootstrap y Flatpickr se cargan desde CDN, por lo que se requiere conexión a internet para disponer de todos los estilos y del calendario de fechas.

## Recorridos del sitio

### Tienda y pedidos

1. Inicio presenta las categorías y una selección de productos.
2. Productos muestra el catálogo generado desde `js/productos.js` y permite filtrar por categoría.
3. Cada producto disponible tiene una vista de detalle. Los artículos marcados como “Próximamente” no se pueden agregar al carrito.
4. El carrito permite agregar productos desde el catálogo o su detalle, cambiar cantidades dentro del stock disponible, quitar artículos y revisar subtotales y total.
5. Al confirmar, se crea un pedido de demostración con estado “Recibida” y el carrito se vacía.

### Cuentas y permisos

- El registro crea cuentas de cliente y solicita datos personales, dirección y ubicación. La fecha de nacimiento es opcional.
- El inicio de sesión tiene tres roles: cliente, administrador y vendedor.
- El cliente navega por la tienda pública.
- El administrador accede a la gestión de usuarios y productos.
- El vendedor accede a `paginas/vendedor.html`, donde puede consultar productos, sus detalles, órdenes y detalles de órdenes. No dispone de acciones de edición.
- Un administrador puede crear, editar o eliminar usuarios y asignarles un perfil.

### Contacto y contenido

- Contacto valida nombre, correo y mensaje. El mensaje se guarda localmente y se informa que no se envía por correo.
- Nosotros presenta información de la tienda y del equipo del proyecto.
- Blogs contiene dos artículos con sus respectivas páginas de detalle.

## Validaciones

Los formularios validan datos en el navegador y muestran mensajes junto a los campos. Se aplican, entre otras, las reglas de correo admitido (`@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`), contraseña de 4 a 10 caracteres, RUN chileno sin puntos ni guion y comentario de hasta 500 caracteres.

Los selectores de ubicación dependen de la región elegida. La Región Metropolitana incluye sus 52 comunas; las demás regiones utilizan las comunas cargadas actualmente en el proyecto.

## Almacenamiento y alcance

Los datos se guardan en el navegador actual:

- `huertaUsuarios`: cuentas registradas y usuarios creados por administración.
- `huertaSesion`: sesión activa, mediante `sessionStorage`.
- `huertaCarrito`: contenido del carrito.
- `huertaOrdenes`: pedidos de demostración.
- `huertaMensajesContacto`: mensajes de contacto de demostración.


## Cuenta de demostración

El proyecto incluye un usuario administrador para probar el acceso:

- Correo: `prueba@gmail.com`
- Contraseña: `Huerta#26`
