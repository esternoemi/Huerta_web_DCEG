
import { Link } from "react-router-dom";
import { useProducts } from "../../context/useProducts.js";

const STOCK_CRITICO = 5;

export default function AdminCriticalProductsPage() {
  const { productos, error } = useProducts();

  const productosCriticos = productos.filter(
    (producto) =>
      producto.activo && !producto.proximo && producto.stock <= STOCK_CRITICO
  );

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-3">Productos con stock crítico</h1>

      <p className="text-muted">
        Productos con {STOCK_CRITICO} unidades o menos disponibles.
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          No se pudo cargar el inventario: {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          {error ? null : productosCriticos.length === 0 ? (
            <div className="alert alert-success mb-0">
              No existen productos con stock crítico.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock disponible</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productosCriticos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>
                        {producto.stock} {producto.unidadStock}
                      </td>
                      <td>
                        <span className="badge bg-danger">
                          Stock crítico
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/admin/productos/${encodeURIComponent(producto.id)}/editar`}
                          className="btn btn-sm btn-outline-success"
                        >
                          Actualizar stock
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Link to="/admin/productos" className="btn btn-secondary mt-3">
        Volver a productos
      </Link>
    </div>
  );
}
