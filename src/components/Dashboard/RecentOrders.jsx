import React, { useState, useEffect } from "react";
import { getOrders } from "../../api/api";

const statusStyles = {
  completed: "text-emerald-600 bg-emerald-100",
  pending: "text-orange-600 bg-orange-100",
  shipped: "text-blue-600 bg-blue-100",
  cancelled: "text-red-600 bg-red-100",
  processing: "text-purple-600 bg-purple-100",
};

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then((res) => {
        // Take 5 most recent orders (API returns latest first, or we sort by id desc)
        const all = res.data?.orders || res.data || [];
        const sorted = [...all].sort((a, b) => b.id - a.id).slice(0, 5);
        setOrders(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="col-span-12 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        {loading && (
          <span className="text-xs text-gray-400 animate-pulse">Loading...</span>
        )}
      </div>
      <div className="overflow-x-auto p-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = (order.status || "").toLowerCase();
                const colorClass = statusStyles[status] || "text-gray-600 bg-gray-100";
                const customerName =
                  order.customer_name ||
                  (order.user
                    ? `${order.user.first_name || ""} ${order.user.last_name || ""}`.trim()
                    : "—");
                const itemCount = order.items?.length ?? order.total_items ?? "—";

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {customerName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {itemCount} {typeof itemCount === "number" ? (itemCount === 1 ? "item" : "items") : ""}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      ${parseFloat(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 capitalize ${colorClass}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
