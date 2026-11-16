import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DetalleOrden from "../src/components/orders/OrderDetails.jsx";
import { formatoCLP } from "../src/services/formatService.js";

const orden = {
    cliente: {
        nombre: "Ana",
        apellido: "Pérez",
        correo: "ana@example.com",
    },
    entrega: {
        calle: "Av. Central 123",
        departamento: "4B",
        comuna: "Santiago",
        region: "Metropolitana",
        indicaciones: "Tocar el timbre",
    },
    lineas: [
        {
            id: "linea-1",
            nombre: "Manzana Fuji",
            unidadVenta: "por kilo",
            precioUnitario: 1500,
            cantidad: 2,
            subtotal: 3000,
        },
    ],
    total: 3000,
};

describe("Detalle de la orden", () => {
    it("presenta los datos de cliente, entrega y productos de la orden", () => {
        render(<DetalleOrden orden={orden} />);

        expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
        expect(screen.getByText("ana@example.com")).toBeInTheDocument();
        expect(screen.getByText(
            "Av. Central 123, departamento 4B, Santiago, Metropolitana",
        )).toBeInTheDocument();
        expect(screen.getByText("Tocar el timbre")).toBeInTheDocument();

        const filaDelProducto = screen.getByRole("row", { name: /Manzana Fuji/ });
        expect(within(filaDelProducto).getByText("Manzana Fuji (por kilo)"))
            .toBeInTheDocument();
        expect(within(filaDelProducto).getByText(formatoCLP(1500)))
            .toBeInTheDocument();
        expect(within(filaDelProducto).getByText("2")).toBeInTheDocument();
        expect(within(filaDelProducto).getByText(formatoCLP(3000)))
            .toBeInTheDocument();
        const filaDelTotal = screen.getByRole("row", { name: /Total/ });
        expect(within(filaDelTotal).getByText(formatoCLP(orden.total)))
            .toBeInTheDocument();
    });

    it("omite los datos opcionales de entrega cuando no existen", () => {
        const ordenSinDatosOpcionales = {
            ...orden,
            entrega: {
                calle: "Calle 1",
                departamento: "",
                comuna: "Maipú",
                region: "Metropolitana",
                indicaciones: "",
            },
        };

        render(<DetalleOrden orden={ordenSinDatosOpcionales} />);

        expect(screen.getByText("Calle 1, Maipú, Metropolitana"))
            .toBeInTheDocument();
        expect(screen.queryByText(/Indicaciones:/)).not.toBeInTheDocument();
    });
});
