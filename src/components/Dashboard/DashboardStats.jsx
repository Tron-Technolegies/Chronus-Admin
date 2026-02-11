import React from "react";
import { BsCurrencyDollar, BsCart, BsPeople } from "react-icons/bs";
import { FaArrowTrendUp } from "react-icons/fa6";

const DashboardStats = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      rate: "+20.1%",
      icon: <BsCurrencyDollar className="text-2xl text-[#e4b76f]" />,
      color: "bg-gray-50",
    },
    {
      title: "Total Orders",
      value: "+573",
      rate: "+201 since last hour",
      icon: <BsCart className="text-2xl text-[#e4b76f]" />,
      color: "bg-gray-50",
    },
    {
      title: "New coustemers",
      value: "+573",
      rate: "+201 since last hour",
      icon: <BsPeople className="text-2xl text-[#e4b76f]" />,
      color: "bg-gray-50",
    },
    {
      title: "Growth rate",
      value: "1,203",
      rate: "+12% this month",
      icon: <FaArrowTrendUp className="text-2xl text-[#e4b76f]" />,
      color: "bg-gray-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <div className={`rounded-lg p-2 ${stat.color}`}>{stat.icon}</div>
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
