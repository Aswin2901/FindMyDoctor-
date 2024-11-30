import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';
import doctorImage from '../../../Images/doctor-1.jpg';
import Footer from '../../../components/Footer/Footer';
import DoctorNav from '../DoctorNav/DoctorNav';
import DoctorNotificationPage from '../DoctorNotification/DoctorNotificationPage'
import { useAuth } from '../../../contexts/AuthContext';
import AppointmentManagement from '../AppointmentManagement/AppointmentManagement'; 
import AppointmentHistory from '../AppointmentHistory/AppointmentHistory';

function DoctorDashboard() {
    const [isVerified, setIsVerified] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard'); // Track active menu
    const navigate = useNavigate();
    const auth = useAuth();
    const [ doctorId , setdoctorId ] = useState(null)



    useEffect(() => {
        setdoctorId(auth.auth.user.id);
        async function checkVerification() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/doctors/verification/${doctorId}/`);
                setIsVerified(response.data.is_verified);
                setFormSubmitted(response.data.form_submitted);
            } catch (error) {
                console.error('Error checking verification:', error);
            }
        }
        checkVerification();
    }, [doctorId]);

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to log out?');
        if (confirmLogout) {
            localStorage.clear(); 
            navigate('/'); 
        }
    };

    if (isVerified === null) {
        return <p>Loading...</p>;
    }

    if (!formSubmitted) {
        return (
            <div className="verification-message">
                <h2>Please complete your profile verification</h2>
                <button className="verification-button" onClick={() => navigate('/profilevarification')}>
                    Go to Verification
                </button>
            </div>
        );
    }

    if (!isVerified) {
        return (
            <div className="verification-message">
                <h2>Verification Pending</h2>
                <p>Your verification is under review. You will be notified once it is approved.</p>
            </div>
        );
    }

    return (
        <div className="content-body">
            <DoctorNav />
            <div className="doctor-dashboard">
                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <ul className="sidebar-menu">
                        <li 
                            className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`} 
                            onClick={() => setActiveMenu('dashboard')}
                        >
                            Dashboard
                        </li>
                        <li 
                            className={`menu-item ${activeMenu === 'appointmentManagement' ? 'active' : ''}`} 
                            onClick={() => setActiveMenu('appointmentManagement')}
                        >
                            Slot Management
                        </li>
                        <li 
                            className={`menu-item ${activeMenu === 'notifications' ? 'active' : ''}`} 
                            onClick={() => setActiveMenu('notifications')}
                        >
                            Notifications
                        </li>
                        <li 
                            className={`menu-item ${activeMenu === 'appointmentHistory' ? 'active' : ''}`} 
                            onClick={() => setActiveMenu('appointmentHistory')}
                        >
                            Appointment History
                        </li>
                        <li className="menu-item">Time-Slot Management</li>
                        <li className="menu-item">Profile</li>
                        <li className="menu-item">Verification</li>
                        <li className="menu-item logout"  onClick={handleLogout}>Logout</li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="dashboard-main-content">
                    {activeMenu === 'dashboard' && (
                        <div>
                            <header className="dashboard-header">
                                <div className="welcome-section">
                                    <h1>Welcome to Find My Doctor</h1>
                                    <p>We are committed to delivering exceptional care and making a difference in the lives of our patients. We’re excited to have you on board!</p>
                                </div>
                                <img src={doctorImage} alt="Doctor Profile" className="doctor-profile-image" />
                            </header>

                            <div className="dashboard-content">
                                <div className="categories">
                                    <div className="category-card">New Appointment</div>
                                    <div className="category-card">Total Appointment</div>
                                </div>

                                <div className="appointments-section">
                                    <div className="calendar">
                                        <h4>Calendar</h4>
                                        <p>[Calendar Component]</p>
                                    </div>
                                    <div className="my-appointments">
                                        <h4>My Appointments</h4>
                                        <div className="appointment-card">
                                            <p>Patient: Aravind Gopal</p>
                                            <p>Date: 29/01/2024</p>
                                            <p>Time: 10:30</p>
                                            <p>Status: Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeMenu === 'appointmentManagement' && <AppointmentManagement />}
                    {activeMenu === 'notifications' && <DoctorNotificationPage/> }
                    {activeMenu === 'appointmentHistory' && <AppointmentHistory doctorId={doctorId} />}
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default DoctorDashboard;
