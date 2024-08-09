import React from "react";

const DebugTokenComponent = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.access;
  console.log("Stored Token:", accessToken);

  return (
    <div className="flex justify-center items-center h-screen">
      Check console for token
    </div>
  );
};

export default DebugTokenComponent;
