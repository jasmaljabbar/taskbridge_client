import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tasker_register } from "../../redux/reducers/tasker_authSlice";
import tasker_authService from "../../redux/actions/tasker_authService";
import Select from "react-select";
import { logout } from "../../redux/reducers/authSlice";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const [workCategories, setWorkCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector((state) => state.tasker_auth);

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
      }
    };

    fetchWorkCategories();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.access;
    if (!accessToken) {
      console.error("No access token available");
      return;
    }
  }, []);

  const validationSchema = Yup.object().shape({
    full_name: Yup.string()
      .required("Full Name is required")
      .test(
        "no-spaces",
        "Full Name cannot be just spaces",
        (value) => value && value.trim().length > 0
      ),
    phone_number: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    aadhar_number: Yup.string()
      .matches(/^\d{12}$/, "Aadhar number must be 12 digits")
      .required("Aadhar number is required"),
    city: Yup.string()
      .required("City is required")
      .test(
        "no-spaces",
        "City cannot be just spaces",
        (value) => value && value.trim().length > 0
      ),
    state: Yup.string()
      .required("State is required")
      .test(
        "no-spaces",
        "State cannot be just spaces",
        (value) => value && value.trim().length > 0
      ),
    address: Yup.string()
      .required("Address is required")
      .test(
        "no-spaces",
        "Address cannot be just spaces",
        (value) => value && value.trim().length > 0
      ),
    task: Yup.number().required("Task is required"),
    task_service_charge: Yup.number().required("Service Charge is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true)
    try {
      const formattedValues = {
        ...values,
        task_service_charge: parseFloat(values.task_service_charge), 
      };

      const resultAction = await dispatch(tasker_register(formattedValues));
      if (tasker_register.fulfilled.match(resultAction)) {
        await dispatch(logout()).unwrap();
        toast.success("Tasker request sent successfully. Please check your email after some time.")
        setLoading(false)
        navigate("/login");
        resetForm();
      } else {
        throw new Error(resultAction.payload || "Failed to register");
      }
      setLoading(false)
    } catch (error) {
      console.error("Error during registration", error);
      setLoading(false)
      let errorMessage = "Failed to register";
      if (error.response && error.response.data) {
        errorMessage = Object.values(error.response.data).flat().join(" ");
      }
      toast.error(errorMessage);
      setLoading(false)
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex justify-center items-center h-full p-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Sign Up</h1>
        <Formik
          initialValues={{
            full_name: "",
            phone_number: "",
            aadhar_number: "",
            task: "",
            task_service_charge: "",
            city: "",
            state: "",
            address: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
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
                <label className="mb-1 block">Task</label>
                <Select
                  onChange={(selectedOption) => {
                    setFieldValue("task", selectedOption.value);
                  }}
                  options={workCategories}
                  className="border rounded-md border-black p-3 w-full"
                  placeholder="Select task"
                />
                <ErrorMessage
                  name="task"
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
              <div className="col-span-2">
                <label className="mb-1 block">Address</label>
                <Field
                  as="textarea"
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
              <div className="col-span-2">
                <label className="mb-1 block">Service Charge</label>
                <Field
                  name="task_service_charge"
                  type="number"
                  className="border rounded-md border-black p-3 w-full"
                  placeholder="Service Charge"
                />
                <ErrorMessage
                  name="task_service_charge"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white rounded-md py-2 px-4 hover:bg-blue-500 transition duration-300 mt-6"
                >
                  Register
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
