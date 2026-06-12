import React, { useState, useEffect, useRef } from "react";
import { BsBell, BsList } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { getNotifications } from "../../api/api";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(Array.isArray(res.data) ? res.data : (res.data.notifications || []));
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

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

        {/* Notification */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          <div className="relative">
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white font-bold z-10">
                {unreadCount}
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
              </span>
            )}
            <button 
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <BsBell size={20} />
            </button>

            {/* Notification Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
                        <p className="text-sm font-medium text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1.5">{new Date(n.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      No notifications yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
