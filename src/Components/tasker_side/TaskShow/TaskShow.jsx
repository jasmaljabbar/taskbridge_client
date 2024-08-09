import React from "react";
import your_image from "../../../statics/tasker_side/images/your_image_here.png";

const TaskShow = ({ taskerData }) => {
  if (!taskerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:pl-20">
      <div className="px-10">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={taskerData.work_photo || your_image}
            alt={taskerData.full_name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Meet {taskerData.full_name}
            </h2>
            <p className="text-xl mb-4 text-gray-600">
              Our skilled {taskerData.task?.name || "professional"}
            </p>
            <div className="mb-6">
              <p className="text-lg text-gray-700">
                With a service charge of{" "}
                <span className="font-semibold text-green-600">
                  ₹{taskerData.task_fee}
                </span>{" "}
                per hour, {taskerData.full_name} ensures reliable{" "}
                {taskerData.task?.name || "professional"} solutions for your
                needs.
              </p>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Contact Information
              </h3>
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span>{" "}
                {taskerData.phone_number}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Location:</span> {taskerData.city}
                , {taskerData.state}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskShow;
