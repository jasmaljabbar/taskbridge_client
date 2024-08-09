import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/actions/authService";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { logout } from "../../redux/reducers/authSlice";

const SuccessPage = () => {
  const accessToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subscriptionType = queryParams.get("subscription_type");

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const logSuccess = async () => {
      try {
        await axios.post(
          `${BASE_URL}task_workers/payment/log_success/`,
          { subscription_type: subscriptionType },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Error logging success:", error.message);
      }
    };

    logSuccess();
  }, [accessToken, subscriptionType]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-4">Thank you for your subscription.</p>
        <button
          onClick={handleLogout}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Login Again
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
