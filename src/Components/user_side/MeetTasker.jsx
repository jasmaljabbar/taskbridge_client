import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import { TbListDetails, TbCalendarCheck } from "react-icons/tb";
import { TiMessages } from "react-icons/ti";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { B_URL } from "../../redux/actions/authService";

const MeetTasker = () => {
  const taskerInfo = useSelector((state) => state.auth.taskerDetails);
  const [isOpen, setIsOpen] = useState(false);
  const user_profile = useSelector((state) => state.auth.token);
  const [user_in, setUser_in] = useState({
    user_id: "",
    user_image: "",
  });
  const [tasker_in, setTasker_in] = useState({
    tasker_id: "",
  });

  const user = jwtDecode(user_profile);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (user) {
      setUser_in({ user_id: user.user_id, user_image: user.profile_photo });
    } else {
      console.log("User not found");
    }
    if (taskerInfo) {
      setTasker_in({ tasker_id: taskerInfo.user.id });
    } else {
      console.log("Tasker not found");
    }
  }, []);

  if (!taskerInfo) {
    return (
    <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
    )
  }

  return (
    <div className="h-screen ">
      <div className="bg-slate-500 z-20 fixed w-full h-1/5 flex items-center justify-center">
        <img
          src={
            taskerInfo.work_photo
              ? `${B_URL}${taskerInfo.work_photo}`
              : "fallback_image_url"
          }
          alt="Tasker Work"
          className="w-full h-full object-cover"
        />
        <div className="absolute flex items-center z-20 top-[110%] left-[35%] transform -translate-x-1/2 -translate-y-1/2">
          <img
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
            src={
              taskerInfo.profile_pic
                ? `${B_URL}${taskerInfo.profile_pic}`
                : "fallback_profile_photo_url"
            }
            alt="Tasker"
          />
          <h2 className="text-2xl font-bold ml-4 text-black">
            {taskerInfo.full_name}
          </h2>
        </div>
      </div>
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <div
        className={`fixed top-[20%] left-0 h-full w-64 bg-gray-800 text-white p-3 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
      >
        <nav className="mt-[45%]">
          <div className="mb-4">
            <Link
              to={{
                pathname: `/details/${taskerInfo.user.id}`,
                search: `?user=${taskerInfo.user.id}`,
              }}
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <TbListDetails className="mr-3" /> Details
            </Link>
            <Link
              to={{
                pathname: `/chat/${taskerInfo.user.id}`,
                state: { user_in:user_in.user_id, tasker_in:tasker_in.tasker_id },
              }}
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <TiMessages className="mr-3" /> Message
            </Link>
            <Link
              to="history"
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <TbCalendarCheck className="mr-3" /> Appointment History
            </Link>
          </div>
        </nav>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-0"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default MeetTasker;
