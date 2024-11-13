import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';
import doctorImage from '../../../Images/doctor-1.jpg';
import Footer from '../../../components/Footer/Footer';
import DoctorNav from '../DoctorNav/DoctorNav';

function DoctorDashboard() {
    const [isVerified, setIsVerified] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate();
    const doctorId = localStorage.getItem('doctor_id');

    useEffect(() => {
        async function checkVerification() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/doctors/verification/${doctorId}/`);
                console.log('is_verified' , response.data.is_verified)
                console.log('form ' , response.data.form_submitted)
                setIsVerified(response.data.is_verified);
                setFormSubmitted(response.data.form_submitted);
            } catch (error) {
                console.error('Error checking verification:', error);
            }
        }
        checkVerification();
    }, [doctorId]);

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
        <div className='content-body'>
            <DoctorNav/>
            <br/>
        
            <div className="doctor-dashboard">
                <aside className="dashboard-sidebar">
                    <ul className="sidebar-menu">
                        <li className="menu-item active">Dashboard</li>
                        <li className="menu-item">Appointment Management</li>
                        <li className="menu-item">Appointment History</li>
                        <li className="menu-item">Notifications</li>
                        <li className="menu-item">Time-Slot Management</li>
                        <li className="menu-item">Profile</li>
                        <li className="menu-item">Verification</li>
                        <li className="menu-item logout">Logout</li>
                    </ul>
                </aside>

                <main className="dashboard-main-content">
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
                                {/* Repeat similar blocks for other appointments */}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <br/>
            <Footer/>
        </div>
    );
}

export default DoctorDashboard;
