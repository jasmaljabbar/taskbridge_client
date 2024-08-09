import React, { useState } from "react";
import { FaUser, FaUsers } from "react-icons/fa";
import { RiPriceTag3Line } from "react-icons/ri";
import {MdDashboard } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { Link } from "react-router-dom";

const Admin_Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700 transition duration-200"
    >
      <Icon className="mr-3" /> {children}
    </Link>
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-20 md:hidden bg-gray-800 text-white p-2 rounded"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <div
        className={`fixed top-14 left-0 h-full w-64 bg-gray-800 text-white p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
      >
        <nav className="mt-16 md:mt-20">
          <div className="mb-4 space-y-2">
            <NavLink to="/admin/dashboard" icon={MdDashboard}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/tasker_showing" icon={GrUserWorker}>
              Taskers
            </NavLink>
            <NavLink to="/admin/user_list" icon={FaUsers}>
              Users
            </NavLink>
            <NavLink to="/admin/task_list" icon={FaUser}>
              Task Category
            </NavLink>
            <NavLink to="/admin/subscription_price" icon={RiPriceTag3Line}>
              Subscription Price
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Admin_Sidebar;
