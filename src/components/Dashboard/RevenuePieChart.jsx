import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getDashboardStats } from "../../api/api";

const COLORS = ["#3D1613", "#e4b76f", "#888888", "#c0a060", "#555555", "#d4a855", "#aaaaaa"];

const RevenuePieChart = () => {
  const { data: statsData } = useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const res = await getDashboardStats();
      return res.data;
    }
  });

  const data = (statsData?.category_revenue || []).map((item) => ({
    name: item.category,
    value: parseFloat(item.revenue),
  }));

  return (
    <div className="col-span-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:col-span-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Revenue by Category</h3>
      <div className="h-[350px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  "Revenue",
                ]}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenuePieChart;
