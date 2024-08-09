import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/actions/authService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [options, setOptions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}task_workers/payment/options/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setOptions(response.data);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchData();
  }, [accessToken]);

  const handleCheckout = async (subscriptionType) => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${BASE_URL}task_workers/create-checkout-session/`,
        { subscription_type: subscriptionType },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.url) {
        window.location.href = response.data.url; 
        setIsLoading(false)
      } else {
        alert("Failed to get checkout URL");
        setIsLoading(false)
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen p-6">
  <h2 className="text-3xl font-bold mb-10 text-gray-800">
    Select Your Subscription
  </h2>
  <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
    {options.monthly && (
      <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Monthly Plan
          </h3>
          <p className="text-4xl font-bold text-blue-600 mb-6">
            ₹{options.monthly.price}<span className="text-lg text-gray-500">/month</span>
          </p>
          <ul className="text-gray-600 mb-8">
            {options.monthly.description.split('. ').map((feature, index) => (
              <li key={index} className="flex items-center mb-3">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          onClick={() => handleCheckout("monthly")}
        >
          Choose Monthly
        </button>
      </div>
    )}

    {options.yearly && (
      <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col justify-between flex-1 border-2 border-green-500">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              Yearly Plan
            </h3>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Best Value</span>
          </div>
          <p className="text-4xl font-bold text-green-600 mb-6">
            ₹{options.yearly.price}<span className="text-lg text-gray-500">/year</span>
          </p>
          <ul className="text-gray-600 mb-8">
            {options.yearly.description.split('. ').map((feature, index) => (
              <li key={index} className="flex items-center mb-3">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          onClick={() => handleCheckout("yearly")}
        >
          Choose Yearly
        </button>
      </div>
    )}
  </div>
</div>
  )
};

export default PaymentPage;
