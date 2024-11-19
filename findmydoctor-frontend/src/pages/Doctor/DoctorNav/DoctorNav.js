import React, { useState, useEffect } from 'react';
import './DoctorNav.css';
import logo from '../../../Images/icon.svg';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorNav = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const auth = useAuth()
    const doctorId = auth.auth.user.id
    const navigate = useNavigate()

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/doctors/get-notifications/${doctorId}`); // Adjust URL as needed
                const doctorNotifications = response.data.filter(
                    (notif) => notif.doctor_is_read === false
                );
                const unreadNotifications = response.data.filter(
                    (notif) => notif.doctor_is_read === false
                );

                setNotifications(unreadNotifications);
                setUnreadCount(unreadNotifications.length);
                
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.patch(
                `http://localhost:8000/doctors/mark-as-read/${notificationId}/`
            );
            setNotifications((prev) =>
                prev.filter((notif) => notif.id !== notificationId)
            );
            setUnreadCount((prev) => prev - 1);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Find My Doctor Logo" />
                <span>FIND <span className="highlight">MY</span> DOCTOR</span>
            </div>
            <div className="navbar-notification">
                <div className="notification-button" onClick={toggleDropdown}>
                    <i className="fa fa-bell"></i>
                    {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount}</span>
                    )}
                </div>
                {isDropdownOpen && (
                    <div className="notification-dropdown">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className="notification-item unread"
                                >
                                    <p>
                                        <strong>{notif.type}</strong>
                                    </p>
                                    <p>{notif.doctor_message}</p>
                                    <button
                                        className="mark-read-btn"
                                        onClick={() => handleMarkAsRead(notif.id)}
                                    >
                                        Mark as Read
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="no-notifications">No new notifications</p>
                        )}
                        <div className="view-all">
                            <button onClick={() => navigate('/doctor/notification') }>
                                View All
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default DoctorNav;
