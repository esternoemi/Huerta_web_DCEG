import { Link, useParams } from "react-router-dom";
import { useProducts } from "../../context/useProducts.js";
import { useCategories } from "../../context/useCategories.js";
import { formatoCLP } from "../../services/formatService.js";
import { EmptyState, PageError } from "../../components/shared/PageFeedback.jsx";

export default function VendorProductDetailPage() {
  const { id } = useParams();
  const { productos, error: errorProductos } = useProducts();
  const { categorias, error: errorCategorias } = useCategories();
  if (errorProductos || errorCategorias) return <PageError mensaje={`No se pudo cargar el producto: ${errorProductos || errorCategorias}`} />;
  const producto = productos.find((item) => item.id === id && item.activo);
  if (!producto) return <EmptyState mensaje="No encontramos un producto activo con ese código."><div className="mt-2"><Link to="/vendedor/productos">Volver a productos</Link></div></EmptyState>;
  const categoria = categorias.find((item) => item.id === producto.categoriaId);

  return (
    <section className="container my-5">
      <div className="d-flex flex-wrap justify-content-between gap-2 mb-4">
        <div><h1 className="h3">{producto.nombre}</h1><p className="text-muted mb-0">{categoria?.nombre ?? "Sin categoría"}</p></div>
        <Link className="btn btn-outline-secondary align-self-start" to="/vendedor/productos">Volver</Link>
      </div>
      <div className="card shadow-sm"><div className="card-body">
        <p>{producto.descripcion || "Sin descripción disponible."}</p>
        <dl className="row mb-0">
          <dt className="col-sm-3">Precio</dt><dd className="col-sm-9">{producto.precio === null ? "Próximamente" : formatoCLP(producto.precio)}</dd>
          <dt className="col-sm-3">Stock</dt><dd className="col-sm-9">{producto.stock} {producto.unidadStock}</dd>
          <dt className="col-sm-3">Unidad de venta</dt><dd className="col-sm-9">{producto.unidadVenta || "No informada"}</dd>
          <dt className="col-sm-3">Origen</dt><dd className="col-sm-9">{producto.origen || "No informado"}</dd>
        </dl>
      </div></div>
    </section>
  );
}
