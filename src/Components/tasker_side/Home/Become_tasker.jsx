import React from "react";
import tasker_img from "../../../statics/tasker_side/images/group-61.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/reducers/authSlice";

const Become_tasker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tasker_login = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert(`Failed to log out: ${error}`);
    }
  };

  return (
    <div className="container mx-auto mt-20">
      {" "}
      {/* Added mx-auto for horizontal centering, reduced top margin */}
      <div className="flex justify-between items-center  rounded-lg shadow-md">
        <div className="flex-1">
          <img
            src={tasker_img}
            alt="Tasker"
            className="w-full h-full object-cover rounded-l-lg"
          />
        </div>
        <div className="flex-1 p-8">
          {" "}
          {/* Added padding instead of margin */}
          <h1 className="text-3xl font-bold mb-4">Earn money your way</h1>
          <p className="mb-6">
            See how much you can make tasking on TaskBridge
          </p>
          <form className="flex flex-col">
            <label className="mb-2">Select your area</label>
            <select className="border rounded-md p-2 mb-4">
              <option value="Wayanad">Wayanad</option>
              {/* Add more options as needed */}
            </select>
            <label className="mb-2">Choose a Category</label>
            <select className="border rounded-md p-2 mb-4">
              <option value="Tea plucking">You can select your Task</option>
              {/* Add more options as needed */}
            </select>
            <button className="bg-green-500 text-white rounded-md py-2 px-4 hover:bg-green-700 transition duration-300">
              <Link to="/tasker_signup">Get started</Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Become_tasker;
