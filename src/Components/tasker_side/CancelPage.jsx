import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/actions/authService";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const CancelPage = () => {
  const accessToken = useSelector((state) => state.auth.token);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subscriptionType = queryParams.get("subscription_type");

  useEffect(() => {
    const logCancel = async () => {
      try {
        await axios.post(
          `${BASE_URL}task_workers/payment/log_cancel/`,
          { subscription_type: subscriptionType },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("no"); // Print 'no' for cancel
      } catch (error) {
        console.error("Error logging cancel:", error.message);
      }
    };

    logCancel();
  }, [accessToken, subscriptionType]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          Payment Canceled
        </h2>
        <p className="text-gray-600 mb-4">
          Your subscription process was canceled.
        </p>
        <a
          href="/"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default CancelPage;
