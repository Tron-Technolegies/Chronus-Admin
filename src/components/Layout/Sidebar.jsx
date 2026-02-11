import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BsGrid, BsCart3, BsBoxSeam, BsPeople, BsGraphUp, BsGear } from "react-icons/bs";
import { GoStack } from "react-icons/go";
import { LuTag } from "react-icons/lu";
import { IoTicketOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { MdLogout } from "react-icons/md";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <BsGrid size={24} /> },
    { name: "Products", path: "/products", icon: <BsBoxSeam size={24} /> },
    { name: "Categories", path: "/categories", icon: <GoStack size={24} /> },
    { name: "Brands", path: "/brands", icon: <LuTag size={24} /> },
    { name: "Orders", path: "/orders", icon: <BsCart3 size={24} /> },
    { name: "Customers", path: "/customers", icon: <BsPeople size={24} /> },
    { name: "Coupons", path: "/copuon", icon: <IoTicketOutline size={24} /> },
    { name: "Settings", path: "/settings", icon: <BsGear size={24} /> },
  ];

  return (
    <aside
      className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ backgroundColor: "#3D1613", color: "#FFEDD0" }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 border border-[#56201cc6]">
        <Link to="/" className="flex items-center m-auto gap-2 text-2xl font-bold">
          <img src="/chronos.png" alt="" />{" "}
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="block lg:hidden">
          <IoMdClose size={24} />
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar border-t border-[#56201cc6]">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`group relative flex items-center gap-4 rounded-xl px-4 py-3 font-medium duration-300 ease-in-out hover:bg-[#e1b30f] hover:text-black ${
                      pathname === item.path ? "bg-[#e1b30f] text-black" : ""
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <button className="mt-20 border-t border-[#56201cc6] flex items-center gap-2 px-6 py-4 hover:bg-[#e1b30f] rounded-xl mx-auto">
        <MdLogout size={24} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
