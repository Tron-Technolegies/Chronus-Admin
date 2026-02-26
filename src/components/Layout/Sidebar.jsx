import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BsGrid, BsCart3, BsBoxSeam, BsPeople, BsGear } from "react-icons/bs";
import { GoStack } from "react-icons/go";
import { LuTag } from "react-icons/lu";
import { IoTicketOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { TbLayoutList } from "react-icons/tb";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { pathname } = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: BsGrid },
    { name: "Products", path: "/products", icon: BsBoxSeam },
    { name: "Categories", path: "/categories", icon: GoStack },
    { name: "Sub Categories", path: "/subcategories", icon: TbLayoutList },
    { name: "Brands", path: "/brands", icon: LuTag },
    { name: "Orders", path: "/orders", icon: BsCart3 },
    { name: "Customers", path: "/customers", icon: BsPeople },
    { name: "Coupons", path: "/coupon", icon: IoTicketOutline },
    // { name: "Settings", path: "/settings", icon: BsGear },
  ];


  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen w-72 flex flex-col
      transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:static lg:translate-x-0`}
      style={{ backgroundColor: "#3D1613", color: "#FFEDD0" }}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#56201cc6]">
        <Link to="/" className="flex items-center justify-center w-full">
          <img src="/chronos.png" alt="Logo" className="h-5 object-contain" />
        </Link>

        <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute right-4">
          <IoMdClose size={24} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 font-medium
                  transition-all duration-200
                  ${isActive ? "bg-[#e1b30f] text-black" : "hover:bg-[#e1b30f] hover:text-black"}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[#56201cc6] p-4">
        <button
          className="flex items-center gap-4 w-full rounded-xl px-4 py-3 font-medium
          transition-all duration-200 hover:bg-[#e1b30f] hover:text-black"
        >
          <MdLogout size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
