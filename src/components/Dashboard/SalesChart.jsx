import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDashboardStats } from "../../api/api";

const SalesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        // Convert {month, revenue} → {name, revenue}
        const mapped = (res.data.monthly_sales || []).map((item) => ({
          name: item.month,
          revenue: parseFloat(item.revenue),
        }));
        setData(mapped);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="col-span-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:col-span-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
        <span className="text-xs text-gray-400">Last 6 months</span>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e4b76f" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#e4b76f" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#888" }}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip
              formatter={(value) => [`$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#e4b76f"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
