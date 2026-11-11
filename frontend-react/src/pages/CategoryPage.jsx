
import { Link, useParams } from "react-router-dom";
import { useCategories } from "../context/useCategories.js";
import { useProducts } from "../context/useProducts.js";
import ProductCard from "../components/catalog/ProductCard.jsx";

const CategoryPage = () => {
  const { slug } = useParams();

  const {
    categorias,
    error: errorCategorias,
  } = useCategories();

  const {
    productos,
    error: errorProductos,
  } = useProducts();

  const categoria = categorias.find(
    (item) => item.id === slug
  );

  if (errorCategorias || errorProductos) {
    return (
      <main className="container my-5">
        <div className="alert alert-danger" role="alert">
          {errorCategorias || errorProductos}
        </div>

        <Link
          to="/categorias"
          className="btn btn-outline-success"
        >
          Volver a categorías
        </Link>
      </main>
    );
  }

  if (!categoria) {
    return (
      <main className="container my-5 text-center">
        <h1>Categoría no encontrada</h1>

        <p>
          La categoría solicitada no existe o no está disponible.
        </p>

        <Link
          to="/categorias"
          className="btn btn-success"
        >
          Volver a categorías
        </Link>
      </main>
    );
  }

  const productosCategoria = productos.filter(
    (producto) =>
      producto.categoriaId === categoria.id &&
      producto.activo
  );

  return (
    <main className="container my-5">
      <Link
        to="/categorias"
        className="btn btn-outline-secondary mb-4"
      >
        Volver a categorías
      </Link>

      <h1 className="text-success mb-3">
        {categoria.nombre}
      </h1>

      {categoria.descripcion && (
        <p className="lead mb-4">
          {categoria.descripcion}
        </p>
      )}

      <p className="text-muted">
        Productos encontrados: {productosCategoria.length}
      </p>

      {productosCategoria.length === 0 ? (
        <div className="alert alert-info" role="status">
          Actualmente no hay productos disponibles
          en esta categoría.
        </div>
      ) : (
        <div className="row g-4">
          {productosCategoria.map((producto) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={producto.id}
            >
              <ProductCard product={producto} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link
          to="/productos"
          className="btn btn-outline-success"
        >
          Ver todos los productos
        </Link>
      </div>
    </main>
  );
};

export default CategoryPage;
