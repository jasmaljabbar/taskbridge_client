import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Img1 from "../../../statics/user_side/worker_image/jnj.png";

const Add1 = ({ title, description1, description2, imgSrc }) => {
  return (
    <div className="flex items-center justify-center bg-blue-300 rounded-lg p-8 mx-4">
      <div className="flex flex-col justify-center items-start w-1/2">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg mb-2">{description1}</p>
        <p className="text-lg">{description2}</p>
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
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const ads = [
    {
      title: "Assembly",
      description1:
        "Assemble or disassemble furniture items by unboxing, building, and any cleanup.",
      description2:
        "Now Trending: Curved sofas, computer desks, and sustainable materials.",
      imgSrc: Img1,
    },
    {
      title: "Cleaning",
      description1: "Professional cleaning services for homes and offices.",
      description2: "Now Trending: Eco-friendly cleaning products.",
      imgSrc: Img1,
    },
    // Add more ads as needed
  ];

  return (
    <Slider {...settings}>
      {ads.map((ad, index) => (
        <Add1
          key={index}
          title={ad.title}
          description1={ad.description1}
          description2={ad.description2}
          imgSrc={ad.imgSrc}
        />
      ))}
    </Slider>
  );
};

export default AdSlider;
