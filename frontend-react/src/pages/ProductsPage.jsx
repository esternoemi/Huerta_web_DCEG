import ProductCard from "../components/catalog/ProductCard";
import { productosIniciales } from "../data/seedData";

const ProductsPage = () => {
    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">
                Nuestros Productos
            </h1>

            <div className="row g-4">
                {productosIniciales.map((producto) => (
                    <div
                        className="col-12 col-md-6 col-lg-4"
                        key={producto.id}
                    >
                        <ProductCard product={producto} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;
