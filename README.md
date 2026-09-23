# Huerta

## División de tareas

La base actual es un mockup estático con Bootstrap. Ya existen la página principal, los estilos compartidos, el menú móvil y las páginas de login, registro, contacto, productos, detalle del producto y carrito.

### Desarrollador 1: interfaz y experiencia del usuario

Responsable de la parte visible del sitio y de que la navegación sea clara en computador y celular.

- Completar el contenido visual de `index.html`.
- Reemplazar los textos de plantilla por nombres, descripciones e imágenes definitivas.
- Completar y mantener `estilos/estilos.css`.
- Revisar el diseño responsive de todas las páginas.
- Completar `paginas/login.html`, `paginas/registro.html` y `paginas/contacto.html`.
- Crear las pantallas de perfil del usuario y edición de dirección de entrega.
- Crear las vistas para seleccionar fecha de entrega y consultar el estado del pedido.
- Crear las vistas para reseñas y calificaciones de productos.
- Mantener la navegación entre páginas y mejorar el menú de `js/menu.js` cuando sea necesario.
- Verificar accesibilidad básica: etiquetas de formularios, textos alternativos y botones comprensibles.

### Desarrollador 2: datos, compras y administración

Responsable de la información del sistema y de las funciones que harán que el mockup se convierta en una aplicación.

- Diseñar la estructura de datos para usuarios, administradores, productos, categorías, carritos, pedidos, envíos y reseñas.
- Reemplazar el archivo provisional `data/usuarios.txt` por el sistema de almacenamiento que se defina posteriormente.
- Implementar registro, inicio de sesión y validaciones de contraseña.
- Agregar roles de usuario y administrador.
- Completar el catálogo en `paginas/productos.html` con productos, precios, origen y disponibilidad.
- Implementar filtros por categoría: frutas, verduras, orgánicos y otras categorías futuras.
- Implementar el detalle de producto en `paginas/detalle-producto.html`.
- Implementar agregar, eliminar y modificar cantidades en `paginas/carrito.html`.
- Implementar el resumen de precios, total, confirmación del pedido y generación de boleta.
- Implementar estados del pedido: recibido, preparación, enviado y entregado.
- Implementar seguimiento del envío y fechas de entrega preferidas.
- Crear el panel de administración para gestionar productos, categorías, usuarios, pedidos y envíos.
- Conectar las funciones de reseñas y calificaciones con los productos comprados.

## Trabajo compartido

- Definir juntos los nombres de campos, enlaces y reglas de validación antes de conectar páginas con datos.
- Trabajar con ramas separadas y realizar revisiones antes de unir cambios.
- Probar cada página en computador y celular.
- Comprobar que un usuario no pueda acceder a funciones de administrador sin autorización.
- Revisar que los formularios muestren mensajes claros cuando falten datos o exista un error.
- Mantener los nombres de archivos, clases y variables en español cuando no exista una razón técnica para usar inglés.

## Orden sugerido

1. Completar contenido, imágenes y diseño de las páginas actuales.
2. Definir usuarios, productos y categorías.
3. Implementar registro, login y perfiles.
4. Implementar catálogo, detalle y filtros.
5. Implementar carrito y pedidos.
6. Implementar envíos, seguimiento, reseñas y calificaciones.
7. Implementar administración y validaciones de roles.
8. Realizar pruebas finales de navegación, formularios y diseño responsive.
 