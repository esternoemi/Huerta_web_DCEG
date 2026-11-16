import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCart as usarCarrito } from "../src/context/useCart.js";
import TarjetaProducto from "../src/components/catalog/ProductCard.jsx";

vi.mock("../src/context/useCart.js", () => ({
    useCart: vi.fn(),
}));

const producto = {
    id: "VR001",
    nombre: "Zanahoria orgánica",
    descripcion: "Zanahorias frescas",
    imagen: "/images/zanahoria.png",
    precio: 1200,
    precioOferta: null,
    unidadVenta: "por kilo",
    stock: 5,
    activo: true,
    proximo: false,
};

function mostrarTarjeta(productoAProbar = producto) {
    return render(
        <MemoryRouter>
            <TarjetaProducto product={productoAProbar} />
        </MemoryRouter>,
    );
}

describe("Tarjeta de producto", () => {
    const agregar = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(usarCarrito).mockReturnValue({ agregar });
    });

    it("muestra la información del producto y permite abrir su detalle", () => {
        mostrarTarjeta();

        expect(screen.getByRole("heading", { name: producto.nombre })).toBeInTheDocument();
        expect(screen.getByText(producto.descripcion)).toBeInTheDocument();
        expect(screen.getByText("$1.200")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Ver detalle" }))
            .toHaveAttribute("href", "/productos/VR001");
        expect(screen.getByRole("button", { name: "Agregar al carrito" }))
            .toBeEnabled();
    });

    it("agrega el producto al carrito y comunica el resultado", () => {
        mostrarTarjeta();

        fireEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));

        expect(agregar).toHaveBeenCalledWith("VR001", 1);
        expect(screen.getByRole("status"))
            .toHaveTextContent("Producto agregado al carrito.");
    });

    it("deshabilita la compra de un producto sin stock y muestra su estado", () => {
        mostrarTarjeta({ ...producto, stock: 0 });

        expect(screen.getByText("Sin stock")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Agregar al carrito" }))
            .toBeDisabled();
    });

    it("muestra la imagen alternativa cuando la imagen no carga", () => {
        mostrarTarjeta();
        fireEvent.error(screen.getByRole("img", { name: producto.nombre }));

        expect(screen.getByRole("img", {
            name: `Imagen no disponible para ${producto.nombre}`,
        })).toBeInTheDocument();
    });
});
