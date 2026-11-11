import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUsers } from "../../context/useUsers.js";
import { useAuth } from "../../context/useAuth.js";
import { PageError } from "../../components/shared/PageFeedback.jsx";

const CAMPOS = ["run", "nombre", "apellido", "correo", "fechaNacimiento", "region", "comuna", "direccion", "telefono"];

export default function AdminUserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarios, error, crear, actualizar } = useUsers();
  const { usuario: actual } = useAuth();
  const usuario = usuarios.find((item) => item.id === id);
  const editando = Boolean(id);
  const [formulario, setFormulario] = useState(() => ({
    ...Object.fromEntries(CAMPOS.map((campo) => [campo, usuario?.[campo] ?? ""])),
    rol: usuario?.rol ?? "cliente",
    contrasena: "",
  }));
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);
  const esPropio = editando && usuario?.id === actual?.id;

  if (error) return <PageError mensaje={`No se pudieron cargar los usuarios: ${error}`} />;
  if (editando && !usuario) return <div className="alert alert-warning">No encontramos ese usuario. <Link to="/admin/usuarios">Volver a usuarios</Link></div>;

  function cambiar(evento) {
    setFormulario((anterior) => ({ ...anterior, [evento.target.name]: evento.target.value }));
    setMensaje("");
  }

  async function guardar(evento) {
    evento.preventDefault();
    setMensaje("");
    if (!editando && !formulario.contrasena) {
      setMensaje("Define una contraseña temporal para este perfil.");
      return;
    }
    setGuardando(true);
    try {
      const datos = {
        ...Object.fromEntries(CAMPOS.map((campo) => [campo, formulario[campo]])),
        rol: esPropio ? usuario.rol : formulario.rol,
      };
      if (formulario.contrasena) datos.contrasena = formulario.contrasena;
      if (editando) await actualizar(id, datos);
      else await crear({ ...datos, contrasena: formulario.contrasena });
      navigate("/admin/usuarios");
    } catch (errorGuardar) {
      setMensaje(errorGuardar instanceof Error ? errorGuardar.message : "No se pudo guardar el usuario.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="container-fluid">
      <h1 className="h3 mb-3">{editando ? "Editar usuario" : "Nuevo usuario"}</h1>
      <div className="card shadow-sm"><div className="card-body">
        {mensaje && <div className="alert alert-danger" role="alert">{mensaje}</div>}
        <form onSubmit={guardar}>
          <div className="row g-3">
            {CAMPOS.map((campo) => (
              <div className="col-12 col-md-6" key={campo}>
                <label className="form-label text-capitalize" htmlFor={`usuario-${campo}`}>{campo === "run" ? "RUN ficticio" : campo === "fechaNacimiento" ? "Fecha de nacimiento" : campo}</label>
                <input id={`usuario-${campo}`} name={campo} type={campo === "fechaNacimiento" ? "date" : campo === "correo" ? "email" : "text"} className="form-control" value={formulario[campo]} onChange={cambiar} required={["run", "nombre", "apellido", "correo"].includes(campo)} maxLength={campo === "direccion" ? 300 : undefined} />
              </div>
            ))}
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="rol">Rol</label>
              <select id="rol" name="rol" className="form-select" value={esPropio ? usuario.rol : formulario.rol} onChange={cambiar} disabled={esPropio}>
                <option value="cliente">Cliente</option><option value="vendedor">Vendedor</option><option value="administrador">Administrador</option>
              </select>
              {esPropio && <div className="form-text">No puedes cambiar tu propio rol desde esta pantalla.</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="contrasena">{editando ? "Nueva contraseña (opcional)" : "Contraseña temporal"}</label>
              <input id="contrasena" name="contrasena" type="password" className="form-control" value={formulario.contrasena} onChange={cambiar} minLength={4} maxLength={10} required={!editando} autoComplete="new-password" />
              <div className="form-text">4 a 10 caracteres, con mayúscula, minúscula, número y símbolo. Nunca se muestra después de guardar.</div>
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-success" disabled={guardando}>{guardando ? "Guardando..." : "Guardar usuario"}</button>
            <Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
          </div>
        </form>
      </div></div>
    </section>
  );
}
