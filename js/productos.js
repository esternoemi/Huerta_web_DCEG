const productos = {
    FR001: {
        nombre: "Manzana Fuji",
        categoria: "Frutas Frescas",
        precio: "$1.200 por kilo",
        descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres.Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
        origen: "Valle del Maule",
        disponibilidad: "150 kilos",
        imagen: "../images/FR001 - manzanaFuji.png"
    }
}

const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get("id");
console.log("ID recibido:", idProducto);
const producto = productos[idProducto];
console.log("Producto encontrado:", producto);

if (producto) {
    document.getElementById("producto-categoria").textContent = producto.categoria;
    document.getElementById("producto-nombre").textContent = producto.nombre;
    document.getElementById("producto-precio").textContent = producto.precio;
    document.getElementById("producto-descripcion").textContent = producto.descripcion;
    document.getElementById("producto-origen").textContent = producto.origen;
    document.getElementById("producto-disponibilidad").textContent = producto.disponibilidad;

    const imagen = document.getElementById("producto-imagen");

    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
}