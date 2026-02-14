import React, { useState } from "react";
import CustomerTable from "../components/Customers/CustomerTable";
import { IoFunnelOutline } from "react-icons/io5";

export default function Customers() {


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Customers</h2>
        
        <div className="flex gap-2">
            <div className="bg-white px-3 py-2 rounded-lg flex items-center text-gray-800 cursor-pointer shadow-sm">
                <IoFunnelOutline />
                <p className="ml-2">Filters</p>
            </div>
        </div>
      </div>

      <div className="mt-4">
        <CustomerTable />
      </div>
    </div>
  );
}
