
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
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
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.jsx";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage.jsx";
import AdminProductReportsPage from "./pages/admin/AdminProductReportsPage.jsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.jsx";
import AdminCategoryFormPage from "./pages/admin/AdminCategoryFormPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminUserDetailPage from "./pages/admin/AdminUserDetailPage.jsx";
import AdminUserFormPage from "./pages/admin/AdminUserFormPage.jsx";
import AdminUserOrdersPage from "./pages/admin/AdminUserOrdersPage.jsx";
import AdminReportsPage from "./pages/admin/AdminReportsPage.jsx";
import AdminProfilePage from "./pages/admin/AdminProfilePage.jsx";
import VendorProductsPage from "./pages/vendor/VendorProductsPage.jsx";
import VendorProductDetailPage from "./pages/vendor/VendorProductDetailPage.jsx";
import VendorOrdersPage from "./pages/vendor/VendorOrdersPage.jsx";
import VendorOrderDetailPage from "./pages/vendor/VendorOrderDetailPage.jsx";
import DemoAccessPage from "./pages/DemoAccessPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import VendorLayout from "./layouts/VendorLayout.jsx";

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
                    {import.meta.env.DEV && (
                      <Route
                        path="/acceso-demo"
                        element={<DemoAccessPage />}
                      />
                    )}
                  </Route>

                  <Route element={<RequireRole role="administrador" />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route
                        index
                        element={<AdminDashboardPage />}
                      />
                      <Route
                        path="ordenes"
                        element={<AdminOrdersPage />}
                      />
                      <Route
                        path="ordenes/:id"
                        element={<AdminOrderDetailPage />}
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
                        element={<AdminProductReportsPage />}
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
                        element={<AdminCategoriesPage />}
                      />
                      <Route
                        path="categorias/nueva"
                        element={<AdminCategoryFormPage />}
                      />
                      <Route
                        path="categorias/:id/editar"
                        element={<AdminCategoryFormPage />}
                      />
                      <Route
                        path="usuarios"
                        element={<AdminUsersPage />}
                      />
                      <Route
                        path="usuarios/nuevo"
                        element={<AdminUserFormPage />}
                      />
                      <Route
                        path="usuarios/:id/editar"
                        element={<AdminUserFormPage />}
                      />
                      <Route
                        path="usuarios/:id/compras"
                        element={<AdminUserOrdersPage />}
                      />
                      <Route
                        path="usuarios/:id"
                        element={<AdminUserDetailPage />}
                      />
                      <Route
                        path="reportes"
                        element={<AdminReportsPage />}
                      />
                      <Route
                        path="perfil"
                        element={<AdminProfilePage />}
                      />
                    </Route>
                  </Route>

                  <Route element={<RequireRole role="vendedor" />}>
                    <Route path="/vendedor" element={<VendorLayout />}>
                      <Route path="productos" element={<VendorProductsPage />} />
                      <Route path="productos/:id" element={<VendorProductDetailPage />} />
                      <Route path="ordenes" element={<VendorOrdersPage />} />
                      <Route path="ordenes/:id" element={<VendorOrderDetailPage />} />
                    </Route>
                  </Route>

                  <Route
                    path="*"
                    element={<NotFoundPage />}
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
