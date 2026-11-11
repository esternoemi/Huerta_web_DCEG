
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <main>
            {/* Sección de bienvenida */}
            <section className="container py-5 text-center">
                <h1 className="display-4 fw-bold text-success">
                    Bienvenidos a Huerto Hogar
                </h1>

                <p className="lead mt-3">
                    Productos frescos y naturales para tu hogar.
                </p>

                <p className="mb-4">
                    Descubre nuestra selección de frutas,
                    verduras y productos orgánicos.
                </p>

                <Link
                    to="/productos"
                    className="btn btn-success btn-lg"
                >
                    Ver productos
                </Link>
            </section>

            {/* Sección de categorías */}
            <section className="container py-5">
                <h2 className="text-center mb-4">
                    Explora nuestras categorías
                </h2>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100 text-center shadow-sm">
                            <div className="card-body">
                                <h3 className="h5">Frutas frescas</h3>
                                <p>
                                    Frutas seleccionadas para disfrutar
                                    cada día.
                                </p>
                                <Link
                                    to="/categorias/frutas-frescas"
                                    className="btn btn-outline-success"
                                >
                                    Explorar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 text-center shadow-sm">
                            <div className="card-body">
                                <h3 className="h5">
                                    Verduras orgánicas
                                </h3>
                                <p>
                                    Verduras frescas para una
                                    alimentación saludable.
                                </p>
                                <Link
                                    to="/categorias/verduras-organicas"
                                    className="btn btn-outline-success"
                                >
                                    Explorar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 text-center shadow-sm">
                            <div className="card-body">
                                <h3 className="h5">
                                    Productos orgánicos
                                </h3>
                                <p>
                                    Descubre alimentos naturales
                                    para tu familia.
                                </p>
                                <Link
                                    to="/categorias"
                                    className="btn btn-outline-success"
                                >
                                    Explorar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de ofertas */}
            <section className="container py-5 text-center">
                <h2 className="mb-3">
                    Ofertas especiales
                </h2>

                <p>
                    Conoce nuestros productos con descuentos.
                </p>

                <Link
                    to="/ofertas"
                    className="btn btn-outline-success"
                >
                    Ver ofertas
                </Link>
            </section>
        </main>
    );
};

export default HomePage;
