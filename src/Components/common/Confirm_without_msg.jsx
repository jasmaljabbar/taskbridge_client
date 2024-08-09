import React, { useState } from "react";

const Confirm_without_msg = ({ show, onClose, onConfirm, message, confirmText }) => {
    const [info, setInfo] = useState("");

    const handleConfirm = () => {
        onConfirm(info);
        setInfo("");
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4">{message}</p>
                
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
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirm_without_msg;
