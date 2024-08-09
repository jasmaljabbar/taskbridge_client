import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FcManager } from "react-icons/fc";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";
import { format } from "date-fns";
import { BASE_URL } from "../../redux/actions/authService";

const TaskerAppointments = () => {
  const [appointments, setAppointments] = useState({ today: [], tomorrow: [] });
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}booking/today-tomorrow/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("API response data:", response.data); // Log the response data
        setAppointments(response.data);
      } catch (error) {
        console.log("Error fetching appointments:", error);
        toast.error("Failed to fetch appointments");
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchAppointments();
    }
  }, [accessToken]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "complete":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderAppointments = (title, appointments) => (
    <div className="max-w-7xl mt-72 mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pl-52 gap-6">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-blue-500" />
                    <p className="text-lg font-semibold text-gray-700">
                      {format(new Date(appointment.date), "MMMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {formatStatus(appointment.status)}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full flex items-center">
                      <FaClock className="mr-1" />
                      {appointment.minimum_hours_to_work} hours
                    </span>
                  </div>
                </div>
                <div className="text-gray-600 space-y-2">
                  <p className="flex items-center">
                    <FcManager className="mr-2 text-red-500" />
                    <span className="font-medium">Client:</span>{" "}
                    {appointment.user_name}
                  </p>
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    <span className="font-medium">Address:</span>{" "}
                    {appointment.address}
                  </p>
                  <p className="flex items-center">
                    <FaPhoneAlt className="mr-2 text-green-500" />
                    <span className="font-medium">Phone:</span>{" "}
                    {appointment.phone_number}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center col-span-3">
            <p className="text-xl text-gray-600">No appointments found.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Today's and Tomorrow's Appointments
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {renderAppointments("Today's Appointments", appointments.today)}
          {renderAppointments("Tomorrow's Appointments", appointments.tomorrow)}
        </>
      )}
    </div>
  );
};

export default TaskerAppointments;
