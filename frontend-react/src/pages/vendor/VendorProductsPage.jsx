import { Link } from "react-router-dom";
import { useProducts } from "../../context/useProducts.js";
import { formatoCLP } from "../../services/formatService.js";
import { EmptyState, PageError } from "../../components/shared/PageFeedback.jsx";

export default function VendorProductsPage() {
  const { productos, error } = useProducts();
  const visibles = productos.filter((producto) => producto.activo);
  if (error) return <PageError mensaje={`No se pudieron cargar los productos: ${error}`} />;

  return (
    <section className="container my-5">
      <h1 className="h3 mb-2">Consulta de productos</h1>
      <p className="text-muted mb-4">Vista de solo lectura para vendedor.</p>
      {visibles.length === 0 ? <EmptyState mensaje="No hay productos activos para mostrar." /> : (
        <div className="row g-3">{visibles.map((producto) => (
          <div className="col-12 col-md-6 col-xl-4" key={producto.id}>
            <article className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h2 className="h5">{producto.nombre}</h2>
                <p className="text-muted">Stock: {producto.stock} {producto.unidadStock}</p>
                <p className="fw-bold">{producto.precio === null ? "Próximamente" : formatoCLP(producto.precio)}</p>
                <Link className="btn btn-outline-success mt-auto" to={`/vendedor/productos/${encodeURIComponent(producto.id)}`}>Ver detalle</Link>
              </div>
            </article>
          </div>
        ))}</div>
      )}
    </section>
  );
}
