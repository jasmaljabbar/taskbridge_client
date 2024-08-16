import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import { useSelector } from "react-redux";
import { B_URL, BASE_URL } from "../../redux/actions/authService";
import toast from "react-hot-toast";
import Confirm_without_msg from "../common/Confirm_without_msg";
import TaskerProfile from "./TaskerProfile ";

const UserTasker_request = () => {
  const [usersInfo, setUsersInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTaskerId, setCurrentTaskerId] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [openTasker, setOpenTasker] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});
  const [selectedTasker, setSelectedTasker] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const handleRequest = async () => {
    if (!currentTaskerId) {
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}adminside/accepting_request/`,
        { id: currentTaskerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Requested successfully");
      setUsersInfo((prevUsersInfo) =>
        prevUsersInfo.map((user) =>
          user.id === currentTaskerId
            ? { ...user, requested_to_tasker: false }
            : user
        )
      );
      setShowModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUserAction = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}adminside/user_action/`,
        { id: currentTaskerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setUsersInfo((prevUsersInfo) =>
        prevUsersInfo.map((user) =>
          user.id === currentTaskerId
            ? { ...user, is_active: !user.is_active }
            : user
        )
      );
      setShowModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleTaskerClick = (tasker) => {
    setSelectedTasker(tasker);
    setOpenTasker(true);
  };

  const handleModal = (id, message, action) => {
    setCurrentTaskerId(id);
    setModalMessage(message);
    setConfirmAction(() => action);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${BASE_URL}adminside/tasker_request/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUsersInfo(response.data);
        setLoading(false)
        console.log("Fetched users:", response.data);
      } catch (error) {
        alert(error.message);
        setLoading(false)
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (usersInfo.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No requests found</p>
      </div>
    );
  }

  return (
    <div className="w-full ms-28 flex justify-center">
      <Confirm_without_msg
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmAction}
        message={modalMessage}
        confirmText="Yes, I am sure"
      />
      {openTasker ? (
        <div className="relative ">
          <TaskerProfile
            onClose={() => setOpenTasker(false)}
            openTasker={openTasker}
            tasker={selectedTasker}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center h-screen w-full mt-24 ms-40 p-6">
          <h1 className="text-purple-950 p-10 text-4xl font-bold">Requests to become a Tasker</h1>

          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ml-6">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Display Picture
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(usersInfo) &&
                usersInfo.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() =>
                      item.requested_to_tasker ? handleTaskerClick(item) : null
                    }
                  >
                    <td className="w-4 p-4">
                      {item.profile_pic ? (
                        <img
                          className="w-10 h-10 rounded-full"
                          src={`${B_URL}${item.profile_pic}`}
                          alt="profile picture"
                        />
                      ) : (
                        <img
                          className="w-10 h-10 rounded-full"
                          src={Unknown}
                          alt="profile picture"
                        />
                      )}
                    </td>

                    <td
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {item.name}
                        </div>
                        <div className="font-normal text-gray-500">
                          {item.email}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>{item.is_staff ? <p>Tasker</p> : <p>User</p>}</div>
                    </td>

                    <td className="px-6 py-4 flex flex-row">
                      {item.requested_to_tasker ? (
                        <button
                          className="bg-blue-500 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentTaskerId(item.id);
                            handleModal(
                              item.id,
                              "Are you sure you want to confirm this request?",
                              handleRequest
                            );
                          }}
                        >
                          AcceptRequest
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTasker_request;
