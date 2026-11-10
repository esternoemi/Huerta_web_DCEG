
const ProductCard = ({ product }) => {
    return (
        <div className="card h-100">
            <img
                src={product.imagen}
                className="card-img-top"
                alt={product.nombre}
            />

            <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                    {product.nombre}
                </h5>

                <p className="card-text">
                    {product.descripcion}
                </p>

                {product.proximo ? (
                    <p className="text-warning fw-bold">
                        Próximamente
                    </p>
                ) : (
                    <>
                        <p className="fw-bold">
                            ${product.precio.toLocaleString("es-CL")} {product.unidadVenta}
                        </p>

                        <button
                            className="btn btn-success mt-auto"
                            disabled={product.stock === 0}
                        >
                            Agregar al carrito
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
