const productos = {
    FR001: {
        nombre: "Manzana Fuji",
        categoria: "Frutas Frescas",
        precio: "$1.200 por kilo",
        descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres.Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
        origen: "Valle del Maule",
        disponibilidad: "150 kilos",
        imagen: "../images/FR001 - manzanaFuji.png"
    },

    FR002: {
        nombre: "Naranjas Valencia",
        categoria: "Frutas Frescas",
        precio: "$1.000 por kilo",
        descripcion: "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
        origen: "Valle del Maule",
        disponibilidad: "200 kilos",
        imagen: "../images/FR002 - naranjasValencia.png"        
    },

    FR003: {
        nombre: "Plátanos Cavendish",
        categoria: "Frutas Frescas",
        precio: "$800 por kilo",
        descripcion: "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
        origen: "Valle del Maule",
        disponibilidad: "250 kilos",
        imagen: "../images/FR003 - platanosCavendish.png"        
    },

    VR001: {
        nombre: "Zanahorias Organicas",
        categoria: "Verduras Orgánicas",
        precio: "$900 por kilo",
        descripcion: "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins.                             Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.",
        origen: "Valle del Maule",
        disponibilidad: "250 kilos",
        imagen: "../images/VR001 - zanahoriasOrganicas.png"        
    },

    VR002: {
        nombre: "Espinaca Fresca",
        categoria: "Verduras Orgánicas",
        precio: "$700 bolsa 500g",
        descripcion: "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
        origen: "Valle del Maule",
        disponibilidad: "250 kilos",
        imagen: "../images/VR002 - espinacaFresca.png"        
    },

    VR003: {
        nombre: "Pimientos Tricilor",
        categoria: "Verduras Orgánicas",
        precio: "$1.500 por kilo",
        descripcion: "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.",
        origen: "Valle del Maule",
        disponibilidad: "120 kilos",
        imagen: "../images/VR003 - pimientosTricilor.png"        
    },

    PO001: {
        nombre: "Miel Orgánica",
        categoria: "Productos Orgánicos",
        precio: "5.000 frasco 500g",
        descripcion: "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
        origen: "Valle del Maule",
        disponibilidad: "120 kilos",
        imagen: "../images/PO001 - mielOrganica.png"        
    },

    PO002: {
        nombre: "Quinoa Orgánica",
        categoria: "Productos Orgánicos",
        precio: "Próximamente",
        descripcion: "Fuente excepcional de proteína completa, fibra y minerales esenciales. Perfecta para ensaladas, guisos o como el sustituto ideal del arroz.",
        origen: "Valle del Maule",
        disponibilidad: "Próximamente",
        imagen: "../images/PO002 - QuinoaOrganica.png"        
    },

    PL001: {
        nombre: "Leche Entera",
        categoria: "Productos Lácteos",
        precio: "Próximamente",
        descripcion: "Disfruta del sabor y la cremosidad de siempre con nuestra leche entera! 100% pura, natural y una excelente fuente de calcio y energía, es la opción ideal para desayunos perfectos, recetas deliciosas y para cuidar el bienestar de toda tu familia.",
        origen: "Valle del Maule",
        disponibilidad: "120 Litros",
        imagen: "../images/PL001 - lecheEntera.png"        
    },
}



const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get("id");
console.log("ID recibido:", idProducto);
const producto = productos[idProducto];
console.log("Producto encontrado:", producto);

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
    const avisoSinPrecio = document.getElementById("aviso-sin-precio");
    const campoCantidad = document.getElementById("cantidad");
    const productoDisponibleParaCompra = producto.precio !== "Próximamente";
    const disponibilidad = /^(\d+)\s+(.+)$/u.exec(producto.disponibilidad.trim());

    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;

    accionesCompra.hidden = !productoDisponibleParaCompra;
    accionesCompra.classList.toggle("d-flex", productoDisponibleParaCompra);
    avisoSinPrecio.hidden = productoDisponibleParaCompra;

    if (disponibilidad) {
        campoCantidad.max = disponibilidad[1];
        campoCantidad.dataset.unidadDisponible = disponibilidad[2].toLocaleLowerCase("es");
    }
}