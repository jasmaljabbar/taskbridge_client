import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../../redux/actions/authService";

const Otp = (props) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}account/api/resend-otp`,
        { email: props?.email }
      );
      if (response.status === 200) {
        toast.success("New OTP sent to your email. ");
        setLoading(false);
        setMessage("New OTP sent to your email.");
        setTimeLeft(60); // reset the countdown
      }
    } catch (error) {
      toast.error(error.message);
      setMessage("Failed to resend OTP. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setMessage("OTP expired. Please request a new one.");
    }
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}account/api/validate-otp`,
        {
          otp: otp,
          email: props?.email,
        }
      );
      console.log(response);

      if (response.status === 200) {
        toast.success("Email verified successfully!");
        setLoading(false);
        setMessage("Email verified successfully!");
        // handle token storage or redirection here
        return navigate("/login");
      }
    } catch (error) {
      setMessage("Invalid OTP. Please try again.");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4">
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP:
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {timeLeft > 0 && (
            <p className="text-sm text-gray-500">
              Time left to enter OTP: {timeLeft} seconds
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
          >
            Submit
          </button>
        </form>
        <div className="pr-36 pl-10">
          {timeLeft === 0 && (
            <button
              onClick={handleResendOtp}
              className="left-0 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-4"
            >
              Resend OTP
            </button>
          )}
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Otp;
