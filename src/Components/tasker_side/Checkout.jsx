import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/actions/authService";
import { useSelector } from "react-redux";

const ProductDisplay = () => (
  <section className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg">
    <div className="product mb-4">
      <img
        src="https://i.imgur.com/EHyR2nP.png"
        alt="The cover of Stubborn Attachments"
        className="rounded-lg"
      />
      <div className="description mt-4 text-center">
        <h3 className="text-xl font-semibold">Stubborn Attachments</h3>
        <h5 className="text-lg text-gray-500">$20.00</h5>
      </div>
    </div>
    <form id="checkout-form" className="w-full">
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
      >
        Checkout
      </button>
    </form>
  </section>
);

const Message = ({ message }) => (
  <section className="flex items-center justify-center h-screen">
    <p className="text-xl font-semibold">{message}</p>
  </section>
);

const Checkout = () => {
  const [message, setMessage] = useState("");
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const form = document.getElementById("checkout-form");
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Prepare the data with all required fields
        const taskerData = {
          full_name: "John Doe", // Example data
          phone_number: "1234567890", // Example data
          aadhar_number: "123456789012", // Example data
          task: "task_id", // Replace with actual task ID
          task_fee: 29.00, // Example data
          city: "City Name", // Example data
          state: "State Name", // Example data
          address: "123 Main St", // Example data
        };
    
        const { data } = await axios.post(
          `${BASE_URL}task_workers/TaskerProfile/`,
          taskerData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        
        if (data.url) {
          window.location.href = data.url;
        } else {
          setMessage("An error occurred while processing your request.");
        }
      } catch (error) {
        console.error("Error creating tasker profile:", error);
        setMessage("An error occurred while processing your request.");
      }
    };
    

    form.addEventListener("submit", handleSubmit);

    // Clean up event listener
    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, [accessToken]);

  return message ? (
    <Message message={message} />
  ) : (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ProductDisplay />
    </div>
  );
};

export default Checkout;
