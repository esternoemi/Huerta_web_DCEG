import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
    EmptyState as EstadoVacio,
    PageError as ErrorPagina,
} from "../src/components/shared/PageFeedback.jsx";

describe("Mensajes de página", () => {
    it("muestra los errores como alertas y conserva el contenido adicional", () => {
        render(
            <ErrorPagina mensaje="No se pudo cargar">
                <button>Reintentar</button>
            </ErrorPagina>,
        );

        expect(screen.getByRole("alert")).toHaveTextContent("No se pudo cargar");
        expect(screen.getByRole("button", { name: "Reintentar" }))
            .toBeInTheDocument();
    });

    it("muestra el estado vacío con un mensaje accesible", () => {
        render(<EstadoVacio mensaje="No hay productos disponibles" />);

        expect(screen.getByRole("status"))
            .toHaveTextContent("No hay productos disponibles");
    });
});
