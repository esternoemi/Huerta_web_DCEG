
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart.js";
import { useOrders } from "../context/useOrders.js";

const CheckoutPage = () => {
    const navigate = useNavigate();

    // Obtener productos, total y función para vaciar el carrito
    const { lineas, total, vaciar } = useCart();

    // Obtener función para crear órdenes
    const { crear } = useOrders();

    // Estados del formulario
    const [error, setError] = useState("");
    const [procesando, setProcesando] = useState(false);

    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        calle: "",
        departamento: "",
        region: "",
        comuna: "",
        indicaciones: "",
        resultadoDemostracion: "exito",
    });

    // Formatear valores en pesos chilenos
    const formatoCLP = (valor) =>
        valor.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
        });

    // Actualizar los campos del formulario
    const actualizarCampo = (evento) => {
        const { name, value } = evento.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    };

    // Registrar la compra
    const confirmarCompra = (evento) => {
        evento.preventDefault();
        setError("");
        setProcesando(true);

        const datosCheckout = {
            cliente: {
                nombre: formulario.nombre,
                apellido: formulario.apellido,
                correo: formulario.correo,
            },
            entrega: {
                calle: formulario.calle,
                departamento: formulario.departamento,
                region: formulario.region,
                comuna: formulario.comuna,
                indicaciones: formulario.indicaciones,
            },
            resultadoDemostracion: formulario.resultadoDemostracion,
        };

        try {
            // Crear y guardar la orden
            const orden = crear(datosCheckout);

            // Vaciar el carrito solo si la compra fue exitosa
            if (orden.resultadoDemostracion === "exito") {
                vaciar();
            }

            // Mostrar la página de resultado
            navigate(
                `/compra/${orden.resultadoDemostracion}/${encodeURIComponent(orden.id)}`
            );
        } catch (err) {
            setError(err.message || "No se pudo registrar la compra.");
        } finally {
            setProcesando(false);
        }
    };

    // Mostrar mensaje si el carrito está vacío
    if (lineas.length === 0) {
        return (
            <main className="container my-5 text-center">
                <h1>Finalizar Compra</h1>

                <p>Tu carrito está vacío.</p>

                <Link to="/productos" className="btn btn-success">
                    Ver productos
                </Link>
            </main>
        );
    }

    return (
        <main className="container my-5">
            <h1 className="text-center mb-4 fs-1">
                Finalizar Compra
            </h1>

            <div className="row g-4">
                <div className="col-lg-7">
                    <form onSubmit={confirmarCompra}>
                        <h2 className="h4 mb-3">
                            Datos del cliente
                        </h2>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label
                                    htmlFor="nombre"
                                    className="form-label"
                                >
                                    Nombre
                                </label>

                                <input
                                    id="nombre"
                                    name="nombre"
                                    className="form-control"
                                    value={formulario.nombre}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label
                                    htmlFor="apellido"
                                    className="form-label"
                                >
                                    Apellido
                                </label>

                                <input
                                    id="apellido"
                                    name="apellido"
                                    className="form-control"
                                    value={formulario.apellido}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>

                            <div className="col-12">
                                <label
                                    htmlFor="correo"
                                    className="form-label"
                                >
                                    Correo electrónico
                                </label>

                                <input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    className="form-control"
                                    value={formulario.correo}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>
                        </div>

                        <h2 className="h4 mt-4 mb-3">
                            Dirección de entrega
                        </h2>

                        <div className="row g-3">
                            <div className="col-md-8">
                                <label
                                    htmlFor="calle"
                                    className="form-label"
                                >
                                    Calle y número
                                </label>

                                <input
                                    id="calle"
                                    name="calle"
                                    className="form-control"
                                    value={formulario.calle}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label
                                    htmlFor="departamento"
                                    className="form-label"
                                >
                                    Departamento
                                </label>

                                <input
                                    id="departamento"
                                    name="departamento"
                                    className="form-control"
                                    value={formulario.departamento}
                                    onChange={actualizarCampo}
                                />
                            </div>

                            <div className="col-md-6">
                                <label
                                    htmlFor="region"
                                    className="form-label"
                                >
                                    Región
                                </label>

                                <input
                                    id="region"
                                    name="region"
                                    className="form-control"
                                    value={formulario.region}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label
                                    htmlFor="comuna"
                                    className="form-label"
                                >
                                    Comuna
                                </label>

                                <input
                                    id="comuna"
                                    name="comuna"
                                    className="form-control"
                                    value={formulario.comuna}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>

                            <div className="col-12">
                                <label
                                    htmlFor="indicaciones"
                                    className="form-label"
                                >
                                    Indicaciones adicionales
                                </label>

                                <textarea
                                    id="indicaciones"
                                    name="indicaciones"
                                    className="form-control"
                                    rows="3"
                                    value={formulario.indicaciones}
                                    onChange={actualizarCampo}
                                />
                            </div>

                            <div className="col-12">
                                <label
                                    htmlFor="resultadoDemostracion"
                                    className="form-label"
                                >
                                    Resultado de demostración
                                </label>

                                <select
                                    id="resultadoDemostracion"
                                    name="resultadoDemostracion"
                                    className="form-select"
                                    value={formulario.resultadoDemostracion}
                                    onChange={actualizarCampo}
                                >
                                    <option value="exito">
                                        Compra exitosa
                                    </option>

                                    <option value="error">
                                        Compra rechazada
                                    </option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div
                                className="alert alert-danger mt-3"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-success mt-4"
                            disabled={procesando}
                        >
                            {procesando
                                ? "Procesando..."
                                : "Confirmar compra"}
                        </button>
                    </form>
                </div>

                <div className="col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="h4 mb-3">
                                Resumen del pedido
                            </h2>

                            {lineas.map((linea) => (
                                <div
                                    key={linea.producto.id}
                                    className="d-flex justify-content-between mb-2"
                                >
                                    <span>
                                        {linea.producto.nombre} x{" "}
                                        {linea.cantidad}
                                    </span>

                                    <span>
                                        {formatoCLP(linea.subtotal)}
                                    </span>
                                </div>
                            ))}

                            <hr />

                            <h3 className="h5 text-end">
                                Total: {formatoCLP(total)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CheckoutPage;
