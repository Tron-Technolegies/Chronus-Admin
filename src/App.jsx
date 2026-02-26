import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/coupon" element={<Coupons />} />
          <Route path="/subcategories" element={<SubCategories />} />
          <Route path="orders" element={<OrderTable />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
