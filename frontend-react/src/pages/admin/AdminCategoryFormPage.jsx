import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCategories } from "../../context/useCategories.js";
import { PageError } from "../../components/shared/PageFeedback.jsx";

function crearId(nombre) {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}

export default function AdminCategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categorias, error, crear, actualizar } = useCategories();
  const categoria = categorias.find((item) => item.id === id);
  const editando = Boolean(id);
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  if (error) return <PageError mensaje={`No se pudieron cargar las categorías: ${error}`} />;
  if (editando && !categoria) {
    return <div className="alert alert-warning">No encontramos esa categoría. <Link to="/admin/categorias">Volver a categorías</Link></div>;
  }

  function guardar(evento) {
    evento.preventDefault();
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      setMensaje("Escribe el nombre de la categoría.");
      return;
    }
    setGuardando(true);
    try {
      if (editando) actualizar(id, { nombre: nombreLimpio });
      else crear({ id: crearId(nombreLimpio), nombre: nombreLimpio });
      navigate("/admin/categorias");
    } catch (errorGuardar) {
      setMensaje(errorGuardar instanceof Error ? errorGuardar.message : "No se pudo guardar la categoría.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="container-fluid">
      <h1 className="h3 mb-3">{editando ? "Editar categoría" : "Nueva categoría"}</h1>
      <div className="card shadow-sm"><div className="card-body">
        {mensaje && <div className="alert alert-danger" role="alert">{mensaje}</div>}
        <form onSubmit={guardar}>
          <label htmlFor="nombre-categoria" className="form-label">Nombre</label>
          <input id="nombre-categoria" className="form-control mb-3" value={nombre} onChange={(evento) => { setNombre(evento.target.value); setMensaje(""); }} maxLength={60} required />
          <p className="form-text">El identificador se crea desde el nombre y no se cambia al editar.</p>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success" disabled={guardando}>{guardando ? "Guardando..." : "Guardar categoría"}</button>
            <Link to="/admin/categorias" className="btn btn-outline-secondary">Cancelar</Link>
          </div>
        </form>
      </div></div>
    </section>
  );
}
