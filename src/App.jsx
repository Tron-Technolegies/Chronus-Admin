import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import HomeLayout from "./components/Layout/HomeLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import ProductFormPage from "./pages/ProductFormPage";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import Customers from "./pages/Customers";
import Coupons from "./pages/Coupons";
import SubCategories from "./pages/SubCategories";
import Frames from "./pages/Frames";
import Materials from "./pages/Materials";
import Suppliers from "./pages/Suppliers";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { Toaster } from "react-hot-toast";
import ShippingPartners from "./pages/ShippingPartners";
import { isSuperAdmin } from "./utils/auth";

const IndexRoute = () => {
  return isSuperAdmin() ? <Dashboard /> : <Navigate to="/products" replace />;
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<IndexRoute />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute superAdminOnly>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<ProductFormPage />} />
            <Route path="products/edit/:id" element={<ProductFormPage />} />
            <Route path="products/view/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/frames" element={<Frames />} />
            <Route path="/materials" element={<Materials />} />
            <Route
              path="/customers"
              element={
                <ProtectedRoute superAdminOnly>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/coupon" element={<Coupons />} />
            <Route path="/subcategories" element={<SubCategories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="shipping-partners" element={<ShippingPartners />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
