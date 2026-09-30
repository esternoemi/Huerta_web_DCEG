const productos = {
    FR001: {
        nombre: "Manzana Fuji",
        categoria: "Frutas Frescas",
        precio: "$1.200 por kilo",
        precioNumero: 1200,
        descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres.Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
        origen: "Valle del Maule",
        disponibilidad: "150 kilos",
        imagen: "../images/FR001 - manzanaFuji.png"
    },

    FR002: {
        nombre: "Naranjas Valencia",
        categoria: "Frutas Frescas",
        precio: "$1.000 por kilo",
        precioNumero: 1000,
        descripcion: "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
        origen: "Valle del Maule",
        disponibilidad: "200 kilos",
        imagen: "../images/FR002 - naranjasValencia.png"        
    },

    FR003: {
        nombre: "Plátanos Cavendish",
        categoria: "Frutas Frescas",
        precio: "$800 por kilo",
        precioNumero: 800,
        descripcion: "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
        origen: "Valle del Maule",
        disponibilidad: "250 kilos",
        imagen: "../images/FR003 - platanosCavendish.png"        
    },

    VR001: {
        nombre: "Zanahorias Organicas",
        categoria: "Verduras Orgánicas",
        precio: "$900 por kilo",
        precioNumero: 900,
        descripcion: "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins.                             Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.",
        origen: "Valle del Maule",
        disponibilidad: "250 kilos",
        imagen: "../images/VR001 - zanahoriasOrganicas.png"        
    },

    VR002: {
        nombre: "Espinaca Fresca",
        categoria: "Verduras Orgánicas",
        precio: "$700 bolsa 500g",
        precioNumero: 700,
        descripcion: "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
        origen: "Valle del Maule",
        disponibilidad: "250 kilos",
        imagen: "../images/VR002 - espinacaFresca.png"        
    },

    VR003: {
        nombre: "Pimientos Tricolor",
        categoria: "Verduras Orgánicas",
        precio: "$1.500 por kilo",
        precioNumero: 1500,
        descripcion: "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.",
        origen: "Valle del Maule",
        disponibilidad: "120 kilos",
        imagen: "../images/VR003 - pimientosTricilor.png"        
    },

    PO001: {
        nombre: "Miel Orgánica",
        categoria: "Productos Orgánicos",
        precio: "5.000 frasco 500g",
        precioNumero: 5000,
        descripcion: "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
        origen: "Valle del Maule",
        disponibilidad: "120 kilos",
        imagen: "../images/PO001 - mielOrganica.png"        
    },

    PO002: {
        nombre: "Quinoa Orgánica",
        categoria: "Productos Orgánicos",
        precio: "Próximamente",
        precioNumero: null,
        descripcion: "Fuente excepcional de proteína completa, fibra y minerales esenciales. Perfecta para ensaladas, guisos o como el sustituto ideal del arroz.",
        origen: "Valle del Maule",
        disponibilidad: "Próximamente",
        imagen: "../images/PO002 - QuinoaOrganica.png"        
    },

    PL001: {
        nombre: "Leche Entera",
        categoria: "Productos Lácteos",
        precio: "Próximamente",
        precioNumero: null,
        descripcion: "Disfruta del sabor y la cremosidad de siempre con nuestra leche entera! 100% pura, natural y una excelente fuente de calcio y energía, es la opción ideal para desayunos perfectos, recetas deliciosas y para cuidar el bienestar de toda tu familia.",
        origen: "Valle del Maule",
        disponibilidad: "120 Litros",
        imagen: "../images/PL001 - lecheEntera.png"        
    },
}
    function obtenerStockDisponible(producto) {
        const disponibilidad = /^(\d+)\s+(.+)$/u.exec(producto.disponibilidad.trim());

        return disponibilidad ? Number(disponibilidad[1]) : 0;
    }

    function obtenerRutaImagen(producto) {
        return window.location.pathname.includes("/paginas/")
            ? producto.imagen
            : producto.imagen.replace(/^\.\.\//u, "");
    }

    function crearTarjetaProducto(id, producto) {
        const columna = document.createElement("div");
        const articulo = document.createElement("article");
        const contenedorImagen = document.createElement("div");
        const imagen = document.createElement("img");
        const contenido = document.createElement("div");
        const categoria = document.createElement("p");
        const nombre = document.createElement("h3");
        const fila = document.createElement("div");
        const precio = document.createElement("span");
        const enlaceDetalle = document.createElement("a");
        const botonAgregar = document.createElement("button");

        columna.className = "col-md-6 col-lg-4";
        columna.dataset.categoria = producto.categoria
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/gu, "")
            .toLocaleLowerCase("es")
            .replace(/\s+/gu, "-");
        articulo.className = "tarjeta-producto";
        contenedorImagen.className = "imagen-producto";
        imagen.src = obtenerRutaImagen(producto);
        imagen.alt = producto.nombre;
        contenido.className = "contenido-producto";
        categoria.className = "etiqueta";
        categoria.textContent = producto.categoria.toLocaleUpperCase("es");
        nombre.textContent = producto.nombre;
        fila.className = "d-flex flex-column gap-3";
        precio.className = "precio";
        precio.textContent = producto.precio;
        enlaceDetalle.className = "enlace";
        const prefijoDetalle = window.location.pathname.includes("/paginas/") ? "" : "paginas/";
        enlaceDetalle.href = `${prefijoDetalle}detalle-producto.html?id=${encodeURIComponent(id)}`;
        enlaceDetalle.textContent = "Ver detalle";
        botonAgregar.className = "boton boton-verde";
        botonAgregar.type = "button";
        botonAgregar.dataset.agregarCarrito = id;
        botonAgregar.textContent = "Agregar al carrito";
        botonAgregar.disabled = !Number.isFinite(producto.precioNumero) || obtenerStockDisponible(producto) < 1;

        contenedorImagen.append(imagen);
        fila.append(precio, enlaceDetalle, botonAgregar);
        contenido.append(categoria, nombre, fila);
        articulo.append(contenedorImagen, contenido);
        columna.append(articulo);

        return columna;
    }

    const listaProductos = document.getElementById("lista-productos");
    const productosDestacados = document.getElementById("productos-destacados");

    if (listaProductos) {
        listaProductos.replaceChildren(...Object.entries(productos).map(([id, productoActual]) =>
            crearTarjetaProducto(id, productoActual)
        ));
    }

    if (productosDestacados) {
        productosDestacados.replaceChildren(...Object.entries(productos)
            .slice(0, 3)
            .map(([id, productoActual]) => crearTarjetaProducto(id, productoActual)));
    }



