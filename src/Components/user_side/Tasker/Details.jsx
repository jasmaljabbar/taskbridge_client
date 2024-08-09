import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { fetchTaskerDetails } from "../../../redux/reducers/authSlice";
import BookNow from "./BookNow";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../../redux/actions/authService";

const Details = () => {
  const [user_in, setUser_in] = useState({
    user_id: "",
    user_image: "",
  });
  const [Loding, setLoding] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const accessToken = useSelector((state) => state.auth.token);
  const taskerInfo = useSelector((state) => state.auth.taskerDetails);
  const searchParams = new URLSearchParams(location.search);
  const taskerId = searchParams.get("user");

  const user = jwtDecode(accessToken);

  const [tasker_in, setTasker_in] = useState({
    tasker_id: "",
  });

  useEffect(() => {
    if (user) {
      setUser_in({ user_id: user.user_id, user_image: user.profile_photo });
    } else {
      console.log("User not found");
    }
  }, []);

  useEffect(() => {
    if (accessToken && taskerId) {
      dispatch(fetchTaskerDetails({ user_id: taskerId, token: accessToken }));
    }
  }, [dispatch, accessToken, taskerId]);

  if (!taskerInfo | Loding) {
    return (
      <div className="flex justify-center h-screen items-center ">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleReport = async () => {
    setLoding(true);
    try {
      const response = await axios.post(
        `${BASE_URL}account/report-worker/${taskerId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Report sent successfully.");
      setLoding(false);
    } catch (error) {
      console.error("Error reporting:", error);
      toast.error("Failed to send report.");
      setLoding(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mx-auto mt-24 px-4">
      <div className="md:w-2/3 space-y-4">
        <div className="bg-slate-800 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">About Me</h3>
          <p className="text-sm">
            {taskerInfo.full_name} is a much-driven {taskerInfo.task?.name} with
            a passion for leveraging innovative strategies to drive brand growth
            and customer engagement in the ever-evolving digital landscape.
            <br />
            Feel free to reach me out for any specific queries.
          </p>
        </div>

        <div className="bg-slate-800 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Contact Here</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center">
              <span className="mr-2">📞</span> {taskerInfo.phone_number}
            </p>
            <p className="flex items-center">
              <span className="mr-2">📍</span> {taskerInfo.address}
            </p>
          </div>
        </div>
      </div>

      <div className="md:w-1/3 space-y-4">
        <Link
          to={{
            pathname: `/chat/${taskerInfo.user.id}`,
            state: { user_in: user_in.user_id, tasker_in: tasker_in.tasker_id },
          }}
        >
          <button className="w-full bg-orange-400 text-white py-2 rounded-lg">
            Message
          </button>
        </Link>
        <button
          className="w-full bg-red-500 text-white py-2 rounded-lg"
          onClick={handleReport}
        >
          Report
        </button>
        <BookNow taskerId={taskerInfo.user.id} />
      </div>
    </div>
  );
};

export default Details;
