
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { RequireRole } from "./routes/RequireRole.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import PurchaseResultPage from "./pages/PurchaseResultPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import OffersPage from "./pages/OffersPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import BlogListPage from "./pages/BlogListPage.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";

function Page({ title }) {
  return <PlaceholderPage title={title} />;
}

export default function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <ProductProvider>
          <CategoryProvider>
            <CartProvider>
              <OrderProvider>
                <Routes>
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/productos" element={<ProductsPage />} />
                    <Route
                      path="/productos/:id"
                      element={<ProductDetailPage />}
                    />
                    <Route
                      path="/categorias"
                      element={<CategoriesPage />}
                    />
                    <Route
                      path="/categorias/:slug"
                      element={<CategoryPage />}
                    />
                    <Route path="/ofertas" element={<OffersPage />} />
                    <Route path="/carrito" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route
                      path="/compra/:resultado/:id"
                      element={<PurchaseResultPage />}
                    />
                    <Route path="/nosotros" element={<AboutPage />} />
                    <Route
                      path="/blogs"
                      element={<BlogListPage />}
                    />
                    <Route
                      path="/blogs/:slug"
                      element={<BlogDetailPage />}
                    />
                    <Route
                      path="/contacto"
                      element={<Page title="Contacto" />}
                    />
                    <Route
                      path="/login"
                      element={<Page title="Iniciar sesión" />}
                    />
                    <Route
                      path="/registro"
                      element={<Page title="Registro" />}
                    />
                  </Route>

                  <Route element={<RequireRole role="administrador" />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route
                        index
                        element={<Page title="Dashboard" />}
                      />
                      <Route
                        path="ordenes"
                        element={<Page title="Órdenes" />}
                      />
                      <Route
                        path="ordenes/:id"
                        element={<Page title="Detalle de orden/boleta" />}
                      />
                      <Route
                        path="productos"
                        element={<Page title="Productos" />}
                      />
                      <Route
                        path="productos/nuevo"
                        element={<Page title="Nuevo producto" />}
                      />
                      <Route
                        path="productos/criticos"
                        element={<Page title="Productos críticos" />}
                      />
                      <Route
                        path="productos/reportes"
                        element={<Page title="Reportes de productos" />}
                      />
                      <Route
                        path="productos/:id/editar"
                        element={<Page title="Editar producto" />}
                      />
                      <Route
                        path="productos/:id"
                        element={<Page title="Detalle de producto" />}
                      />
                      <Route
                        path="categorias"
                        element={<Page title="Categorías" />}
                      />
                      <Route
                        path="categorias/nueva"
                        element={<Page title="Nueva categoría" />}
                      />
                      <Route
                        path="categorias/:id/editar"
                        element={<Page title="Editar categoría" />}
                      />
                      <Route
                        path="usuarios"
                        element={<Page title="Usuarios" />}
                      />
                      <Route
                        path="usuarios/nuevo"
                        element={<Page title="Nuevo usuario" />}
                      />
                      <Route
                        path="usuarios/:id/editar"
                        element={<Page title="Editar usuario" />}
                      />
                      <Route
                        path="usuarios/:id/compras"
                        element={<Page title="Historial de compras" />}
                      />
                      <Route
                        path="usuarios/:id"
                        element={<Page title="Detalle de usuario" />}
                      />
                      <Route
                        path="reportes"
                        element={<Page title="Reportes" />}
                      />
                      <Route
                        path="perfil"
                        element={<Page title="Perfil" />}
                      />
                    </Route>
                  </Route>

                  <Route element={<RequireRole role="vendedor" />}>
                    <Route
                      path="/vendedor/productos"
                      element={<Page title="Productos para vendedor" />}
                    />
                    <Route
                      path="/vendedor/productos/:id"
                      element={<Page title="Detalle de producto para vendedor" />}
                    />
                    <Route
                      path="/vendedor/ordenes"
                      element={<Page title="Órdenes para vendedor" />}
                    />
                    <Route
                      path="/vendedor/ordenes/:id"
                      element={<Page title="Detalle de orden para vendedor" />}
                    />
                  </Route>

                  <Route
                    path="*"
                    element={<Page title="Página no encontrada" />}
                  />
                </Routes>
              </OrderProvider>
            </CartProvider>
          </CategoryProvider>
        </ProductProvider>
      </AuthProvider>
    </UserProvider>
  );
}
