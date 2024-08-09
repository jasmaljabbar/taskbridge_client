import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { B_URL, BASE_URL } from "../../../redux/actions/authService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Unknown from '../../../statics/user_side/Unknown.jpg';
import { Link } from "react-router-dom";


const Add1 = ({ title, description, imgSrc }) => {
  return (
    <div className="flex items-center justify-center bg-blue-300 rounded-lg p-8 mx-4">
      <div className="flex flex-col justify-center items-start w-1/2">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg mb-2">{description}</p>
      </div>
      <div className="w-1/2 flex justify-center">
        <img
          src={imgSrc}
          alt={title}
          className="rounded-lg shadow-md"
          style={{ maxHeight: "250px" }}
        />
      </div>
    </div>
  );
};

const AdSlider = () => {
  const [taskersInfo, setTaskersInfo] = useState([]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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
      case "Assembly":
        return "Expert assembly services for your home and office furniture, ensuring every piece is built to perfection.";
      case "Cleaning":
        return "Professional and thorough cleaning services, leaving your spaces spotless and refreshed.";
      // Add more cases as needed based on the tasker's title
      default:
        return "Dedicated and skilled professional ready to provide top-notch services.";
    }
  };

  return (
    <Slider {...settings}>
      {taskersInfo.map((tasker, index) => (
        <Link key={index} to={`/details/${tasker.user}?user=${tasker.user}`}>
        <Add1
          key={index}
          title={tasker.task.name}
          description={generateDescription(tasker.task.name)}
          imgSrc={tasker.profile_pic ? `${B_URL}${tasker.profile_pic}` : Unknown}
        />
        </Link>
      ))}
    </Slider>
  );
};

export default AdSlider;
