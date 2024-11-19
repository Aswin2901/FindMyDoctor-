import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../Images/icon.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const isAuthenticated = auth.auth.is_authenticated;
    const user = auth.auth.user;

    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications
    useEffect(() => {
        if (isAuthenticated && user) {
            const fetchNotifications = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:8000/accounts/get-notification/${user.id}/`
                    );
                    setNotifications(response.data);
                    setUnreadCount(response.data.filter((notif) => !notif.is_read).length);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };
            fetchNotifications();
        }
    }, [isAuthenticated, user]);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.patch(`http://localhost:8000/accounts/mark-as-read/${notificationId}/`);
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === notificationId ? { ...notif, is_read: true } : notif
                )
            );
            setUnreadCount((prevCount) => prevCount - 1);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Find My Doctor Logo" />
                <span>
                    FIND <span className="highlight">MY</span> DOCTOR
                </span>
            </div>
            <ul className="navbar-links">
                <li>
                    <button onClick={() => handleNavigate('/home')}>HOME</button>
                </li>
                <li>
                    <button onClick={() => handleNavigate('/service')}>SERVICE</button>
                </li>
            </ul>
            {isAuthenticated && (
                <div className="navbar-notification">
                <div
                    className="notification-button"
                    onClick={toggleDropdown}
                >
                    <i className="fa fa-bell"></i>
                    {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount}</span>
                    )}
                </div>
                {isDropdownOpen && (
                    <div className="notification-dropdown">
                        {notifications.filter((notif) => !notif.is_read).length > 0 ? (
                            notifications
                                .filter((notif) => !notif.is_read) // Filter out read notifications
                                .map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="notification-item unread"
                                    >
                                        <p>
                                            <strong>{notif.notification_type}</strong>
                                        </p>
                                        <p>{notif.message}</p>
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
                            <button onClick={() => handleNavigate('/notification')}>
                                View All
                            </button>
                        </div>
                    </div>
                )}
            </div>
            )}
            <div className="navbar-user-icon">
                {isAuthenticated ? (
                    <button onClick={() => handleNavigate('/profile')}>
                        <i className="fa fa-user"></i>
                    </button>
                ) : (
                    <button onClick={() => handleNavigate('/')}>Login</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
