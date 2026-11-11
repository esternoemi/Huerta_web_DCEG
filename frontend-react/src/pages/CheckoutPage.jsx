import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { useCart } from "../context/useCart.js";
import { useOrders } from "../context/useOrders.js";
import { regionesChile } from "../data/ubicaciones.js";
import { validarCheckout } from "../services/checkoutService.js";
import { formatoCLP } from "../services/formatService.js";

function crearFormulario(usuario) {
  return {
    nombre: usuario?.nombre ?? "",
    apellido: usuario?.apellido ?? "",
    correo: usuario?.correo ?? "",
    calle: usuario?.direccion ?? "",
    departamento: "",
    region: usuario?.region ?? "",
    comuna: usuario?.comuna ?? "",
    indicaciones: "",
    resultadoDemostracion: "exito",
  };
}

function MensajeCampo({ id, mensaje }) {
  if (!mensaje) {
    return null;
  }

  return (
    <div id={id} className="text-danger small mt-1">
      {mensaje}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { lineas, total, vaciar } = useCart();
  const { crear } = useOrders();
  const [formulario, setFormulario] = useState(() => crearFormulario(usuario));
  const [errores, setErrores] = useState({});
  const [errorOperacion, setErrorOperacion] = useState("");
  const [procesando, setProcesando] = useState(false);

  const comunas = regionesChile.find(
    (region) => region.nombre === formulario.region,
  )?.comunas ?? [];

  function actualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({
      ...actual,
      [name]: value,
      ...(name === "region" ? { comuna: "" } : {}),
    }));
    setErrores((actual) => ({
      ...actual,
      [name]: "",
      ...(name === "region" ? { comuna: "" } : {}),
    }));
    setErrorOperacion("");
  }

  function confirmarCompra(evento) {
    evento.preventDefault();
    setErrorOperacion("");

    const nuevosErrores = validarCheckout(formulario);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setProcesando(true);
    try {
      const orden = crear({
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
      });

      if (orden.resultadoDemostracion === "exito") {
        vaciar();
      }

      navigate(
        `/compra/${orden.resultadoDemostracion}/${encodeURIComponent(orden.id)}`,
      );
    } catch (error) {
      setErrorOperacion(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la compra.",
      );
    } finally {
      setProcesando(false);
    }
  }

  if (lineas.length === 0) {
    return (
      <main className="container my-5 text-center">
        <h1>Finalizar compra</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/productos" className="btn btn-success">
          Ver productos
        </Link>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <h1 className="text-center mb-4">Finalizar compra</h1>

      <div className="row g-4">
        <div className="col-lg-7">
          <form onSubmit={confirmarCompra} noValidate>
            <h2 className="h4 mb-3">Datos del cliente</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  className={`form-control${errores.nombre ? " is-invalid" : ""}`}
                  value={formulario.nombre}
                  onChange={actualizarCampo}
                  required
                  aria-invalid={Boolean(errores.nombre)}
                  aria-describedby={errores.nombre ? "nombre-error" : undefined}
                />
                <MensajeCampo id="nombre-error" mensaje={errores.nombre} />
              </div>
              <div className="col-md-6">
                <label htmlFor="apellido" className="form-label">Apellido</label>
                <input
                  id="apellido"
                  name="apellido"
                  className={`form-control${errores.apellido ? " is-invalid" : ""}`}
                  value={formulario.apellido}
                  onChange={actualizarCampo}
                  required
                  aria-invalid={Boolean(errores.apellido)}
                  aria-describedby={errores.apellido ? "apellido-error" : undefined}
                />
                <MensajeCampo id="apellido-error" mensaje={errores.apellido} />
              </div>
              <div className="col-12">
                <label htmlFor="correo" className="form-label">
                  Correo electrónico
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  className={`form-control${errores.correo ? " is-invalid" : ""}`}
                  value={formulario.correo}
                  onChange={actualizarCampo}
                  required
                  aria-invalid={Boolean(errores.correo)}
                  aria-describedby={errores.correo ? "correo-error" : undefined}
                />
                <MensajeCampo id="correo-error" mensaje={errores.correo} />
              </div>
            </div>

            <h2 className="h4 mt-4 mb-3">Dirección de entrega</h2>
            <div className="row g-3">
              <div className="col-md-8">
                <label htmlFor="calle" className="form-label">Calle y número</label>
                <input
                  id="calle"
                  name="calle"
                  className={`form-control${errores.calle ? " is-invalid" : ""}`}
                  value={formulario.calle}
                  onChange={actualizarCampo}
                  required
                  aria-invalid={Boolean(errores.calle)}
                  aria-describedby={errores.calle ? "calle-error" : undefined}
                />
                <MensajeCampo id="calle-error" mensaje={errores.calle} />
              </div>
              <div className="col-md-4">
                <label htmlFor="departamento" className="form-label">
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
                <label htmlFor="region" className="form-label">Región</label>
                <select
                  id="region"
                  name="region"
                  className={`form-select${errores.region ? " is-invalid" : ""}`}
                  value={formulario.region}
                  onChange={actualizarCampo}
                  required
                  aria-invalid={Boolean(errores.region)}
                  aria-describedby={errores.region ? "region-error" : undefined}
                >
                  <option value="">Selecciona una región</option>
                  {regionesChile.map((region) => (
                    <option key={region.nombre} value={region.nombre}>
                      {region.nombre}
                    </option>
                  ))}
                </select>
                <MensajeCampo id="region-error" mensaje={errores.region} />
              </div>
              <div className="col-md-6">
                <label htmlFor="comuna" className="form-label">Comuna</label>
                <select
                  id="comuna"
                  name="comuna"
                  className={`form-select${errores.comuna ? " is-invalid" : ""}`}
                  value={formulario.comuna}
                  onChange={actualizarCampo}
                  required
                  disabled={!formulario.region}
                  aria-invalid={Boolean(errores.comuna)}
                  aria-describedby={errores.comuna ? "comuna-error" : undefined}
                >
                  <option value="">Selecciona una comuna</option>
                  {comunas.map((comuna) => (
                    <option key={comuna} value={comuna}>{comuna}</option>
                  ))}
                </select>
                <MensajeCampo id="comuna-error" mensaje={errores.comuna} />
              </div>
              <div className="col-12">
                <label htmlFor="indicaciones" className="form-label">
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
                <label htmlFor="resultadoDemostracion" className="form-label">
                  Resultado de demostración
                </label>
                <select
                  id="resultadoDemostracion"
                  name="resultadoDemostracion"
                  className="form-select"
                  value={formulario.resultadoDemostracion}
                  onChange={actualizarCampo}
                >
                  <option value="exito">Compra exitosa</option>
                  <option value="error">Compra rechazada</option>
                </select>
              </div>
            </div>

            {errorOperacion && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorOperacion}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-success mt-4"
              disabled={procesando}
            >
              {procesando ? "Procesando..." : "Confirmar compra"}
            </button>
          </form>
        </div>

        <div className="col-lg-5">
          <section className="card shadow-sm" aria-labelledby="resumen-compra">
            <div className="card-body">
              <h2 id="resumen-compra" className="h4 mb-3">
                Resumen del pedido
              </h2>
              {lineas.map((linea) => (
                <div
                  key={linea.producto.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>{linea.producto.nombre} x {linea.cantidad}</span>
                  <span>{formatoCLP(linea.subtotal)}</span>
                </div>
              ))}
              <hr />
              <p className="h5 text-end mb-0">Total: {formatoCLP(total)}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
