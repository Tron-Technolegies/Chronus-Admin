import React, { useState, useEffect } from "react";
import { BsCurrencyDollar, BsCart, BsClockHistory, BsBag } from "react-icons/bs";
import { FaArrowTrendUp } from "react-icons/fa6";
import { getDashboardStats } from "../../api/api";

const DashboardStats = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setData(res.data.cards))
      .catch(console.error);
  }, []);

  const fmt = (val) =>
    typeof val === "number"
      ? val % 1 === 0
        ? val.toLocaleString()
        : `$${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "--";

  const stats = [
    {
      title: "Total Revenue",
      value: data ? `$${parseFloat(data.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "--",
      rate: data ? `${data.growth_rate >= 0 ? "+" : ""}${data.growth_rate}% vs prev 30 days` : "Loading...",
      icon: <BsCurrencyDollar className="text-2xl text-[#e4b76f]" />,
    },
    {
      title: "Total Orders",
      value: data ? data.total_orders.toLocaleString() : "--",
      rate: data ? `${data.pending_orders} pending · ${data.shipped_orders} shipped` : "Loading...",
      icon: <BsCart className="text-2xl text-[#e4b76f]" />,
    },
    {
      title: "Today's Orders",
      value: data ? data.today_orders.toLocaleString() : "--",
      rate: data ? `${data.completed_orders} completed total` : "Loading...",
      icon: <BsClockHistory className="text-2xl text-[#e4b76f]" />,
    },
    {
      title: "Avg. Order Value",
      value: data ? `$${parseFloat(data.avg_order_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "--",
      rate: data ? `${data.low_stock_products} low-stock products` : "Loading...",
      icon: <FaArrowTrendUp className="text-2xl text-[#e4b76f]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <div className="rounded-lg p-2 bg-gray-50">{stat.icon}</div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>
            <p className="mt-1 text-xs text-gray-500">{stat.rate}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
