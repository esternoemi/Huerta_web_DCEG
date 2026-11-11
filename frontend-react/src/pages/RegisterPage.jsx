
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const REGIONES_COMUNAS = {
  "Arica y Parinacota": ["Arica", "Camarones", "Putre"],
  Tarapacá: ["Iquique", "Alto Hospicio", "Pozo Almonte"],
  Antofagasta: ["Antofagasta", "Calama", "Mejillones"],
  Atacama: ["Copiapó", "Caldera", "Vallenar"],
  Coquimbo: ["La Serena", "Coquimbo", "Ovalle"],
  Valparaíso: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"],
  Metropolitana: ["Santiago", "San Bernardo", "Puente Alto", "Maipú", "Providencia", "La Florida"],
  "O'Higgins": ["Rancagua", "Rengo", "San Fernando"],
  Maule: ["Talca", "Curicó", "Linares"],
  Ñuble: ["Chillán", "San Carlos", "Bulnes"],
  Biobío: ["Concepción", "Talcahuano", "Los Ángeles"],
  "La Araucanía": ["Temuco", "Villarrica", "Pucón"],
  "Los Ríos": ["Valdivia", "La Unión", "Panguipulli"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Puerto Varas"],
  Aysén: ["Coyhaique", "Puerto Aysén"],
  Magallanes: ["Punta Arenas", "Puerto Natales"],
};

const CAMPOS_INICIALES = {
  run: "",
  nombre: "",
  apellido: "",
  correo: "",
  contrasena: "",
  confirmarContrasena: "",
  fechaNacimiento: "",
  region: "",
  comuna: "",
  direccion: "",
  telefono: "",
};

function validarRun(run) {
  const limpio = run.replace(/[^0-9kK]/g, "").toUpperCase();

  if (!/^\d{7,8}[0-9K]$/.test(limpio)) {
    return false;
  }

  const cuerpo = limpio.slice(0, -1);
  const digito = limpio.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resultado = 11 - (suma % 11);
  const esperado =
    resultado === 11 ? "0" : resultado === 10 ? "K" : String(resultado);

  return digito === esperado;
}

function validarContrasena(contrasena) {
  return (
    contrasena.length >= 4 &&
    contrasena.length <= 10 &&
    /\p{Lu}/u.test(contrasena) &&
    /\p{Ll}/u.test(contrasena) &&
    /\p{N}/u.test(contrasena) &&
    /[^\p{L}\p{N}\s]/u.test(contrasena)
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registrarCliente } = useAuth();

  const [formulario, setFormulario] = useState(CAMPOS_INICIALES);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando] = useState(false);

  const actualizarCampo = (evento) => {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
      ...(name === "region" ? { comuna: "" } : {}),
    }));

    setErrores((anterior) => ({
      ...anterior,
      [name]: "",
      ...(name === "region" ? { comuna: "" } : {}),
    }));

    setErrorGeneral("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!validarRun(formulario.run)) {
      nuevosErrores.run = "Ingresa un RUN chileno válido.";
    }

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "Debes ingresar tu nombre.";
    }

    if (!formulario.apellido.trim()) {
      nuevosErrores.apellido = "Debes ingresar tu apellido.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo.trim())) {
      nuevosErrores.correo = "Ingresa un correo electrónico válido.";
    }

    if (!validarContrasena(formulario.contrasena)) {
      nuevosErrores.contrasena =
        "La contraseña debe tener entre 4 y 10 caracteres e incluir mayúscula, minúscula, número y símbolo.";
    }

    if (formulario.confirmarContrasena !== formulario.contrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden.";
    }

    if (!formulario.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "Selecciona tu fecha de nacimiento.";
    } else if (formulario.fechaNacimiento > new Date().toLocaleDateString("en-CA")) {
      nuevosErrores.fechaNacimiento = "La fecha no puede ser futura.";
    }

    if (!formulario.region) {
      nuevosErrores.region = "Selecciona una región.";
    }

    if (!formulario.comuna) {
      nuevosErrores.comuna = "Selecciona una comuna.";
    }

    if (!formulario.direccion.trim()) {
      nuevosErrores.direccion = "Ingresa tu dirección.";
    }

    if (
      formulario.telefono.trim() &&
      !/^\+?[0-9\s-]{8,15}$/.test(formulario.telefono.trim())
    ) {
      nuevosErrores.telefono = "Ingresa un teléfono válido.";
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
      const { confirmarContrasena, ...datos } = formulario;

      await registrarCliente({
        ...datos,
        run: datos.run.trim().toUpperCase(),
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        correo: datos.correo.trim().toLowerCase(),
        direccion: datos.direccion.trim(),
        telefono: datos.telefono.trim(),
      });

      navigate("/login", {
        replace: true,
        state: { mensaje: "Tu cuenta fue creada correctamente. Ya puedes iniciar sesión." },
      });
    } catch (error) {
      setErrorGeneral(
        error.message || "No se pudo completar el registro."
      );
    } finally {
      setCargando(false);
    }
  };

  const campo = (nombre, etiqueta, tipo = "text", obligatorio = true) => (
    <div className="mb-3">
      <label htmlFor={nombre} className="form-label">
        {etiqueta}
      </label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        className={`form-control ${errores[nombre] ? "is-invalid" : ""}`}
        value={formulario[nombre]}
        onChange={actualizarCampo}
        disabled={cargando}
        required={obligatorio}
        aria-invalid={Boolean(errores[nombre])}
        aria-describedby={errores[nombre] ? `${nombre}-error` : undefined}
        autoComplete={
          nombre === "contrasena"
            ? "new-password"
            : nombre === "confirmarContrasena"
              ? "new-password"
              : undefined
        }
      />
      {errores[nombre] && (
        <div id={`${nombre}-error`} className="invalid-feedback">
          {errores[nombre]}
        </div>
      )}
    </div>
  );

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="text-center mb-3">Crear una cuenta</h1>
              <p className="text-center text-muted mb-4">
                Regístrate como cliente de Huerto Hogar.
              </p>

              {errorGeneral && (
                <div className="alert alert-danger" role="alert">
                  {errorGeneral}
                </div>
              )}

              <form onSubmit={enviarFormulario} noValidate>
                <h2 className="h5 mb-3">Datos personales</h2>

                <div className="row">
                  <div className="col-md-6">
                    {campo("run", "RUN")}
                  </div>
                  <div className="col-md-6">
                    {campo("fechaNacimiento", "Fecha de nacimiento", "date")}
                  </div>
                  <div className="col-md-6">
                    {campo("nombre", "Nombre")}
                  </div>
                  <div className="col-md-6">
                    {campo("apellido", "Apellido")}
                  </div>
                </div>

                <h2 className="h5 mt-4 mb-3">Datos de acceso</h2>

                {campo("correo", "Correo electrónico", "email")}

                <div className="row">
                  <div className="col-md-6">
                    {campo("contrasena", "Contraseña", "password")}
                  </div>
                  <div className="col-md-6">
                    {campo("confirmarContrasena", "Confirmar contraseña", "password")}
                  </div>
                </div>

                <p className="small text-muted">
                  La contraseña debe tener entre 4 y 10 caracteres, con
                  mayúscula, minúscula, número y símbolo.
                </p>

                <h2 className="h5 mt-4 mb-3">Dirección y contacto</h2>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="region" className="form-label">
                      Región
                    </label>
                    <select
                      id="region"
                      name="region"
                      className={`form-select ${errores.region ? "is-invalid" : ""}`}
                      value={formulario.region}
                      onChange={actualizarCampo}
                      disabled={cargando}
                      aria-invalid={Boolean(errores.region)}
                    >
                      <option value="">Selecciona una región</option>
                      {Object.keys(REGIONES_COMUNAS).map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {errores.region && (
                      <div className="invalid-feedback">{errores.region}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="comuna" className="form-label">
                      Comuna
                    </label>
                    <select
                      id="comuna"
                      name="comuna"
                      className={`form-select ${errores.comuna ? "is-invalid" : ""}`}
                      value={formulario.comuna}
                      onChange={actualizarCampo}
                      disabled={!formulario.region || cargando}
                      aria-invalid={Boolean(errores.comuna)}
                    >
                      <option value="">Selecciona una comuna</option>
                      {(REGIONES_COMUNAS[formulario.region] || []).map((comuna) => (
                        <option key={comuna} value={comuna}>
                          {comuna}
                        </option>
                      ))}
                    </select>
                    {errores.comuna && (
                      <div className="invalid-feedback">{errores.comuna}</div>
                    )}
                  </div>
                </div>

                {campo("direccion", "Dirección")}
                {campo("telefono", "Teléfono (opcional)", "tel", false)}

                <button
                  type="submit"
                  className="btn btn-success w-100 mt-3"
                  disabled={cargando}
                >
                  {cargando ? "Registrando..." : "Crear cuenta"}
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login">Inicia sesión aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
