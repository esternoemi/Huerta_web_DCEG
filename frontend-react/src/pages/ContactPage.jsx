
import { useState } from "react";

const ContactPage = () => {
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const [errores, setErrores] = useState({});
  const [confirmacion, setConfirmacion] = useState("");

  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));

    setErrores((actual) => ({
      ...actual,
      [name]: "",
    }));

    setConfirmacion("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (formulario.nombre.trim().length < 2) {
      nuevosErrores.nombre = "Ingresa un nombre de al menos 2 caracteres.";
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(formulario.correo.trim())) {
      nuevosErrores.correo = "Ingresa un correo electrónico válido.";
    }

    if (formulario.mensaje.trim().length < 10) {
      nuevosErrores.mensaje =
        "El mensaje debe contener al menos 10 caracteres.";
    } else if (formulario.mensaje.length > 500) {
      nuevosErrores.mensaje =
        "El mensaje no puede superar los 500 caracteres.";
    }

    return nuevosErrores;
  };

  const enviarFormulario = (e) => {
    e.preventDefault();

    setConfirmacion("");

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    try {
      const mensajesGuardados = JSON.parse(
        localStorage.getItem("huertoMensajesContacto") || "[]"
      );

      if (!Array.isArray(mensajesGuardados)) {
        throw new Error("Los mensajes guardados no son válidos.");
      }

      const nuevoMensaje = {
        id: Date.now().toString(),
        nombre: formulario.nombre.trim(),
        correo: formulario.correo.trim(),
        mensaje: formulario.mensaje.trim(),
        fecha: new Date().toISOString(),
      };

      localStorage.setItem(
        "huertoMensajesContacto",
        JSON.stringify([...mensajesGuardados, nuevoMensaje])
      );

      setFormulario({
        nombre: "",
        correo: "",
        mensaje: "",
      });

      setErrores({});
      setConfirmacion(
        "Tu mensaje se ha guardado correctamente en este navegador."
      );
    } catch {
      setErrores({
        general: "No se pudo guardar el mensaje. Inténtalo nuevamente.",
      });
    }
  };

  return (
    <main className="container my-5">
      <div className="row g-5">
        <div className="col-12 col-lg-5">
          <p className="text-success fw-bold text-uppercase">
            Hablemos
          </p>

          <h1 className="display-4 fw-bold text-success mb-4">
            Contacto
          </h1>

          <p className="lead">
            ¿Tienes preguntas sobre nuestros productos o entregas?
            Cuéntanos qué necesitas y envíanos un mensaje desde
            el formulario.
          </p>

          <div className="mt-4">
            <p>
              <strong>Cobertura</strong>
            </p>

            <p>
              Atendemos pedidos en Santiago, Puerto Montt,
              Villarrica, Nacimiento, Viña del Mar,
              Valparaíso y Concepción.
            </p>

            <p>
              <strong>Consultas</strong>
            </p>

            <p>
              El formulario permite guardar tu mensaje en este
              navegador para esta demostración.
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <form
            onSubmit={enviarFormulario}
            noValidate
            className="card shadow-sm p-4"
          >
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                className={`form-control ${
                  errores.nombre ? "is-invalid" : ""
                }`}
                value={formulario.nombre}
                onChange={actualizarCampo}
                aria-describedby={
                  errores.nombre ? "nombre-error" : undefined
                }
                aria-invalid={Boolean(errores.nombre)}
              />

              {errores.nombre && (
                <div
                  className="invalid-feedback"
                  id="nombre-error"
                >
                  {errores.nombre}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="correo" className="form-label">
                Correo electrónico
              </label>

              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="email"
                required
                className={`form-control ${
                  errores.correo ? "is-invalid" : ""
                }`}
                value={formulario.correo}
                onChange={actualizarCampo}
                aria-describedby={
                  errores.correo ? "correo-error" : undefined
                }
                aria-invalid={Boolean(errores.correo)}
              />

              {errores.correo && (
                <div
                  className="invalid-feedback"
                  id="correo-error"
                >
                  {errores.correo}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="mensaje" className="form-label">
                Mensaje
              </label>

              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                maxLength="500"
                required
                className={`form-control ${
                  errores.mensaje ? "is-invalid" : ""
                }`}
                value={formulario.mensaje}
                onChange={actualizarCampo}
                aria-describedby="mensaje-error mensaje-contador"
                aria-invalid={Boolean(errores.mensaje)}
              />

              {errores.mensaje && (
                <div
                  className="invalid-feedback"
                  id="mensaje-error"
                >
                  {errores.mensaje}
                </div>
              )}

              <div
                className="form-text"
                id="mensaje-contador"
              >
                {formulario.mensaje.length}/500 caracteres
              </div>
            </div>

            {errores.general && (
              <div className="alert alert-danger" role="alert">
                {errores.general}
              </div>
            )}

            {confirmacion && (
              <div
                className="alert alert-success"
                role="status"
                aria-live="polite"
              >
                {confirmacion}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-success"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
