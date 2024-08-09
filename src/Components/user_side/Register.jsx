import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../redux/reducers/authSlice";
import toast from "react-hot-toast";
import Otp from "./Otp";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [isOtp, setIsOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isError, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!formData.confirm_password) {
      errors.confirm_password = "Confirm Password is required.";
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    } else {
      setErrors({});
    }

    const resultAction = await dispatch(register(formData));

    if (register.fulfilled.match(resultAction)) {
      toast.success("User registered successfully. OTP sent to your email.");
      setIsOtp(true);
      setLoading(false);
    } else {
      if (resultAction.payload) {
        toast.error("Email or Username already exists");
        setLoading(false);
      } else {
        toast.error("Registration failed.");
        setLoading(false);
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div>
      {!isOtp ? (
        <div className="flex justify-center items-center h-full p-10">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-4xl font-bold flex ml-32">Sign Up</h1>
            <form className="flex flex-col mt-9" onSubmit={handleSubmit}>
              <label className="mb-3">Name</label>
              <input
                onChange={handleChange}
                value={formData.name}
                name="name"
                className={`border rounded-md p-3 ${
                  errors.name ? "border-red-500" : "border-black"
                }`}
                type="text"
                placeholder="Name"
              />
              {errors.name && <span className="text-red-500">{errors.name}</span>}
              <label className="my-3">Email</label>
              <input
                onChange={handleChange}
                value={formData.email}
                name="email"
                className={`border rounded-md p-3 ${
                  errors.email ? "border-red-500" : "border-black"
                }`}
                type="email"
                placeholder="Email"
              />
              {errors.email && <span className="text-red-500">{errors.email}</span>}
              <label className="my-3">Password</label>
              <input
                onChange={handleChange}
                value={formData.password}
                name="password"
                className={`border rounded-md p-3 ${
                  errors.password ? "border-red-500" : "border-black"
                }`}
                type="password"
                placeholder="Password"
              />
              {errors.password && <span className="text-red-500">{errors.password}</span>}
              <label className="my-3">Confirm Password</label>
              <input
                onChange={handleChange}
                value={formData.confirm_password}
                name="confirm_password"
                className={`border rounded-md p-3 ${
                  errors.confirm_password ? "border-red-500" : "border-black"
                }`}
                type="password"
                placeholder="Confirm Password"
              />
              {errors.confirm_password && (
                <span className="text-red-500">{errors.confirm_password}</span>
              )}
              <button
                type="submit"
                className="w-full bg-blue-900 text-white rounded-md py-2 px-4 hover:bg-blue-500 transition duration-300 mt-6"
              >
                Register
              </button>
            </form>
            <p className="mt-4 block text-sm font-medium leading-6 text-gray-900">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-700 cursor-pointer"
              >
                Log in
              </span>
            </p>
          </div>
        </div>
      ) : (
        <Otp email={formData?.email} />
      )}
    </div>
  );
}

export default Register;
