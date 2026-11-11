import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../../context/useCategories.js";
import { useProducts } from "../../context/useProducts.js";
import { EmptyState, PageError } from "../../components/shared/PageFeedback.jsx";

export default function AdminCategoriesPage() {
  const { categorias, error, eliminar } = useCategories();
  const { productos } = useProducts();
  const [mensaje, setMensaje] = useState("");

  function eliminarCategoria(categoria) {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;
    try {
      eliminar(categoria.id);
      setMensaje(`Categoría "${categoria.nombre}" eliminada.`);
    } catch (errorEliminar) {
      setMensaje(errorEliminar instanceof Error ? errorEliminar.message : "No se pudo eliminar la categoría.");
    }
  }

  if (error) return <PageError mensaje={`No se pudieron cargar las categorías: ${error}`} />;

  return (
    <section className="container-fluid">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h3 mb-1">Categorías</h1>
          <p className="text-muted mb-0">Organiza los productos de la tienda.</p>
        </div>
        <Link className="btn btn-success" to="/admin/categorias/nueva">Nueva categoría</Link>
      </div>
      {mensaje && <div className="alert alert-info" role="status">{mensaje}</div>}
      {categorias.length === 0 ? (
        <EmptyState mensaje="Aún no hay categorías. Puedes crear la primera con el botón Nueva categoría." />
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead><tr><th>Nombre</th><th>Productos activos</th><th>Acciones</th></tr></thead>
                <tbody>
                  {categorias.map((categoria) => (
                    <tr key={categoria.id}>
                      <td>{categoria.nombre}</td>
                      <td>{productos.filter((producto) => producto.categoriaId === categoria.id && producto.activo).length}</td>
                      <td className="d-flex flex-wrap gap-2">
                        <Link className="btn btn-sm btn-outline-success" to={`/admin/categorias/${encodeURIComponent(categoria.id)}/editar`}>Editar</Link>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => eliminarCategoria(categoria)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
