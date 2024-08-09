import React, { useEffect, useState } from "react";
import axios from "axios";
import { B_URL, BASE_URL } from "../../redux/actions/authService";
import { useSelector } from "react-redux";
import coming_soon from "../../statics/user_side/work_image/coming_soon.jpg";

const TaskerProfile = ({ tasker, onClose }) => {
  const [taskerInfo, setTaskerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchTasker = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}adminside/tasker_details/`, {
          params: { id: tasker.id }, // Make sure tasker.id is correct
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTaskerInfo(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (tasker && tasker.id) {
      fetchTasker();
    }
  }, [tasker, accessToken]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  if (error)
    return <p className="text-center mt-4 text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg  shadow-lg max-w-2xl mx-auto mt-28">
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-purple-950 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
        >
          <span className="mr-2">✕</span>
          Close
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-950">Tasker Profile</h1>
      </div>
      {taskerInfo && (
        <div className="grid grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">Name:</span> {taskerInfo.full_name}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {taskerInfo.phone_number}
          </p>
          <p>
            <span className="font-semibold">Aadhar Number:</span>{" "}
            {taskerInfo.aadhar_number}
          </p>
          <p>
            <span className="font-semibold">Task:</span>{" "}
            {taskerInfo.task ? taskerInfo.task.name : "No task assigned"}
          </p>
          <p>
            <span className="font-semibold">Task Fee:</span>{" "}
            {taskerInfo.task_fee}
          </p>
          <p>
            <span className="font-semibold">City:</span> {taskerInfo.city}
          </p>
          <p>
            <span className="font-semibold">State:</span> {taskerInfo.state}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {taskerInfo.address}
          </p>
          <div className="col-span-2 mt-4">
            <p className="font-semibold mb-2">Work Photo:</p>
            <img
              src={
                taskerInfo.work_photo
                  ? `${B_URL}${taskerInfo.work_photo}`
                  : coming_soon
              }
              alt="Work"
              className="w-full h-64 object-cover rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskerProfile;
