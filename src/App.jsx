import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import HomeLayout from "./components/Layout/HomeLayout";
import Dashboard from "./pages/Dashboard";
import OrderTable from "./components/Orders/OrderTable";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import Customers from "./pages/Customers";
import Coupons from "./pages/Coupons";
import SubCategories from "./pages/SubCategories";
import Frames from "./pages/Frames";
import Materials from "./pages/Materials";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { Toaster } from "react-hot-toast";

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
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/frames" element={<Frames />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/coupon" element={<Coupons />} />
            <Route path="/subcategories" element={<SubCategories />} />
            <Route path="orders" element={<OrderTable />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
