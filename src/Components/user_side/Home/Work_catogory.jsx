import React, { useEffect, useState } from "react";
import { B_URL, BASE_URL } from "../../../redux/actions/authService";
import next from "../../../statics/user_side/work_image/after.png";
import previos from "../../../statics/user_side/work_image/previos.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Work_category = () => {
  const [workItems, setWorkItems] = useState([]);
  const [taskId, setTaskId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}account/api/taskcategory/`);
        setWorkItems(response.data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, []);

  const filter_tasker = (id) => {
    setTaskId(id);
    navigate(`/Filtered_tasker/${id}?taskId=${id}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <img
        src={next}
        alt="Next"
        className={className}
        style={{ ...style, display: "block", width: "30px", height: "30px" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <img
        src={previos}
        alt="Previous"
        className={className}
        style={{ ...style, display: "block", width: "30px", height: "30px" }}
        onClick={onClick}
      />
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full sm:w-12/12">
        <Slider {...settings}>
          {workItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-2"
              onClick={() => filter_tasker(item.id)}
            >
              <div className="flex justify-center">
                <img
                  src={`${B_URL}${item.work_image}`}
                  alt={item.alt}
                  className={`shadow rounded-full max-w-full h-auto align-middle border-none transition-transform transform hover:scale-105 ${item.className}`}
                  style={{
                    width: "30%",
                    height: "auto",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div className="pr-22">
                {item.name && <p>{item.name}</p>}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Work_category;
