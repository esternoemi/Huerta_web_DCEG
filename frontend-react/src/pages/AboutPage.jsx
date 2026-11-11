
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <main className="container my-5">
      <div className="row align-items-center g-5">
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm overflow-hidden">
            <img
              src="/images/portadaNosotros.png"
              alt="Huerta de Huerto Hogar"
              className="img-fluid w-100"
              style={{
                maxHeight: "550px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <p className="text-success fw-bold text-uppercase">
            Productos de nuestra tierra
          </p>

          <h1 className="display-4 fw-bold text-success mb-4">
            Nosotros
          </h1>

          <p>
            Huerto Hogar es una tienda online dedicada a llevar la
            frescura y calidad de los productos del campo directamente
            a la puerta de nuestros clientes en Chile. Con más de 6
            años de experiencia, operamos en más de 9 puntos a lo
            largo del país, incluyendo ciudades clave como Santiago,
            Puerto Montt, Villarrica, Nacimiento, Viña del Mar,
            Valparaíso y Concepción. Nuestra misión es conectar a las
            familias chilenas con el campo, promoviendo un estilo de
            vida saludable y sostenible.
          </p>

          <h2 className="h4 text-success mt-4">
            Nuestra misión
          </h2>

          <p>
            Nuestra misión es proporcionar productos frescos y de
            calidad directamente desde el campo hasta la puerta de
            nuestros clientes, garantizando la frescura y el sabor
            en cada entrega. Nos comprometemos a fomentar una
            conexión más cercana entre los consumidores y los
            agricultores locales, apoyando prácticas agrícolas
            sostenibles y promoviendo una alimentación saludable
            en todos los hogares chilenos.
          </p>

          <h2 className="h4 text-success mt-4">
            Nuestra visión
          </h2>

          <p>
            Nuestra visión es ser la tienda online líder en la
            distribución de productos frescos y naturales en Chile,
            reconocida por nuestra calidad excepcional, servicio
            al cliente y compromiso con la sostenibilidad.
            Aspiramos a expandir nuestra presencia a nivel nacional
            e internacional, estableciendo un nuevo estándar en
            la distribución de productos agrícolas directos del
            productor al consumidor.
          </p>

          <Link
            to="/productos"
            className="btn btn-success btn-lg mt-3"
          >
            Ver productos
          </Link>

          <section
            className="mt-5"
            aria-labelledby="titulo-equipo"
          >
            <p className="text-success fw-bold text-uppercase">
              El equipo detrás del sitio
            </p>

            <h2 className="h4" id="titulo-equipo">
              Desarrollo del proyecto
            </h2>

            <p>
              La experiencia digital, el catálogo y las
              validaciones fueron desarrollados por:
            </p>

            <ul>
              <li>Ester Gonzalez</li>
              <li>Daniela Castillo</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
