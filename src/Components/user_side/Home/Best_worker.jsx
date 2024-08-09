import React, { useEffect, useState } from "react";
import { B_URL, BASE_URL } from "../../../redux/actions/authService";
import axios from "axios";
import { Link } from "react-router-dom";

const BestWorker = () => {
  const [taskersInfo, setTaskersInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}account/api/bestTasker/`);
        setTaskersInfo(response.data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-9 container mx-auto">
      <div className="flex items-center justify-between p-6 w-full sm:w-3/6">
        {taskersInfo.map((item, index) => (
          <Link key={index} to={`/details/${item.user}?user=${item.user}`}>
            <div className="flex flex-col items-center p-2 text-center">
              <img
                src={
                  item.profile_pic
                    ? `${B_URL}${item.profile_pic}`
                    : "fallback_image_url"
                }
                alt={item.full_name}
                className="shadow rounded-full max-w-full h-auto align-middle border-none"
                style={{ width: "100px", height: "100px" }}
              />
              <p>{item.full_name}</p>
              {item.label && <p>{item.label}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestWorker;
