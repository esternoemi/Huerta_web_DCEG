
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { regionesChile } from "../data/ubicaciones.js";

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
  const limpio = run.trim().toLocaleUpperCase("es");

  if (!/^\d{6,8}[0-9K]$/u.test(limpio)) {
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

function obtenerFechaLocal() {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
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

    if (
      !formulario.nombre.trim() ||
      !/^[\p{L}\p{M} ]+$/u.test(formulario.nombre.trim())
    ) {
      nuevosErrores.nombre = "Ingresa un nombre válido usando solo letras y espacios.";
    }

    if (
      !formulario.apellido.trim() ||
      !/^[\p{L}\p{M} ]+$/u.test(formulario.apellido.trim())
    ) {
      nuevosErrores.apellido = "Ingresa un apellido válido usando solo letras y espacios.";
    }

    const correo = formulario.correo.trim();
    const dominio = correo.split("@")[1]?.toLocaleLowerCase("es");
    if (
      !/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/u.test(correo) ||
      !["duoc.cl", "profesor.duoc.cl", "gmail.com"].includes(dominio)
    ) {
      nuevosErrores.correo =
        "Usa un correo válido de duoc.cl, profesor.duoc.cl o gmail.com.";
    }

    if (!validarContrasena(formulario.contrasena)) {
      nuevosErrores.contrasena =
        "La contraseña debe tener entre 4 y 10 caracteres e incluir mayúscula, minúscula, número y símbolo.";
    }

    if (formulario.confirmarContrasena !== formulario.contrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden.";
    }

    if (
      formulario.fechaNacimiento &&
      formulario.fechaNacimiento > obtenerFechaLocal()
    ) {
      nuevosErrores.fechaNacimiento = "La fecha no puede ser futura.";
    }

    const regionSeleccionada = regionesChile.find(
      (region) => region.nombre === formulario.region,
    );
    if (!regionSeleccionada) {
      nuevosErrores.region = "Selecciona una región.";
    } else if (!regionSeleccionada.comunas.includes(formulario.comuna)) {
      nuevosErrores.comuna = "Selecciona una comuna.";
    }

    if (!formulario.direccion.trim() || formulario.direccion.length > 300) {
      nuevosErrores.direccion =
        "Ingresa una dirección de hasta 300 caracteres.";
    }

    if (!/^\d{9,}$/u.test(formulario.telefono.trim())) {
      nuevosErrores.telefono =
        "Ingresa un teléfono de al menos 9 dígitos, solo números.";
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
      const datos = { ...formulario };
      delete datos.confirmarContrasena;

      await registrarCliente({
        ...datos,
        run: datos.run.trim().toLocaleUpperCase("es"),
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
        maxLength={
          nombre === "run"
            ? 9
            : nombre === "nombre"
              ? 50
              : nombre === "apellido" || nombre === "correo"
                ? 100
                : nombre === "contrasena" || nombre === "confirmarContrasena"
                  ? 10
                  : nombre === "direccion"
                    ? 300
                    : undefined
        }
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
                      aria-describedby={errores.region ? "region-error" : undefined}
                    >
                      <option value="">Selecciona una región</option>
                      {regionesChile.map((region) => (
                        <option key={region.nombre} value={region.nombre}>
                          {region.nombre}
                        </option>
                      ))}
                    </select>
                    {errores.region && (
                      <div id="region-error" className="invalid-feedback">
                        {errores.region}
                      </div>
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
                      aria-describedby={errores.comuna ? "comuna-error" : undefined}
                    >
                      <option value="">Selecciona una comuna</option>
                      {(
                        regionesChile.find(
                          (region) => region.nombre === formulario.region,
                        )?.comunas ?? []
                      ).map((comuna) => (
                        <option key={comuna} value={comuna}>{comuna}</option>
                      ))}
                    </select>
                    {errores.comuna && (
                      <div id="comuna-error" className="invalid-feedback">
                        {errores.comuna}
                      </div>
                    )}
                  </div>
                </div>

                {campo("direccion", "Dirección")}
                {campo("telefono", "Número de contacto", "tel")}

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
