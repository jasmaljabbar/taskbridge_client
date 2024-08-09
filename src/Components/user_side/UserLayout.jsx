import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../common/UserNavbar";

const UserLayout = () => {
  return (
    <div className="pt-20">
      <UserNavbar />

      <div className="">
        <Outlet  />
      </div>
    </div>
  );
};

export default UserLayout;
