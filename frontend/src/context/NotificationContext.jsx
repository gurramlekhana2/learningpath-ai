import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Trending Skill Surge Detected',
      message: 'Firecrawl crawler identified a 140% surge in enterprise demand for "RAG Architecture & Evaluators".',
      type: 'market_trend',
      unread: true,
      timestamp: '15m ago',
      actionUrl: '/industry'
    },
    {
      id: 'notif-2',
      title: 'Skill Obsolescence Alert',
      message: 'Legacy monolithic ETL and MapReduce hiring demand declined by 38%. Consider switching to Modern Data Lakehouses.',
      type: 'obsolescence',
      unread: true,
      timestamp: '2h ago',
      actionUrl: '/skills'
    },
    {
      id: 'notif-3',
      title: 'Memento Milestone Logged',
      message: 'Your practical completion of the Vector DB index project has been committed to persistent memory.',
      type: 'achievement',
      unread: false,
      timestamp: '1d ago',
      actionUrl: '/memory'
    },
    {
      id: 'notif-4',
      title: 'Roadmap Evolution Available',
      message: 'New verified certifications are available for AWS Machine Learning Specialty. Your roadmap can be evolved.',
      type: 'roadmap',
      unread: false,
      timestamp: '2d ago',
      actionUrl: '/roadmap'
    }
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const addNotification = (notif) => {
    const newEntry = {
      id: `notif-${Date.now()}`,
      unread: true,
      timestamp: 'Just now',
      ...notif,
    };
    setNotifications((prev) => [newEntry, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
