import React from "react";
import { BsSearch, BsBell, BsList } from "react-icons/bs";
import { useLocation } from "react-router-dom";
const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    const routes = {
      "/": "Dashboard",
      "/products": "Products",
      "/orders": "Orders",
      "/categories": "Categories",
      "/brands": "Brands",
      "/customers": "Customers",
      "/coupon": "Coupons",
      "/settings": "Settings",
    };

    return routes[path] || "Dashboard";
  };

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white drop-shadow-1">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        {/* Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
          >
            <BsList size={24} />
          </button>
        </div>

        {/* Dynamic Page Title */}
        <div>
          <p className="text-xl font-semibold text-gray-800">{getPageTitle()}</p>
        </div>

        {/* Search */}
        <div className="hidden sm:block">
          <div className="relative m-2 rounded-full bg-gray-50 border border-gray-200 p-2">
            <BsSearch
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Type to search..."
              className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none xl:w-80"
            />
          </div>
        </div>

        {/* Notification */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-600">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
            </span>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <BsBell size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
