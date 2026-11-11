
import { Link } from "react-router-dom";
import { useCategories } from "../context/useCategories.js";

const CategoriesPage = () => {
  const { categorias, error } = useCategories();

  if (error) {
    return (
      <main className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <h1 className="text-success mb-3">
        Categorías de productos
      </h1>

      <p className="lead mb-4">
        Explora nuestras categorías y encuentra los productos
        que necesitas para tu hogar.
      </p>

      {categorias.length === 0 ? (
        <div className="alert alert-info" role="status">
          Actualmente no hay categorías disponibles.
        </div>
      ) : (
        <div className="row g-4">
          {categorias.map((categoria) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={categoria.id}
            >
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h2 className="card-title h4 text-success">
                    {categoria.nombre}
                  </h2>

                  {categoria.descripcion && (
                    <p className="card-text">
                      {categoria.descripcion}
                    </p>
                  )}

                  <div className="mt-auto">
                    <Link
                      to={`/categorias/${encodeURIComponent(categoria.id)}`}
                      className="btn btn-success"
                    >
                      Ver productos
                    </Link>
                  </div>
                </div>
              </div>
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

export default CategoriesPage;
