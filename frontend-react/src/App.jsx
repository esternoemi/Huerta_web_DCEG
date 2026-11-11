
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
import ContactPage from "./pages/ContactPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { useAuth } from "./context/useAuth.js";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage.jsx";
import AdminProductDetailPage from "./pages/admin/AdminProductDetailPage.jsx";
import AdminCriticalProductsPage from "./pages/admin/AdminCriticalProductsPage.jsx";

function Page({ title }) {
  return <PlaceholderPage title={title} />;
}

function AuthErrorNotice() {
  const { error } = useAuth();

  if (!error) {
    return null;
  }

  return (
    <div className="container mt-3">
      <div className="alert alert-danger" role="alert">
        No se pudo leer o actualizar la sesión local: {error} Puedes intentar
        iniciar sesión nuevamente.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <ProductProvider>
          <CategoryProvider>
            <CartProvider>
              <OrderProvider>
                <AuthErrorNotice />
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
                    <Route path="/blogs" element={<BlogListPage />} />
                    <Route
                      path="/blogs/:slug"
                      element={<BlogDetailPage />}
                    />
                    <Route path="/contacto" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registro" element={<RegisterPage />} />
                  </Route>

                  <Route element={<RequireRole role="administrador" />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route
                        index
                        element={<AdminDashboardPage />}
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
                        element={<AdminProductsPage />}
                      />
                      <Route
                        path="productos/nuevo"
                        element={<AdminProductFormPage />}
                      />
                      <Route
                        path="productos/criticos"
                        element={<AdminCriticalProductsPage />}
                      />
                      <Route
                        path="productos/reportes"
                        element={<Page title="Reportes de productos" />}
                      />
                      <Route
                        path="productos/:id/editar"
                        element={<AdminProductFormPage />}
                      />
                      <Route
                        path="productos/:id"
                        element={<AdminProductDetailPage />}
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