const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get("id");
const producto = productos[idProducto];

if (document.getElementById("producto-nombre")) {
    if (!producto) {
        window.alert("No encontramos ese producto. Vuelve al catálogo para seguir explorando.");
    } else {
        document.getElementById("producto-categoria").textContent = producto.categoria;
        document.getElementById("producto-nombre").textContent = producto.nombre;
        document.getElementById("producto-precio").textContent = producto.precio;
        document.getElementById("producto-descripcion").textContent = producto.descripcion;
        document.getElementById("producto-origen").textContent = producto.origen;
        document.getElementById("producto-disponibilidad").textContent = producto.disponibilidad;

        const imagen = document.getElementById("producto-imagen");
        const accionesCompra = document.getElementById("acciones-compra");
        const botonAgregar = document.getElementById("boton-agregar-carrito");
        const avisoSinPrecio = document.getElementById("aviso-sin-precio");
        const campoCantidad = document.getElementById("cantidad");
        const disponibilidad = /^(\d+)\s+(.+)$/u.exec(producto.disponibilidad.trim());
        const productoDisponibleParaCompra = Number.isFinite(producto.precioNumero)
            && Boolean(disponibilidad)
            && Number(disponibilidad[1]) > 0;

        imagen.src = obtenerRutaImagen(producto);
        imagen.alt = producto.nombre;
        botonAgregar.dataset.agregarCarrito = idProducto;

        accionesCompra.hidden = !productoDisponibleParaCompra;
        accionesCompra.classList.toggle("d-flex", productoDisponibleParaCompra);
        avisoSinPrecio.hidden = productoDisponibleParaCompra;

        if (disponibilidad) {
            campoCantidad.max = disponibilidad[1];
            campoCantidad.dataset.unidadDisponible = disponibilidad[2].toLocaleLowerCase("es");
        }
    }
}