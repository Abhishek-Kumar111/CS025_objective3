import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

const NotificationContext = createContext();

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  socket: null
};

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload, loading: false };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif._id === action.payload ? { ...notif, isRead: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => ({ ...notif, isRead: true })),
        unreadCount: 0
      };
    case 'SET_UNREAD_COUNT':
      return { ...state, unreadCount: action.payload };
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [], unreadCount: 0 };
    default:
      return state;
  }
};

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user, token } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (user && token) {
      const socket = io('http://localhost:5000', {
        auth: {
          token: token
        }
      });

      socket.on('connect', () => {
        console.log('Connected to notification server');
        dispatch({ type: 'SET_SOCKET', payload: socket });
      });

      socket.on('new-notification', (notification) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico'
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from notification server');
      });

      return () => {
        socket.disconnect();
        dispatch({ type: 'SET_SOCKET', payload: null });
      };
    } else {
      dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    }
  }, [user, token]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Load notifications on user login
  useEffect(() => {
    if (user && token) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [user, token]);

  // Load notifications function
  const loadNotifications = async (page = 1, limit = 20) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`http://localhost:5000/api/notifications?page=${page}&limit=${limit}`);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: response.data.notifications });
    } catch (error) {
      console.error('Error loading notifications:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications/unread-count');
      dispatch({ type: 'SET_UNREAD_COUNT', payload: response.data.count });
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/notifications/mark-all-read');
      dispatch({ type: 'MARK_ALL_READ' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Send notification (admin only)
  const sendNotification = async (notificationData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/notifications', notificationData);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send notification';
      return { success: false, error: message };
    }
  };

  // Send class notification (admin only)
  const sendClassNotification = async (classId, notificationData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/notifications/class/${classId}`, notificationData);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send class notification';
      return { success: false, error: message };
    }
  };

  const value = {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    loading: state.loading,
    socket: state.socket,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    sendNotification,
    sendClassNotification,
    loadUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};