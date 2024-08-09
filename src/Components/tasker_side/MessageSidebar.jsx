import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/actions/authService";
import { useSelector } from "react-redux";
import Unknown from "../../statics/user_side/Unknown.jpg";
import { useNavigate, useLocation } from "react-router-dom";

function MessageSidebar({ children }) {
  const [taskerId, setTaskerId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadMessageCounts, setUnreadMessageCounts] = useState({});
  const [activeChatUser, setActiveChatUser] = useState(null);
  const accessToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedTaskerId = localStorage.getItem("user");
    const user = JSON.parse(storedTaskerId);
    setTaskerId(user.user_id);
    fetchUsers(user.user_id);
  }, []);

  useEffect(() => {
    // Check if the current path matches the chat URL pattern
    const match = location.pathname.match(/\/tasker\/chat\/(\d+)/);
    if (match) {
      const userId = parseInt(match[1]);
      setUnreadMessageCounts((prevCounts) => ({
        ...prevCounts,
        [userId]: 0,
      }));
      const activeUser = users.find((user) => user.id === userId);
      setActiveChatUser(activeUser);
    } else {
      setActiveChatUser(null);
    }
  }, [location, users]);

  const fetchUsers = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}api/chat/users-chat-with-tasker/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUsers(response.data);
      setIsLoading(false);
      const initialCounts = {};
      response.data.forEach((user) => {
        initialCounts[user.id] = user.unread_message_count;
      });
      setUnreadMessageCounts(initialCounts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserClick = (userId) => {
    setUnreadMessageCounts((prevCounts) => ({
      ...prevCounts,
      [userId]: 0,
    }));
    const activeUser = users.find((user) => user.id === userId);
    setActiveChatUser(activeUser);
    navigate(`/tasker/chat/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="w-full md:w-80 bg-gray-900 text-white h-full overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className="p-2 hover:bg-gray-700 rounded-md border-b border-gray-600"
              >
                <div
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center py-2.5 px-4 rounded cursor-pointer hover:bg-gray-700"
                >
                  {user.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <img
                      src={Unknown}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="w-full flex justify-between">
                    <span className="ml-3">
                      {user.name} {user.last_name}
                    </span>
                    {unreadMessageCounts[user.id] > 0 && (
                      <span className="bg-blue-400 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {unreadMessageCounts[user.id]}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex-grow bg-gray-800 text-white h-full p-4">
        {activeChatUser ? (
          <>
            <div className="flex items-center mb-4">
              {activeChatUser.profile_pic ? (
                <img
                  src={activeChatUser.profile_pic}
                  alt={activeChatUser.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <img
                  src={Unknown}
                  alt={activeChatUser.name}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div className="ml-4">
                <h2 className="text-xl font-bold">
                  Chat with {activeChatUser.name}
                </h2>
                <p>
                  {activeChatUser.name} {activeChatUser.last_name}
                </p>
                <p>{activeChatUser.email}</p>
              </div>
            </div>
            <div className="chat-content h-full">{children}</div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageSidebar;
