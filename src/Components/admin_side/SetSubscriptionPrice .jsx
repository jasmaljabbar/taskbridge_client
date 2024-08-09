import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../redux/actions/authService";
import toast from "react-hot-toast";

function SetSubscriptionPrice() {
  const [subscriptionType, setSubscriptionType] = useState("");
  const [price, setPrice] = useState("");
  const [options, setOptions] = useState({});
  const [error, setError] = useState(null);
  const accessToken = useSelector((state) => state.auth.token);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before new request
    try {
      const response = await axios.post(
        `${BASE_URL}adminside/subscription-prices/`,
        { subscription_type: subscriptionType, price },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setSubscriptionType("");
      setPrice("");
      toast.success("Subscription price set successfully!");
      fetchData(); // Re-fetch options after successful submission
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.subscription_type) {
          setError(
            "A subscription price with this subscription type already exists."
          );
        } else {
          setError("An error occurred while setting the subscription price.");
        }
      } else {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  return (
    <div className="flex flex-col pt-[8%] items-center justify-center min-h-screen ">
      <h1 className="text-2xl font-bold mb-6">Set Subscription Price</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Subscription Type</label>
          <select
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select Subscription Type</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            step="0.01"
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Set Price
        </button>
      </form>
      <>
        <div className="flex flex-col pt-4 md:flex-row gap-8 w-full max-w-4xl">
          {options.monthly && (
            <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Monthly Plan
                </h3>
                <p className="text-4xl font-bold text-blue-600 mb-6">
                  ₹{options.monthly.price}
                  <span className="text-lg text-gray-500">/month</span>
                </p>
                <ul className="text-gray-600 mb-8">
                  {options.monthly.description
                    .split(". ")
                    .map((feature, index) => (
                      <li key={index} className="flex items-center mb-3">
                        <svg
                          className="w-5 h-5 mr-2 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}

          {options.yearly && (
            <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col justify-between flex-1 border-2 border-green-500">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Yearly Plan
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Best Value
                  </span>
                </div>
                <p className="text-4xl font-bold text-green-600 mb-6">
                  ₹{options.yearly.price}
                  <span className="text-lg text-gray-500">/year</span>
                </p>
                <ul className="text-gray-600 mb-8">
                  {options.yearly.description
                    .split(". ")
                    .map((feature, index) => (
                      <li key={index} className="flex items-center mb-3">
                        <svg
                          className="w-5 h-5 mr-2 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
}

export default SetSubscriptionPrice;
