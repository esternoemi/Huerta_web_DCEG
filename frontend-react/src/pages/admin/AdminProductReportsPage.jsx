import { Link } from "react-router-dom";
import { useCategories } from "../../context/useCategories.js";
import { useProducts } from "../../context/useProducts.js";
import { EmptyState, PageError } from "../../components/shared/PageFeedback.jsx";

export default function AdminProductReportsPage() {
  const { productos, error: errorProductos } = useProducts();
  const { categorias, error: errorCategorias } = useCategories();
  const error = errorProductos || errorCategorias;

  if (error) {
    return <PageError mensaje={`No se pudo preparar el resumen: ${error}`} />;
  }

  const activos = productos.filter((producto) => producto.activo);
  const proximos = activos.filter((producto) => producto.proximo);
  const criticos = activos.filter((producto) => producto.stock <= 5 && !producto.proximo);

  return (
    <section className="container-fluid">
      <h1 className="h3 mb-2">Reporte de productos</h1>
      <p className="text-muted mb-4">Resumen calculado desde el catálogo local actual.</p>
      {productos.length === 0 ? (
        <EmptyState mensaje="No hay productos para resumir." />
      ) : (
        <div className="row g-3">
          {[
            ["Productos activos", activos.length],
            ["Categorías", categorias.length],
            ["Stock crítico (umbral 5)", criticos.length],
            ["Próximamente", proximos.length],
          ].map(([titulo, valor]) => (
            <div className="col-12 col-sm-6 col-xl-3" key={titulo}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h2 className="h6 text-muted">{titulo}</h2>
                  <p className="display-6 fw-bold">{valor}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="col-12">
            <div className="alert alert-warning mb-0">
              Este resumen es local y no representa ventas reales.{" "}
              <Link to="/admin/productos/criticos">Revisar stock crítico</Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
