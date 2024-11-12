import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NotificationPage.css';
import { useSelector } from 'react-redux';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';

const NotificationPage = () => {
    const userId = useSelector((state) => state.auth.user?.id)
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/accounts/get-notification/${userId}/`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:8000/notifications/mark-as-read/${notificationId}/`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div>
        <Navbar/>
    
        <div className="notification-page">
        <h2>Notifications</h2>
        <div className="notification-list">
            {notifications.map((notif) => (
            <div
                key={notif.id}
                className={`notification-card ${notif.is_read ? 'read' : ''}`}
            >
                <p><strong>{notif.notification_type === 'new' ? 'New Appointment Scheduled!' : notif.notification_type === 'cancelled' ? 'Appointment Cancelled!' : 'Appointment Rescheduled!'}</strong></p>
                <p>{notif.message}</p>
                <p><strong>Doctor:</strong> {notif.doctor_name}</p>
                {!notif.is_read && (
                <button
                    onClick={() => markAsRead(notif.id)}
                    className="mark-as-read-btn"
                >
                    Mark as Read
                </button>
                )}
            </div>
            ))}
        </div>
        </div><br/><br/><br/><br/><br/>
        <Footer/>
    </div>
  );
};

export default NotificationPage;