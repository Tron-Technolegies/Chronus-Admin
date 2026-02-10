
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomeLayout from "./components/Layout/HomeLayout";
import Dashboard from "./pages/Dashboard";
import OrderTable from "./components/Orders/OrderTable";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrderTable />} />
          {/* Add more routes here as needed */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
