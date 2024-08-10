import React, { useEffect, useState, useCallback } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../redux/actions/authService";

function NotificationComponent({ senderId, receiverId, message }) {
  const [client, setClient] = useState(null);

  const setupWebSocket = useCallback(() => {
    if (senderId && receiverId) {
      console.log("Setting up WebSocket with:", senderId, receiverId);
      const newClient = new W3CWebSocket(
        `ws://taskbridge.duckdns.org/ws/notifications/${senderId}/${receiverId}/`
      );


      newClient.onopen = () => {
        console.log("WebSocket Client Connected");
      };

      newClient.onmessage = (message) => {
        const data = JSON.parse(message.data);
        toast.success(data.message);
      };

      newClient.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      setClient(newClient);

      return newClient;
    }
    return null;
  }, [senderId, receiverId]);

  useEffect(() => {
    const newClient = setupWebSocket();

    // Cleanup on component unmount
    return () => {
      if (newClient) {
        newClient.close();
      }
    };
  }, [setupWebSocket]);

  useEffect(() => {
    if (client && client.readyState === W3CWebSocket.OPEN && message) {
      sendNotification(message);
    }
  }, [client, message]);

  const sendNotification = (notificationMessage) => {
    if (client && client.readyState === W3CWebSocket.OPEN) {
      const notification = {
        sender: senderId,
        receiver: receiverId,
        message: notificationMessage,
      };
      client.send(JSON.stringify(notification));
    } else {
      console.error("WebSocket is not open. Notification not sent.");
    }
  };

  return null; // This component doesn't render anything
}

export default NotificationComponent;
