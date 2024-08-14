import React, { useEffect, useState, useReducer, useRef } from "react";
import { json, useLocation, useNavigate } from "react-router-dom";
import useAxios from "../../../../AxiosConfig/Axios";
import Swal from "sweetalert2";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { B_URL, BASE_URL } from "../../../../redux/actions/authService";
import Unknown from "../../../../statics/user_side/Unknown.jpg";
import axios from "axios";
import ImageUpload from "../../../common/ImageUpload"


function OneOneChat() {
  const navigate = useNavigate();
  const [emoji, setEmoji] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users_taskerside, setUser_tasekerside] = useState(null);
  const [employee, setEmployee] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedImage_url, setSelectedImage_url] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const accessToken = useSelector((state) => state.auth.token);
  const axiosInstance = useAxios();
  const messageRef = useRef();
  const taskerInfo = useSelector((state) => state.auth.taskerDetails);
  const user_profile = useSelector((state) => state.auth.token);
  const user_info = jwtDecode(user_profile);
  const lastMessageRef = useRef(null);
  const { id } = useParams();



  const currentUsers = localStorage.getItem("userDetails");
  const Employee = JSON.parse(currentUsers);
  let employeeId;
  let userId;
  let sender;
  let receiver;
  let currentUser;
  
  if (user_info) {
    if (user_info.is_staff === false) {
      employeeId = taskerInfo.user.id;
      userId = user_info.user_id;
      sender = parseInt(user_info.user_id);
      receiver = parseInt(taskerInfo.user.id);
      currentUser = parseInt(user_info.user_id);
    } else if (user_info.is_staff === true) {
      userId = parseInt(id);
      employeeId = parseInt(user_info.user_id);
      sender = employeeId;
      receiver = userId;
      currentUser = employeeId;
    }
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: "error",
      title: "Please Login",
    });
  }

  const markMessageAsRead = (messageId) => {
    if (client.readyState === W3CWebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "mark_as_read",
          message_id: messageId,
        })
      );
    } else {
      console.error("WebSocket not open. Message not marked as read.");
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    GetUser();
    GetEmployee();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user_info.is_staff) {
        try {
          const response = await axios.get(
            `${BASE_URL}dashboard/UserProfileDetailView/${id}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setUser_tasekerside(response.data);

          return response.data;
        } catch (error) {
          console.error(error.response ? error.response.data : error);
        }
      }
    };

    fetchData();
  }, [user_info.is_staff, id, accessToken]);
  const GetUser = async () => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}dashboard/employeeindividualPermission/${employeeId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setEmployee(response.data);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);

      // Handle the error appropriately, e.g., show a user-friendly message
    }
  };

  const GetEmployee = async () => {
    const response = await axiosInstance.get(
      `${BASE_URL}account/api/userindivual/${userId}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = await ImageUpload(file);
      setSelectedImage_url(imageUrl);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage_url) {
      toast.error("Cannot be empty");
      return false;
    }
  
    try {
      const formData = new FormData();
      formData.append("message", message);
      if (selectedImage_url) {
        formData.append("image_url", selectedImage_url);
      }
      formData.append("sender", sender.toString());  
    formData.append("receiver", receiver.toString()); 
  
      const response = await axiosInstance.post(
        `${BASE_URL}api/chat/send_message/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      const newMessage = response.data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      setSelectedImage_url(null);
      setImagePreviewUrl(null);
      setEmoji(false);
  
      // Send WebSocket message
      if (client.readyState === W3CWebSocket.OPEN) {
        client.send(JSON.stringify({
          message: newMessage.message,
          image_url: selectedImage_url,
          sender: { id: sender },
          receiver: { id: receiver }
        }));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const client = new W3CWebSocket(
    `wss://taskbridge.duckdns.org/ws/chat/${sender}_${receiver}/`
  );

  useEffect(() => {
    GetMessage();
  }, [sender, receiver]);

  const GetMessage = async () => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}api/chat/message/${sender}/${receiver}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Use a Set to ensure unique messages
      const uniqueMessages = Array.from(
        new Set(response.data.map((m) => m.id))
      ).map((id) => response.data.find((m) => m.id === id));
      setMessages(uniqueMessages);

      uniqueMessages.forEach((message) => {
        if (!message.is_read && message.sender.id !== currentUser) {
          markMessageAsRead(message.id);
        }
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    client.onopen = () => {
      console.log("websocket client connected");
    };

    client.onerror = (error) => {
      console.error("WebSocket error:", error.message);
      console.error("WebSocket error:", error.message);
    };
    client.onclose = () => {
      console.log("WebSocket client disconnected");
    };
    return () => {
      client.close();
    };
  }, [sender, receiver]);

  useEffect(() => {
    client.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    client.onclose = (event) => {
      if (event.wasClean) {
        console.log(
          `Closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.warn("Connection died");
      }
    };
  }, []);

  useEffect(() => {
    client.onmessage = (event) => {
      try {
        const dataFromServer = JSON.parse(event.data);
        if (dataFromServer && dataFromServer.messages) {
          setMessages(dataFromServer.messages);
        } else if (dataFromServer && (dataFromServer.message || dataFromServer.image_url)) {
          const newMessage = {
            id: dataFromServer.id || Date.now(),
            message: dataFromServer.message,
            image_url: dataFromServer.image_url,
            sender: dataFromServer.sender ? { id: dataFromServer.sender.id } : {},
            receiver: dataFromServer.receiver ? { id: dataFromServer.receiver.id } : {},
            date: dataFromServer.date || new Date().toISOString(),
            is_read: dataFromServer.is_read || false,
          };
  
          setMessages((prevMessages) => {
            if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
              if (newMessage.sender.id !== currentUser) {
                markMessageAsRead(newMessage.id);
              }
              return [...prevMessages, newMessage];
            }
            return prevMessages;
          });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
  }, [currentUser]);

  const handleEmoji = () => {
    setEmoji(true);
  };

  const handleInputEmoji = (emoji) => {
    const emojiChar = emoji.emoji;
    setMessage((prvs) => prvs + emojiChar);
  };

  const handleCancel = () => {
    setEmoji(false);
  };

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-[80%] mt- antialiased text-gray-800 ">
        <div className="flex flex-row h- w-[80%] overflow-x-hidden">
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0  rounded-2xl bg-white shadow-lg h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto hide-scrollbar mb-4">
                {messages && messages.length > 0 ? (
                  <div className="flex flex-col   h-full">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        ref={
                          index === messages.length - 1 ? lastMessageRef : null
                        }
                        className={`col-start-${
                          message.sender.id === currentUser ? "6" : "1"
                        } col-end-${
                          message.sender.id === currentUser ? "13" : "8"
                        } p-3 rounded-lg`}
                      >
                        <div
                          className={`flex flex-row items-center ${
                            message.sender.id === currentUser
                              ? "justify-start flex-row-reverse"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`relative ml-3 text-sm bg-${
                              message.sender.id === currentUser
                                ? "indigo-100"
                                : "white"
                            } py-2 px-4 shadow rounded-xl`}
                          >
                            {message.message && (
                              <div className="w-35 truncate">{message.message}</div>
                            )}
                            {message.image_url && (
                              <img
                                src={message.image_url}
                                alt="Sent image"
                                className="max-w-xs max-h-64 object-contain mt-2"
                              />
                            )}
                            <span className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                              {moment(message.date).format("LT")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-center items-center text-gray-500">
                    No messages yet
                  </div>
                )}
              </div>
              {emoji && (
                <div className="flex justify-center">
                  <EmojiPicker onEmojiClick={handleInputEmoji} />
                  <button className="mt-2 text-red-500" onClick={handleCancel}>
                    X
                  </button>
                </div>
              )}
              <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                <div>
                  <button
                    className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                    onClick={handleEmoji}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      ref={fileInputRef}
                    />
                    <button
                      className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex-grow ml-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      ref={messageRef}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleMessage(e);
                        }
                      }}
                    />
                    {imagePreviewUrl && (
                      <div className="mt-2">
                        <img
                          src={imagePreviewUrl}
                          alt="Selected"
                          className="max-h-20 rounded"
                        />
                        <button
                          onClick={() => {
                            setSelectedImage_url(null);
                            setImagePreviewUrl(null);
                          }}
                          className="text-red-500 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl px-4 py-1"
                    onClick={handleMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default OneOneChat;
