import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import EditUser from "./EditUser";
import { useSelector } from "react-redux";
import { B_URL, BASE_URL } from "../../redux/actions/authService";
import ConfirmModal from "../common/ConfirmModal";
import TaskerProfile from "./TaskerProfile ";
import Confirm_without_msg from "../common/Confirm_without_msg";

function Tasker_Listing() {
  const [usersInfo, setUsersInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTaskerId, setCurrentTaskerId] = useState(null);
  const [openTasker, setOpenTasker] = useState(false);
  const [selectedTasker, setSelectedTasker] = useState(null);

  const accessToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const handleRequest = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}adminside/blocking_tasker/`,
        { id: currentTaskerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);

      // Update the user's blocked status in the usersInfo state
      setUsersInfo((prevUsersInfo) =>
        prevUsersInfo.map((user) =>
          user.id === currentTaskerId
            ? { ...user, blocked_for_tasker: !user.blocked_for_tasker }
            : user
        )
      );

      setShowModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleModal = (id, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setCurrentTaskerId(id);
    setShowModal(true);
  };

  const handleTaskerClick = (tasker) => {
    setSelectedTasker(tasker);
    setOpenTasker(true);
  };

  const onClose = () => {
    setOpenTasker(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}adminside/tasker_listing/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUsersInfo(response.data);
      } catch (error) {
        alert(error.message);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  if (!usersInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <Confirm_without_msg
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleRequest}
        message="Are you sure you want to change your tasker status?"
        confirmText="Yes, I am sure"
      />
      {openTasker ? (
        <div className="relative ">
          <TaskerProfile
            onClose={onClose}
            openTasker={openTasker}
            tasker={selectedTasker}
          />
        </div>
      ) : (
        <div className="flex flex-col  items-center h-screen w-full mt-20 ms-36">
          <h1 className="text-purple-950 p-10 text-4xl font-bold">Tasker</h1>

          <table className="w-3/4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ml-6">
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
                  Status
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
                    onClick={() => handleTaskerClick(item)}
                  >
                    <td className="w-4 p-4">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={
                          item.profile_pic
                            ? `${B_URL}${item.profile_pic}`
                            : Unknown
                        }
                        alt="profile picture"
                      />
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
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            item.is_active ? "bg-green-500" : "bg-red-500"
                          } me-2`}
                        ></div>
                        <p>{item.is_active ? "Active" : "Inactive"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 flex flex-row">
                      {item.blocked_for_tasker ? (
                        <button
                          className="bg-red-300 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-red-600"
                          onClick={(e) => handleModal(item.id, e)}
                        >
                          UnblockTasker
                        </button>
                      ) : (
                        <button
                          className="bg-purple-400 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-red-600"
                          onClick={(e) => handleModal(item.id, e)}
                        >
                          BlockTasker
                        </button>
                      )}
                    </td>

                    {item.isEditing && (
                      <td>
                        <EditUser
                          id={item.id}
                          setUsersInfo={setUsersInfo}
                          item={item}
                        />
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Tasker_Listing;
