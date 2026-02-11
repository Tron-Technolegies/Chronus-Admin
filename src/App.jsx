import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomeLayout from "./components/Layout/HomeLayout";
import Dashboard from "./pages/Dashboard";
import OrderTable from "./components/Orders/OrderTable";
import Products from "./pages/Products";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<OrderTable />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
