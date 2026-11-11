
import { Link, useParams } from "react-router-dom";

const blogs = {
  espinaca: {
    etiqueta: "RECETA CON PRODUCTOS FRESCOS",
    titulo: "Pizza de espinaca con salsa blanca",
    imagen: "/images/VR002 - espinacaFresca.png",
    alt: "Espinacas frescas para una pizza casera",
    introduccion:
      "Esta pizza combina espinacas salteadas con ajo, una salsa blanca suave y una base dorada. Es una forma sencilla de sumar verduras frescas a una comida para compartir.",
    secciones: [
      {
        titulo: "Ingredientes",
        tipo: "ul",
        contenido: [
          "Una base de pizza lista para hornear.",
          "Espinacas frescas, lavadas y escurridas.",
          "Salsa blanca, queso y un diente de ajo.",
          "Aceite, sal y pimienta a gusto.",
        ],
      },
      {
        titulo: "Preparación",
        tipo: "ol",
        contenido: [
          "Saltea el ajo y las espinacas durante unos minutos hasta que estén tiernas.",
          "Extiende la salsa blanca sobre la masa y distribuye las espinacas y el queso.",
          "Hornea siguiendo las indicaciones de la masa, hasta que los bordes estén dorados.",
        ],
      },
    ],
  },
  frutas: {
    etiqueta: "CONSEJOS DE TEMPORADA",
    titulo: "Frutas de temporada en tu mesa",
    imagen: "/images/FR003 - platanosCavendish.png",
    alt: "Plátanos frescos para disfrutar en casa",
    introduccion:
      "Las frutas frescas hacen más fácil preparar colaciones y agregar variedad a las comidas. Al elegirlas, busca piezas firmes, con aroma natural y sin golpes visibles; la madurez adecuada depende de cuándo planeas consumirlas.",
    secciones: [
      {
        titulo: "Cómo conservarlas",
        tipo: "ul",
        contenido: [
          "Guarda las frutas delicadas en el refrigerador y lávalas justo antes de consumirlas.",
          "Mantén separadas las piezas maduras de las que todavía están verdes para controlar mejor su maduración.",
          "Deja a la vista las frutas que quieres consumir primero y revisa regularmente si alguna necesita usarse pronto.",
        ],
      },
      {
        titulo: "Ideas para aprovecharlas",
        tipo: "p",
        contenido:
          "Combina fruta fresca con avena para el desayuno, agrégala a una ensalada o congela porciones maduras para preparar batidos. Ajusta las cantidades a lo que tengas disponible y evita desperdiciar las piezas que estén listas para consumir.",
      },
    ],
  },
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const blog = blogs[slug];

  if (!blog) {
    return (
      <main className="container my-5 text-center">
        <h1>Artículo no encontrado</h1>
        <p>El artículo solicitado no existe o no está disponible.</p>
        <Link to="/blogs" className="btn btn-success">
          Volver a blogs
        </Link>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <article className="mx-auto" style={{ maxWidth: "900px" }}>
        <Link to="/blogs" className="btn btn-outline-secondary mb-4">
          Volver a blogs
        </Link>

        <p className="text-success fw-bold text-uppercase mt-3">
          {blog.etiqueta}
        </p>

        <h1 className="display-5 fw-bold text-success mb-4">
          {blog.titulo}
        </h1>

        <div className="card border-0 shadow-sm overflow-hidden mb-4">
          <img
            src={blog.imagen}
            alt={blog.alt}
            className="img-fluid w-100"
            style={{
              maxHeight: "450px",
              objectFit: "contain",
              backgroundColor: "#ffffff",
            }}
          />
        </div>

        <p className="lead">{blog.introduccion}</p>

        {blog.secciones.map((seccion) => (
          <section key={seccion.titulo} className="mt-4">
            <h2 className="h4 text-success mb-3">
              {seccion.titulo}
            </h2>

            {seccion.tipo === "ul" && (
              <ul>
                {seccion.contenido.map((item) => (
                  <li key={item} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {seccion.tipo === "ol" && (
              <ol>
                {seccion.contenido.map((item) => (
                  <li key={item} className="mb-2">
                    {item}
                  </li>
                ))}
              </ol>
            )}

            {seccion.tipo === "p" && (
              <p>{seccion.contenido}</p>
            )}
          </section>
        ))}

        <Link to="/productos" className="btn btn-success btn-lg mt-4">
          Ver productos
        </Link>
      </article>
    </main>
  );
};

export default BlogDetailPage;
