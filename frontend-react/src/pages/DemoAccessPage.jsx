import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUsers } from "../context/useUsers.js";

const PERFILES_DEMO = [
  {
    rol: "administrador",
    nombre: "Administradora",
    apellido: "Demo",
    correo: "admin@demo.local",
    run: "DEMO-ADMIN",
  },
  {
    rol: "vendedor",
    nombre: "Vendedor",
    apellido: "Demo",
    correo: "vendedor@demo.local",
    run: "DEMO-VENDEDOR",
  },
];

export default function DemoAccessPage() {
  const navigate = useNavigate();
  const { usuarios, crear } = useUsers();
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [creando, setCreando] = useState(false);

  const perfilesPendientes = PERFILES_DEMO.filter(
    (perfil) => !usuarios.some((usuario) => usuario.correo === perfil.correo),
  );

  async function crearPerfiles(evento) {
    evento.preventDefault();
    setMensaje("");
    setError("");

    if (perfilesPendientes.length === 0) {
      setMensaje("Los perfiles de demostración ya están creados.");
      return;
    }

    setCreando(true);
    try {
      for (const perfil of perfilesPendientes) {
        await crear({
          ...perfil,
          contrasena,
        });
      }

      setMensaje(
        "Perfiles locales creados. Inicia sesión con los correos indicados y la contraseña que acabas de elegir.",
      );
      setContrasena("");
    } catch (errorCrear) {
      setError(
        errorCrear instanceof Error
          ? errorCrear.message
          : "No se pudieron crear los perfiles de demostración.",
      );
    } finally {
      setCreando(false);
    }
  }

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <span className="badge text-bg-warning mb-3">
                Solo para desarrollo local
              </span>
              <h1 className="h2">Preparar acceso de demostración</h1>
              <p>
                Crea perfiles ficticios para mostrar las pantallas de
                administración y vendedor. Esto no es una protección real:
                los permisos solo se simulan en el navegador.
              </p>

              <ul>
                {PERFILES_DEMO.map((perfil) => (
                  <li key={perfil.rol}>
                    {perfil.rol}: <strong>{perfil.correo}</strong>
                  </li>
                ))}
              </ul>

              {mensaje && (
                <div className="alert alert-success" role="status">
                  {mensaje}
                  {mensaje.startsWith("Perfiles locales creados") && (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => navigate("/login")}
                      >
                        Ir a iniciar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {perfilesPendientes.length > 0 ? (
                <form onSubmit={crearPerfiles}>
                  <label htmlFor="contrasena-demo" className="form-label">
                    Contraseña que usarás para ambos perfiles
                  </label>
                  <input
                    id="contrasena-demo"
                    className="form-control mb-2"
                    type="password"
                    minLength={4}
                    maxLength={10}
                    value={contrasena}
                    onChange={(evento) => setContrasena(evento.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={creando}
                  />
                  <p className="form-text">
                    Debe tener entre 4 y 10 caracteres, con mayúscula,
                    minúscula, número y símbolo. No reutilices una contraseña
                    personal.
                  </p>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={creando}
                  >
                    {creando ? "Creando perfiles..." : "Crear perfiles demo"}
                  </button>
                </form>
              ) : !mensaje ? (
                <div className="alert alert-info" role="status">
                  Ambos perfiles ya existen en este navegador. La contraseña
                  no se puede recuperar desde esta pantalla.
                </div>
              ) : null}

              <div className="mt-4">
                <Link to="/login" className="btn btn-outline-success">
                  Volver a iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
