import React, { createContext, useState, useContext } from 'react';
import NotificationComponent from './NotificationComponent';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ senderId: null, receiverId: null, message: '' });

  const sendNotification = (senderId, receiverId, message) => {
    setNotification({ senderId, receiverId, message });
  };

  return (
    <NotificationContext.Provider value={{ sendNotification }}>
      {children}
      <NotificationComponent 
        senderId={notification.senderId}
        receiverId={notification.receiverId}
        message={notification.message}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);