import React, { useEffect, useState } from "react";
import axios from "axios";
import Image_not_available from "../../../statics/user_side/work_image/Image_not_available.png";
import { B_URL, BASE_URL } from "../../../redux/actions/authService";
import { Link } from "react-router-dom";

const TaskerListing = () => {
  const [taskersInfo, setTaskersInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}account/api/taskers/`);
        setTaskersInfo(response.data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  }, [taskersInfo]);

  if (!taskersInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Hire a trusted Tasker presto.
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {taskersInfo.map((tasker, index) => (
            <Link
              key={index}
              to={`/details/${tasker.user}?user=${tasker.user}`}
            >
              <div className="bg-white rounded-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-md overflow-hidden">
                <img
                  src={
                    tasker.work_photo
                      ? `${B_URL}${tasker.work_photo}`
                      : Image_not_available
                  }
                  alt="Work photo"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    Meet {tasker.full_name}
                  </h2>

                  <p className="text-xl mb-4">
                    Our skilled{" "}
                    <span className="text-gray-600 font-bold">
                      {tasker.task?.name?.toUpperCase() || "professional"}
                    </span>
                  </p>
                  <div className="mb-6">
                    <p className="text-lg text-gray-700">
                      With a service charge of{" "}
                      <span className="font-semibold text-green-600">
                        ₹{tasker.task_fee}
                      </span>{" "}
                      per hour, {tasker.full_name} ensures reliable{" "}
                      {tasker.task?.name || "professional"} solutions for your
                      needs.
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      Contact Information
                    </h3>
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span>{" "}
                      {tasker.phone_number}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Location:</span>{" "}
                      {tasker.city}, {tasker.state}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskerListing;
