import React from "react";
import DashboardStats from "../components/Dashboard/DashboardStats";
import SalesChart from "../components/Dashboard/SalesChart";
import RevenuePieChart from "../components/Dashboard/RevenuePieChart";
import RecentOrders from "../components/Dashboard/RecentOrders";

const Dashboard = () => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl  text-black font-[Bastoni]">Dashboard Overview</h2>

        <div className="flex gap-2">
          <select className="bg-white border rounded px-3 py-1 text-sm text-gray-600 focus:outline-none">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <DashboardStats />

        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          <SalesChart />
          <RevenuePieChart />
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          <RecentOrders />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
