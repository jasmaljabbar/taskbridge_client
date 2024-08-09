import React from "react";

import Best_worker from "./Home/Best_worker";
import Footer from "./Home/Footer";
import Work_category from "./Home/Work_catogory";
import TaskerListing from "./Services/TaskerListing";

const Services = () => {
  return (
    <div className="min-h-screen pt-24 bg-gray-100">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Work_category />
        <h1 className="flex items-center justify-center text-3xl font-bold text-blue-950 py-4">
          Best Worker
        </h1>
        <Best_worker />

        <TaskerListing />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
