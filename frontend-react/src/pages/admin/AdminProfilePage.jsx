import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";

const CAMPOS = [
  ["nombre", "Nombre"], ["apellido", "Apellido"], ["correo", "Correo electrónico"],
  ["telefono", "Teléfono"], ["direccion", "Dirección"], ["region", "Región"], ["comuna", "Comuna"],
];

export default function AdminProfilePage() {
  const { usuario, actualizarPerfil } = useAuth();
  const [formulario, setFormulario] = useState(() =>
    Object.fromEntries(CAMPOS.map(([campo]) => [campo, usuario?.[campo] ?? ""])),
  );
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function guardar(evento) {
    evento.preventDefault();
    setMensaje("");
    setGuardando(true);
    try {
      await actualizarPerfil(formulario);
      setMensaje("Tu perfil se actualizó correctamente.");
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo guardar el perfil.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="container-fluid">
      <h1 className="h3 mb-3">Mi perfil</h1>
      <div className="card shadow-sm"><div className="card-body">
        {mensaje && <div className={`alert ${mensaje.includes("correctamente") ? "alert-success" : "alert-danger"}`} role={mensaje.includes("correctamente") ? "status" : "alert"}>{mensaje}</div>}
        <form onSubmit={guardar}>
          <div className="row g-3">
            {CAMPOS.map(([campo, etiqueta]) => (
              <div className="col-12 col-md-6" key={campo}>
                <label htmlFor={`perfil-${campo}`} className="form-label">{etiqueta}</label>
                <input id={`perfil-${campo}`} name={campo} type={campo === "correo" ? "email" : "text"} className="form-control" value={formulario[campo]} onChange={(evento) => setFormulario((anterior) => ({ ...anterior, [campo]: evento.target.value }))} required={["nombre", "apellido", "correo"].includes(campo)} maxLength={campo === "direccion" ? 300 : undefined} />
              </div>
            ))}
          </div>
          <div className="mt-4 d-flex flex-wrap gap-2">
            <button type="submit" className="btn btn-success" disabled={guardando}>{guardando ? "Guardando..." : "Guardar cambios"}</button>
            <Link to={`/admin/usuarios/${encodeURIComponent(usuario.id)}`} className="btn btn-outline-secondary">Ver perfil</Link>
          </div>
          <p className="form-text mt-3 mb-0">El rol se conserva; no se puede cambiar desde el perfil propio.</p>
        </form>
      </div></div>
    </section>
  );
}
