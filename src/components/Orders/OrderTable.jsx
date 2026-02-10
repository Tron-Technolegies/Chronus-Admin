import React from "react";

export default function OrderTable() {
  return (
    <div className="max-w-5xl bg-white p-6">
      <h1 className="text-2xl text-red-600">Order History</h1>

      <table className="border border-gray-400 ">
        <tr className="">
          <td className="border border-gray-500 p-2"> Id</td>
          <td className="border border-gray-500 p-2"> Name</td>
          <td className="border border-gray-500 p-2"> Status</td>
          <td className="border border-gray-500 p-2">Products</td>
        </tr>
      </table>
    </div>
  );
}
