import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../redux/actions/authService";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const validationSchema = Yup.object().shape({
  minimum_hours_to_work: Yup.number()
    .min(1, "Minimum hours to work must be at least 1 hour")
    .max(500, 'Maximum hours to work must be les that 500 hour')
    .required("Minimum Hours to Work is required"),
  address: Yup.string().required("Address is required"),
  phone_number: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number is not valid")
    .required("Phone number is required"),
  date: Yup.date().required("Date is required"),
});

const BookNow = ({ taskerId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.token);
  const user_profile = useSelector((state) => state.auth.userProfile);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    employee: taskerId || "",
    minimum_hours_to_work: "",
    address: user_profile?.address || "",
    phone_number: user_profile?.phone_number || "",
    date: "",
  };

  useEffect(() => {
    if (taskerId && user_profile) {
      initialValues.employee = taskerId;
      initialValues.address = user_profile?.address || "";
      initialValues.phone_number = user_profile?.phone_number || "";
    }
  }, [taskerId, user_profile]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    const appointmentData = { ...values };

    try {
      const response = await axios.post(
        `${BASE_URL}booking/appointments/`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Appointment created successfully");
      setLoading(false);
      setIsModalOpen(false);
         } catch (error) {
      toast.error("There was an error creating the appointment");
      setLoading(false);
    }
    setSubmitting(false);
  };

  const handleModalOpen = () => {
    if (!taskerId) {
      toast.error("Tasker details are not available");
    } else {
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={handleModalOpen}
        className="w-full py-2 rounded-lg bg-blue-500 text-white px-4 mb-4"
      >
        Request Appointment
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg z-10">
            <h2 className="text-xl font-semibold mb-4">Book Tasker</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Minimum Hours to Work
                    </label>
                    <Field
                      type="number"
                      name="minimum_hours_to_work"
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    <ErrorMessage
                      name="minimum_hours_to_work"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <Field
                      as="textarea"
                      name="address"
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Phone Number</label>
                    <Field
                      type="text"
                      name="phone_number"
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    <ErrorMessage
                      name="phone_number"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Date</label>
                    <Field
                      type="date"
                      name="date"
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Book Now
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookNow;
