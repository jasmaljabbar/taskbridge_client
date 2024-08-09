import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Confirm_without_msg from "../../common/Confirm_without_msg";
import { BASE_URL } from "../../../redux/actions/authService";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [appointmentIdToCancel, setAppointmentIdToCancel] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state) => state.auth.token);
  const taskerInfo = useSelector((state) => state.auth.taskerDetails);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}booking/appointment/history/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              tasker_id: taskerInfo.user.id,
            },
          }
        );
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching appointments:", error);
        toast.error("Failed to fetch appointment history");
        setLoading(false);
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
      case "canceled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  const handleEdit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}booking/appointment/update/${selectedAppointment.id}/`,
        selectedAppointment,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const updatedAppointment = response.data;
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === updatedAppointment.id
            ? updatedAppointment
            : appointment
        )
      );
      setLoading(false);
      toast.success("Appointment updated successfully");
      closeModal();
    } catch (error) {
      console.log("Error updating appointment:", error);
      toast.error("Failed to update appointment");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  const handleCancel = (appointmentId) => {
    setAppointmentIdToCancel(appointmentId);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}booking/appointment/cancel/${appointmentIdToCancel}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === appointmentIdToCancel
              ? { ...appointment, status: "canceled" }
              : appointment
          )
        );
        toast.success("Appointment canceled successfully");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error canceling appointment:", error);
      toast.error("Failed to cancel appointment");
      setLoading(false);
    } finally {
      setShowModal(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-[40%]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 ml-72 mt-64 sm:px-6 lg:px-8">
      <Confirm_without_msg
        show={showModal}
        onClose={() => {
          closeModal();
          setShowModal(false);
        }}
        onConfirm={confirmCancel}
        message="Are you sure you want to cancel this appointment?"
        confirmText="Yes, cancel it"
      />
      <div className="max-w-3xl  mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Appointment History
        </h1>
        {appointments.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-gray-700">
                      {appointment.date}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {formatStatus(appointment.status)}
                      </span>
                      <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                        {appointment.minimum_hours_to_work} hours
                      </span>
                      {(appointment.status === "pending" ||
                        appointment.status === "accepted") && (
                        <>
                          <button
                            onClick={() => openModal(appointment)}
                            className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleCancel(appointment.id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-600">
                    <p className="mb-2">
                      <span className="font-medium">Address:</span>{" "}
                      {appointment.address}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {appointment.phone_number}
                    </p>
                    <p>
                      <span className="font-medium">Employee:</span>{" "}
                      {appointment.employee_name}
                    </p>
                    {appointment.rejection_reason && (
                      <p>
                        <span className="font-medium">
                          Message from our tasker:
                        </span>{" "}
                        {appointment.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-gray-600">No appointments found.</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Appointment</h2>
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={selectedAppointment.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={selectedAppointment.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone_number"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={selectedAppointment.phone_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;
