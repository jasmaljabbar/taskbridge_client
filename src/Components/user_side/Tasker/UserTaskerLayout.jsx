import React from "react";
import { Outlet } from "react-router-dom";
import MeetTasker from "../MeetTasker";

const UserTaskerLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="h-full">
        <MeetTasker />
      </div>
      <div className="flex-1 flex items-center justify-center ml-[30%] w-[60vw]  mt-44  relative">
        <div className="absolute top-0 left-0 w-[80%] h-full ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserTaskerLayout;
