# Huerto Hogar

Huerto Hogar es una tienda de ejemplo para comprar frutas, verduras y otros productos frescos. La versión que se usa actualmente está hecha con React.

El proyecto permite recorrer la tienda, agregar productos al carrito y simular una compra. También tiene pantallas para los perfiles de administrador y vendedor. Las compras son de prueba: no se cobra dinero ni se envían pedidos reales.

## Cómo abrir el proyecto

Necesitas tener instalado Node.js, que incluye npm. Luego:

1. Abre una terminal en la carpeta del proyecto.
2. Entra a la carpeta `frontend-react`:

   ```bash
   cd frontend-react
   ```

3. Instala lo necesario para ejecutar el proyecto:

   ```bash
   npm install
   ```

4. Inicia el sitio:

   ```bash
   npm run dev
   ```

5. Abre en el navegador la dirección que aparece en la terminal. Normalmente es `http://localhost:5173/`.

Para detener el sitio, vuelve a la terminal y presiona `Ctrl+C`.

### Comandos útiles

Estos comandos también se ejecutan dentro de `frontend-react`:

```bash
npm run lint
npm run build
```

- `npm run lint` revisa si hay problemas en el código.
- `npm run build` prepara una versión del sitio para publicar.

## Qué se puede hacer en el sitio

### Tienda y compras

1. En **Inicio** puedes conocer la tienda y encontrar accesos a sus secciones.
2. En **Productos** puedes recorrer el catálogo y buscar por categoría.
3. Puedes abrir el detalle de cada producto. Los que dicen **“Próximamente”** todavía no se pueden comprar.
4. En el carrito puedes agregar o quitar productos, cambiar cantidades y revisar el total. La cantidad no puede superar el stock disponible.
5. En el checkout ingresas los datos necesarios para la entrega y realizas una compra de prueba.
6. Al terminar, el sitio muestra el resultado y guarda la orden en ese navegador. Si la compra se confirma, el carrito queda vacío.

### Cuentas

- Puedes crear una cuenta de cliente desde **Regístrate aquí**, en la página de inicio de sesión.
- Hay tres tipos de cuenta: cliente, administrador y vendedor.
- El cliente puede usar las funciones de la tienda.
- El administrador puede revisar y administrar productos, categorías y usuarios, además de consultar órdenes y reportes.
- El vendedor puede revisar productos y órdenes, pero no modificarlos.

### Otras secciones

- **Contacto** guarda el mensaje en el navegador; no lo envía por correo.
- **Nosotros** presenta información de la tienda y del equipo.
- **Blogs** muestra artículos y sus páginas.
- También puedes visitar las páginas de categorías y ofertas.

## Algunas reglas de los formularios

- Para registrarse se necesita un RUN válido, nombre, apellido, correo, contraseña, teléfono, dirección, región y comuna.
- Se aceptan correos terminados en `duoc.cl`, `profesor.duoc.cl` o `gmail.com`.
- La contraseña debe tener entre 4 y 10 caracteres, e incluir una mayúscula, una minúscula, un número y un símbolo.
- La fecha de nacimiento es opcional.
- La comuna disponible depende de la región elegida.
- El mensaje de contacto puede tener hasta 500 caracteres.
- El carrito no permite agregar más unidades que las disponibles.

## Datos de prueba

Las cuentas, el carrito, las órdenes y los mensajes se guardan en el navegador donde abriste el sitio. No se comparten con otros equipos y se pueden borrar al limpiar los datos del sitio en el navegador.

En modo de desarrollo puedes preparar cuentas ficticias desde `http://localhost:5173/acceso-demo` o con el enlace que aparece en la página de inicio de sesión:

1. Elige una contraseña que cumpla las reglas que muestra la página.
2. Inicia sesión con uno de estos correos:
   - Administrador: `admin@demo.local`
   - Vendedor: `vendedor@demo.local`
3. Usa la contraseña que acabas de elegir.

Estas cuentas sirven para probar las pantallas. Los permisos y las compras son parte de la demostración, no un sistema listo para manejar información o pagos reales.

## Carpetas del proyecto

- `frontend-react`: la versión actual del sitio. Usa esta carpeta para ejecutar el proyecto.
- `frontend-antiguo`: la versión anterior, guardada como referencia. No necesitas usarla para abrir el sitio actual.
