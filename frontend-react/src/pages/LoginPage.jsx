
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { iniciarSesion } = useAuth();

  const [formulario, setFormulario] = useState({
    correo: "",
    contrasena: "",
  });

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando] = useState(false);

  const actualizarCampo = (evento) => {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setErrores((anterior) => ({
      ...anterior,
      [name]: "",
    }));

    setErrorGeneral("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(formulario.correo.trim())) {
      nuevosErrores.correo = "Ingresa un correo electrónico válido.";
    }

    if (!formulario.contrasena) {
      nuevosErrores.contrasena = "Debes ingresar tu contraseña.";
    }

    return nuevosErrores;
  };

  const enviarFormulario = async (evento) => {
    evento.preventDefault();
    setErrorGeneral("");

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setCargando(true);

    try {
      const usuario = await iniciarSesion({
        correo: formulario.correo.trim(),
        contrasena: formulario.contrasena,
      });

        if (usuario.rol === "administrador") {
            navigate("/admin", { replace: true });
        } else if (usuario.rol === "vendedor") {
            navigate("/vendedor/productos", { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    } catch (error) {
      setErrorGeneral(
        error.message || "No se pudo iniciar sesión. Inténtalo nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="text-center mb-3">Iniciar sesión</h1>

              <p className="text-center text-muted mb-4">
                Ingresa a tu cuenta de Huerto Hogar.
              </p>

              {location.state?.mensaje && (
                <div className="alert alert-success" role="status">
                  {location.state.mensaje}
                </div>
              )}

              {errorGeneral && (
                <div className="alert alert-danger" role="alert">
                  {errorGeneral}
                </div>
              )}

              <form onSubmit={enviarFormulario} noValidate>
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    className={`form-control ${
                      errores.correo ? "is-invalid" : ""
                    }`}
                    placeholder="ejemplo@correo.cl"
                    value={formulario.correo}
                    onChange={actualizarCampo}
                    autoComplete="email"
                    aria-invalid={Boolean(errores.correo)}
                    aria-describedby={
                      errores.correo ? "correo-error" : undefined
                    }
                    disabled={cargando}
                  />

                  {errores.correo && (
                    <div id="correo-error" className="invalid-feedback">
                      {errores.correo}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="contrasena" className="form-label">
                    Contraseña
                  </label>

                  <input
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    className={`form-control ${
                      errores.contrasena ? "is-invalid" : ""
                    }`}
                    placeholder="Ingresa tu contraseña"
                    value={formulario.contrasena}
                    onChange={actualizarCampo}
                    autoComplete="current-password"
                    aria-invalid={Boolean(errores.contrasena)}
                    aria-describedby={
                      errores.contrasena ? "contrasena-error" : undefined
                    }
                    disabled={cargando}
                  />

                  {errores.contrasena && (
                    <div
                      id="contrasena-error"
                      className="invalid-feedback"
                    >
                      {errores.contrasena}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={cargando}
                >
                  {cargando ? "Ingresando..." : "Iniciar sesión"}
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                ¿No tienes una cuenta?{" "}
                <Link to="/registro">Regístrate aquí</Link>
              </p>

              <div className="text-center mt-3">
                <Link to="/" className="text-decoration-none">
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
