import React from "react";
import Sidebar from "../Sidebar";
import TaskerNavbar from "../../common/TaskerNavbar";
import { Outlet } from "react-router-dom";

const TaskerLayout = () => {
  return (
    <div className="flex h-screen">
      <TaskerNavbar />
      <div className="w-1/9">
        <Sidebar />
      </div>
      <div className="flex-1 flex  items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default TaskerLayout;
