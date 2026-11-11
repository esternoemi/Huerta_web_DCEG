
import { Link, useParams } from "react-router-dom";
import { useProducts } from "../../context/useProducts.js";
import { useCategories } from "../../context/useCategories.js";
import { formatoCLP } from "../../services/formatService.js";

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const { productos } = useProducts();
  const { categorias } = useCategories();

  const producto = productos.find(
    (item) => String(item.id) === String(id)
  );

  if (!producto) {
    return (
      <div className="alert alert-warning">
        <h1 className="h4">Producto no encontrado</h1>
        <Link to="/admin/productos">Volver a productos</Link>
      </div>
    );
  }

  const categoria = categorias.find(
    (item) => String(item.id) === String(producto.categoriaId)
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Detalle del producto</h1>
        <Link
          to={`/admin/productos/${encodeURIComponent(producto.id)}/editar`}
          className="btn btn-success"
        >
          Editar producto
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h4">{producto.nombre}</h2>

          <table className="table table-bordered mt-3">
            <tbody>
              <tr>
                <th>Categoría</th>
                <td>{categoria?.nombre ?? "Sin categoría"}</td>
              </tr>
              <tr>
                <th>Precio</th>
                <td>{formatoCLP(producto.precio)}</td>
              </tr>
              <tr>
                <th>Stock</th>
                <td>
                  {producto.stock} {producto.unidadStock}
                </td>
              </tr>
              <tr>
                <th>Unidad de venta</th>
                <td>{producto.unidadVenta}</td>
              </tr>
              <tr>
                <th>Origen</th>
                <td>{producto.origen || "No informado"}</td>
              </tr>
              <tr>
                <th>Estado</th>
                <td>{producto.activo ? "Activo" : "Inactivo"}</td>
              </tr>
              <tr>
                <th>Precio de oferta</th>
                <td>
                  {producto.precioOferta != null
                    ? formatoCLP(producto.precioOferta)
                    : "Sin oferta"}
                </td>
              </tr>
              <tr>
                <th>Descripción</th>
                <td>{producto.descripcion || "Sin descripción"}</td>
              </tr>
            </tbody>
          </table>

          <Link
            to="/admin/productos"
            className="btn btn-outline-secondary"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    </div>
  );
}
