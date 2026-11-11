
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/useProducts.js";
import { formatoCLP } from "../../services/formatService.js";

export default function AdminProductsPage() {
  const { productos, error, eliminar } = useProducts();
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");

  const productosFiltrados = productos.filter((producto) =>
    `${producto.nombre} ${producto.descripcion ?? ""}`
      .toLowerCase()
      .includes(busqueda.toLowerCase().trim())
  );

  function eliminarProducto(producto) {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar "${producto.nombre}"?`
    );

    if (!confirmar) return;

    try {
      eliminar(producto.id);
      setMensaje(`Producto "${producto.nombre}" eliminado correctamente.`);
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el producto."
      );
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Administración de productos</h1>
          <p className="text-muted mb-0">
            Gestiona los productos de Huerto Hogar.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link
            to="/admin/productos/reportes"
            className="btn btn-outline-success"
          >
            Reporte
          </Link>
          <Link
            to="/admin/productos/criticos"
            className="btn btn-outline-warning"
          >
            Stock crítico
          </Link>
          <Link
            to="/admin/productos/nuevo"
            className="btn btn-success"
          >
            Nuevo producto
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-info" role="status">
          {mensaje}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-3 align-items-center mb-3">
            <div className="col-12 col-md-8">
              <label htmlFor="buscar-producto" className="form-label">
                Buscar producto
              </label>
              <input
                id="buscar-producto"
                type="search"
                className="form-control"
                placeholder="Buscar por nombre o descripción"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 text-md-end">
              <p className="mb-0 mt-md-4">
                {error ? (
                  "Total no disponible"
                ) : (
                  <>Total: <strong>{productosFiltrados.length}</strong></>
                )}
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      <strong>{producto.nombre}</strong>
                      <div className="small text-muted">
                        {producto.unidadVenta}
                      </div>
                    </td>
                    <td>
                      {producto.precio === null
                        ? "Próximamente"
                        : formatoCLP(producto.precio)}
                    </td>
                    <td>
                      {producto.stock} {producto.unidadStock}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          producto.activo
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {producto.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Link
                          to={`/admin/productos/${encodeURIComponent(producto.id)}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Ver
                        </Link>
                        <Link
                          to={`/admin/productos/${encodeURIComponent(producto.id)}/editar`}
                          className="btn btn-sm btn-outline-success"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarProducto(producto)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!error && productosFiltrados.length === 0 && (
            <p className="text-center text-muted py-3 mb-0">
              No se encontraron productos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
