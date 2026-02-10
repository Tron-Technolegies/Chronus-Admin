import React from "react";

const RecentOrders = () => {
  const orders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      product: "MacBook Pro M2",
      amount: "$2,499",
      status: "Processing",
      statusColor: "text-blue-600 bg-blue-100",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      product: "iPhone 15 Pro",
      amount: "$1,199",
      status: "Shipped",
      statusColor: "text-green-600 bg-green-100",
    },
    {
      id: "ORD-003",
      customer: "Robert Johnson",
      product: "iPad Air 5",
      amount: "$599",
      status: "Delivered",
      statusColor: "text-emerald-600 bg-emerald-100",
    },
    {
      id: "ORD-004",
      customer: "Emily Davis",
      product: "AirPods Pro 2",
      amount: "$249",
      status: "Pending",
      statusColor: "text-orange-600 bg-orange-100",
    },
    {
       id: "ORD-005",
       customer: "Michael Brown",
       product: "Samsung S24 Ultra",
       amount: "$1,299",
       status: "Cancelled",
       statusColor: "text-red-600 bg-red-100",
     },
  ];

  return (
    <div className="col-span-12 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto p-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                  {order.customer}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                  {order.product}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {order.amount}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
