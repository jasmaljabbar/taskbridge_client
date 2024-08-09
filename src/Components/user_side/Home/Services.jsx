import React, { useEffect, useState } from "react";
import axios from "axios";
import { B_URL, BASE_URL } from "../../../redux/actions/authService";
import { Link } from "react-router-dom";
import Img4 from "../../../statics/user_side/images/group-61.jpg";

const ServiceCard = ({ imgSrc, title, description, userId }) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md m-4">
      <a href="#">
        <img className="rounded-t-lg w-full" src={imgSrc} alt={title} />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {title}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700">{description}</p>
        <Link to={`/details/${userId}?user=${userId}`}>
          <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
            Read more
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
};

const Services = () => {
  const [taskersInfo, setTaskersInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}account/api/addsTasker/`);
        setTaskersInfo(response.data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, []);

  const generateDescription = (title) => {
    switch (title) {
      case "Minor Plumbing Repairs":
        return "Projects starting at ₹760";
      case "Furniture Assembly":
        return "Projects starting at ₹49";
      case "Electrical Help":
        return "Projects starting at ₹760";
      // Add more cases as needed
      default:
        return "High-quality service for your needs.";
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {taskersInfo.map((tasker, index) => (
        <ServiceCard
          key={index}
          imgSrc={
            tasker.profile_pic
              ? `${B_URL}${tasker.work_photo}`
              : Img4
          }
          title={tasker.task.name}
          description={generateDescription(tasker.task.name)}
          userId={tasker.user}
        />
      ))}
    </div>
  );
};

export default Services;
