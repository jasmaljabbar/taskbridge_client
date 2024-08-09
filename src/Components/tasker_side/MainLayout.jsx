import React from "react";
import { Outlet } from "react-router-dom";
import MessageSidebar from "./MessageSidebar"; // Adjust the path as necessary

function MainLayout() {
  return (
    <div className="flex w-[100%] pl-64 fixed top-16  h-full ">
      <MessageSidebar>
        <Outlet />
      </MessageSidebar>
    </div>
  );
}

export default MainLayout;
