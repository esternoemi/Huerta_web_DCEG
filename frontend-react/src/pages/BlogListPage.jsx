
import { Link } from "react-router-dom";

const blogs = [
  {
    slug: "espinaca",
    titulo: "Pizzas de Espinaca con Salsa Blanca",
    descripcion:
      "Una receta casera que combina espinacas salteadas, salsa blanca y una masa crujiente para compartir.",
    imagen: "/images/VR002 - espinacaFresca.png",
    alt: "Espinaca fresca para una pizza casera",
  },
  {
    slug: "frutas",
    titulo: "Frutas de temporada en tu mesa",
    descripcion:
      "Ideas sencillas para elegir, conservar y aprovechar frutas frescas durante la semana.",
    imagen: "/images/FR003 - platanosCavendish.png",
    alt: "Plátanos Cavendish frescos",
  },
];

const BlogListPage = () => {
  return (
    <main className="container my-5">
      <section aria-labelledby="titulo-blogs">
        <div className="text-center mb-5">
          <p className="text-success fw-bold text-uppercase">
            Blogs
          </p>

          <h1
            id="titulo-blogs"
            className="display-5 fw-bold text-success"
          >
            Comidas saludables
          </h1>
        </div>

        <div className="row g-4">
          {blogs.map((blog) => (
            <div
              className="col-12 col-md-6"
              key={blog.slug}
            >
              <article className="card h-100 shadow-sm overflow-hidden">
                <img
                  src={blog.imagen}
                  alt={blog.alt}
                  className="card-img-top"
                  style={{
                    height: "300px",
                    objectFit: "contain",
                    backgroundColor: "#ffffff",
                  }}
                />

                <div className="card-body d-flex flex-column p-4">
                  <h2 className="h4 card-title text-success">
                    {blog.titulo}
                  </h2>

                  <p className="card-text mb-4">
                    {blog.descripcion}
                  </p>

                  <div className="mt-auto">
                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="btn btn-success"
                    >
                      Leer artículo
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default BlogListPage;
