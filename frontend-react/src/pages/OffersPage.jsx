
import { Link } from "react-router-dom";
import { useProducts } from "../context/useProducts.js";
import ProductCard from "../components/catalog/ProductCard.jsx";

const OffersPage = () => {
  const { productos, error } = useProducts();

  const productosEnOferta = productos.filter(
    (producto) =>
      producto.activo &&
      !producto.proximo &&
      Number.isFinite(producto.precio) &&
      Number.isFinite(producto.precioOferta) &&
      producto.precioOferta >= 0 &&
      producto.precioOferta < producto.precio
  );

  if (error) {
    return (
      <main className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>

        <Link to="/productos" className="btn btn-outline-success">
          Volver a productos
        </Link>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <h1 className="text-success mb-3">
        Ofertas especiales
      </h1>

      <p className="lead mb-4">
        Descubre nuestros productos con precios especiales
        y aprovecha las mejores ofertas de Huerto Hogar.
      </p>

      <p className="text-muted">
        Productos en oferta: {productosEnOferta.length}
      </p>

      {productosEnOferta.length === 0 ? (
        <div className="alert alert-info" role="status">
          Actualmente no tenemos productos en oferta.
          ¡Vuelve pronto para descubrir nuestras promociones!
        </div>
      ) : (
        <div className="row g-4">
          {productosEnOferta.map((producto) => (
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

export default OffersPage;
