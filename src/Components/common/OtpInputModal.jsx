import React, { useState } from "react";

const OtpInputModal = ({ show, onClose, onConfirm, message }) => {
  const [otp, setOtp] = useState("");

  const handleConfirm = () => {
    onConfirm(otp);
    setOtp("");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-4">{message}</p>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpInputModal;