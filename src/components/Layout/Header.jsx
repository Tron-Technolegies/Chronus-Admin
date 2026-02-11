import React from "react";
import { BsSearch, BsBell, BsList } from "react-icons/bs";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-40 flex w-full bg-white drop-shadow-1">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
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

        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <BsSearch size={20} className="text-gray-400 hover:text-primary" />
              </button>
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none xl:w-125"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Notification Menu Area */}
            <li className="relative">
              <span className="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-red-600">
                <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
              </span>
              <button className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary">
                <BsBell size={20} />
              </button>
            </li>
          </ul>

          {/* User Area */}
          <div className="relative">
            <div className="flex items-center gap-4">
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black">Thomas Anree</span>
                <span className="block text-xs">UX Designer</span>
              </span>

              <span className="h-12 w-12 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
