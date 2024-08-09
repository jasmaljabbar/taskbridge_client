import React from "react";
import Admin_Sidebar from "../Admin_Sidebar";
import AdminNavbar from "../../common/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminNavbar />
      <div>
        <Admin_Sidebar />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
