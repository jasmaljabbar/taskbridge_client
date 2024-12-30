import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskerProfile } from "../../redux/reducers/tasker_authSlice";
import { fetchUserProfile } from "../../redux/reducers/authSlice";
import Select from "react-select";
import tasker_authService from "../../redux/actions/tasker_authService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import TaskShow from "./TaskShow/TaskShow";
import { BASE_URL } from "../../redux/actions/authService";
import ImageUpload from "../common/ImageUpload";

const TaskerProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.tasker_auth.user);
  const accessToken = useSelector((state) => state.auth.token);
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [taskerData, setTaskerData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [workCategories, setWorkCategories] = useState([]);
  const [error, setError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    if (accessToken) {
      try {
        const taskerProfileResponse = await dispatch(
          fetchTaskerProfile(accessToken)
        );
        const userProfileResponse = await dispatch(
          fetchUserProfile(accessToken)
        );

        setTaskerData(taskerProfileResponse.payload);
        setUserData(userProfileResponse.payload.profile);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError("Failed to fetch profiles. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, accessToken]);

  useEffect(() => {
    const fetchWorkCategories = async () => {
      try {
        const categories = await tasker_authService.getWork_Categories_for_user();
        setWorkCategories(
          categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch work categories:", error);
        setError("Failed to fetch work categories. Please try again.");
      }
    };
    fetchWorkCategories();
  }, []);

  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required("Full Name is required"),
    phone_number: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    aadhar_number: Yup.string()
      .matches(/^\d{12}$/, "Aadhar number must be 12 digits")
      .required("Aadhar number is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    address: Yup.string().required("Address is required"),
    task: Yup.object()
      .shape({
        value: Yup.number().required("Work Category ID is required"),
        label: Yup.string().required("Work Category Label is required"),
      })
      .nullable()
      .required("Task is required"),
    task_fee: Yup.number()
      .typeError("Service charge must be a number")
      .required("Service charge is required"),
    work_photo: Yup.string().nullable(),
  });

  const handleImageUpload = async (file, setFieldValue) => {
    try {
      const imageUrl = await ImageUpload(file);
      setFieldValue("work_photo", imageUrl);
      setUploadedImageUrl(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      const requestBody = {
        full_name: values.full_name,
        phone_number: values.phone_number,
        aadhar_number: values.aadhar_number,
        address: values.address,
        city: values.city,
        state: values.state,
        task: values.task?.value || values.task,
        task_fee: values.task_fee,
        work_photo: values.work_photo || uploadedImageUrl,
      };
  
      console.log("Request Body:", requestBody); // Debugging log
  
      const response = await axios.put(
        `${BASE_URL}task_workers/update/`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("API Response:", response.data); // Debugging log
  
      setTaskerData((prevData) => ({
        ...prevData,
        ...response.data,
      }));
  
      fetchData();
      setIsLoading(false);
      setEditing(false);
      dispatch(fetchTaskerProfile(accessToken));
      resetForm();
    } catch (error) {
      console.error("Error saving profile:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Failed to save profile. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  

  if (!taskerData || !userData) {
    return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
  }

  return (
    <div className="flex flex-col mt-80 md:flex-row w-full">
      <div className="min-h-screen flex flex-1 items-center justify-center py-12 px-4 sm:px-6  lg:px-10 lg:w-2/3">
        <div className="max-w-4xl  w-[50%] bg-white shadow-lg rounded-lg p-8 md:mt-0 mt-[800px]">
          <div className="flex items-center justify-between border-b pb-6 mb-6">
            <div className="flex items-center">
              <img
                src={userData.profile_photo || Unknown}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <h2 className="text-2xl font-bold">
                  {userData.username || "N/A"}
                </h2>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-[20%] rounded"
            >
              EditProfile
            </button>
          </div>

          {editing ? (
            <Formik
              initialValues={{
                full_name: taskerData.full_name || "",
                phone_number: taskerData.phone_number || "",
                aadhar_number: taskerData.aadhar_number || "",
                city: taskerData.city || "",
                state: taskerData.state || "",
                address: taskerData.address || "",
                task: taskerData.task
                  ? {
                      value: taskerData.task.id || taskerData.task,
                      label: taskerData.task.name || "Unknown",
                    }
                  : null,
                task_fee: taskerData.task_fee || "",
                work_photo: taskerData.work_photo || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, isSubmitting }) => (
                <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="mb-1 block">Full Name</label>
                    <Field
                      name="full_name"
                      className="border rounded-md border-black p-3 w-full"
                      placeholder="Full Name"
                    />
                    <ErrorMessage
                      name="full_name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block">Phone Number</label>
                    <Field
                      name="phone_number"
                      className="border rounded-md border-black p-3 w-full"
                      placeholder="Phone Number"
                    />
                    <ErrorMessage
                      name="phone_number"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block">Aadhar Number</label>
                    <Field
                      name="aadhar_number"
                      className="border rounded-md border-black p-3 w-full"
                      placeholder="Aadhar Number"
                    />
                    <ErrorMessage
                      name="aadhar_number"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block">City</label>
                    <Field
                      name="city"
                      className="border rounded-md border-black p-3 w-full"
                      placeholder="City"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block">State</label>
                    <Field
                      name="state"
                      className="border rounded-md border-black p-3 w-full"
                      placeholder="State"
                    />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="mb-1 block">Address</label>
                    <Field
                      name="address"
                      className="border rounded-md border-black p-3 w-full"
                      placeholder="Address"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="mb-1 block">Work Category</label>
                    <Select
                      name="task"
                      options={workCategories}
                      value={values.task}
                      onChange={(selectedOption) => {
                        setFieldValue("task", selectedOption);
                      }}
                      className="border rounded-md border-black w-full"
                    />
                    <ErrorMessage
                      name="task"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block">Service Charge</label>
                    <Field
                      name="task_fee"
                      className="border rounded-md border-black p-3 w-full"
                      placeholder="Service Charge"
                    />
                    <ErrorMessage
                      name="task_fee"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="mb-1 block">Work Photo</label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          if (event.currentTarget.files?.[0]) {
                            handleImageUpload(event.currentTarget.files[0], setFieldValue);
                          }
                        }}
                      />
                      {values.work_photo && (
                        <div className="mt-2">
                          <img
                            src={values.work_photo}
                            alt="Work Preview"
                            className="w-full max-w-md rounded-md"
                          />
                        </div>
                      )}
                    </div>
                    <ErrorMessage
                      name="work_photo"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                      disabled={isSubmitting}
                    >
                      Save Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="w-full bg-red-600 text-white rounded-md py-2 px-4 hover:bg-red-700 transition duration-300 mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4">Profile Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Full Name:</strong> {taskerData.full_name || "N/A"}
                </div>
                <div>
                  <strong>Phone Number:</strong>{" "}
                  {taskerData.phone_number || "N/A"}
                </div>
                <div>
                  <strong>Aadhar Number:</strong>{" "}
                  {taskerData.aadhar_number || "N/A"}
                </div>
                <div>
                  <strong>City:</strong> {taskerData.city || "N/A"}
                </div>
                <div>
                  <strong>State:</strong> {taskerData.state || "N/A"}
                </div>
                <div>
                  <strong>Address:</strong> {taskerData.address || "N/A"}
                </div>
                <div>
                  <strong>Work Category:</strong>{" "}
                  {taskerData.task?.name || "N/A"}
                </div>
                <div>
                  <strong>Service Charge:</strong>{" "}
                  {taskerData.task_fee || "N/A"}
                </div>
                <div className="col-span-1 md:col-span-2">
                  <strong>Work Photo:</strong>
                  {taskerData.work_photo ? (
                    <img
                      src={taskerData.work_photo}
                      alt="Work"
                      className="w-full rounded-md mt-4"
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 lg:fixed lg:top-0 lg:right-0 lg:w-1/3">
        <TaskShow taskerData={taskerData} />
      </div>
    </div>
  );
};

export default TaskerProfile;
