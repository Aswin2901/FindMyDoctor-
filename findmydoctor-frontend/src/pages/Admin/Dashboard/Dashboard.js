import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Footer from '../../../components/Footer/Footer';
import Navbar from '../../../components/Navbar/Navbar';

const Dashboard = () => {
    const [recentDoctors, setRecentDoctors] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [usersList, setUsersList] = useState([]);  // For users
    const [activeSection, setActiveSection] = useState('dashboard'); // To toggle between sections

    useEffect(() => {
        const fetchRecentDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:8000/doctors/recent/');
                setRecentDoctors(response.data);
            } catch (error) {
                console.error('Error fetching recent doctors:', error);
            }
        };
        fetchRecentDoctors();
    }, []);

    const fetchDoctorsList = async () => {
        try {
            const response = await axios.get('http://localhost:8000/doctors/all/');
            setDoctorsList(response.data);
        } catch (error) {
            console.error('Error fetching doctors list:', error);
        }
    };

    const fetchUsersList = async () => {
        try {
            const response = await axios.get('http://localhost:8000/accounts/all/');
            setUsersList(response.data);
        } catch (error) {
            console.error('Error fetching users list:', error);
        }
    };

    const handleMenuClick = (section) => {
        setActiveSection(section);
        if (section === 'doctors') {
            fetchDoctorsList();
        } else if (section === 'users') {
            fetchUsersList();
        }
    };

    const handleBlockUser = async (userId) => {
        try {
            await axios.post(`http://localhost:8000/users/block/${userId}/`);
            alert("User blocked");
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            await axios.post(`http://localhost:8000/users/unblock/${userId}/`);
            alert("User unblocked");
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    };

    const handleBlockDoctor = async (doctorId) => {
        try {
            await axios.post(`http://localhost:8000/doctors/block/${doctorId}/`);
            alert("Doctor blocked");
        } catch (error) {
            console.error('Error blocking doctor:', error);
        }
    };

    const handleReviewDoctor = async (doctorId) => {
        try {
            await axios.post(`http://localhost:8000/doctors/review/${doctorId}/`);
            alert("Doctor reviewed and verified");
        } catch (error) {
            console.error('Error reviewing doctor:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <Navbar />

            <div className="dashboard-main">
                <aside className="sidebar">
                    <div className="menu-title">Primary Menu</div>
                    <ul className="menu-list">
                        <li className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`} 
                            onClick={() => handleMenuClick('dashboard')}>
                            Dashboard
                        </li>
                        <li className="menu-item">Appointment Management</li>
                        <li className={`menu-item ${activeSection === 'doctors' ? 'active' : ''}`} 
                            onClick={() => handleMenuClick('doctors')}>
                            Doctors
                        </li>
                        <li className={`menu-item ${activeSection === 'users' ? 'active' : ''}`} 
                            onClick={() => handleMenuClick('users')}>
                            Users
                        </li>
                        <li className="menu-item logout">Logout</li>
                    </ul>
                </aside>

                <section className="dashboard-content">
                    {/* Dashboard view */}
                    {activeSection === 'dashboard' && (
                        <>
                            <div className="categories">
                                <div className="category-card">
                                    <h3>17</h3>
                                    <p>New Appointment</p>
                                </div>
                                <div className="category-card">
                                    <h3>176</h3>
                                    <p>Total Appointment</p>
                                </div>
                                <div className="category-card">
                                    <h3>300</h3>
                                    <p>Total Users</p>
                                </div>
                                <div className="category-card">
                                    <h3>20</h3>
                                    <p>Total Doctors</p>
                                </div>
                            </div>

                            <div className="new-doctors">
                                <h4>New Doctors</h4>
                                {recentDoctors.map((doctor, index) => (
                                    <div className="doctor-card" key={index}>
                                        <div className="doctor-info">
                                            {doctor.profile_picture ? (
                                                <img src={doctor.profile_picture} alt={`${doctor.full_name}'s Profile`} className="doctor-profile-picture" />
                                            ) : (
                                                <img src="/path/to/default-doctor-icon.png" alt="Default Doctor Icon" className="doctor-profile-picture" />
                                            )}
                                            <h5>{doctor.full_name}</h5>
                                            <p>{doctor.email}</p>
                                            <p>{doctor.phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Doctors List View */}
                    {activeSection === 'doctors' && (
                        <div className="doctors-list">
                            <h4>Doctors List</h4>
                            {doctorsList.map((doctor) => (
                                <div className="doctor-card" key={doctor.id}>
                                    <div className="doctor-info">
                                        <img src={doctor.profile_picture || '/path/to/default-doctor-icon.png'} 
                                             alt={`${doctor.full_name}'s Profile`} 
                                             className="doctor-profile-picture" />
                                        <div>
                                            <h5>{doctor.full_name}</h5>
                                            <p>{doctor.email}</p>
                                            <p>{doctor.phone}</p>
                                            <p>{doctor.state}</p>
                                        </div>
                                    </div>
                                    <div className="doctor-actions">
                                        <button className="btn-block" onClick={() => handleBlockDoctor(doctor.id)}>Block</button>
                                        <button className="btn-review" onClick={() => handleReviewDoctor(doctor.id)}>Review & Verify</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Users List View */}
                    {activeSection === 'users' && (
                        <div className="users-list">
                            <h4>Users List</h4>
                            {usersList.map((user) => (
                                <div className="user-card" key={user.id}>
                                    <div className="user-info">
                                        <div>
                                            <h5>{user.full_name}</h5>
                                            <p>{user.email}</p>
                                            <p>{user.phone}</p>
                                            <p>{user.state}</p>
                                        </div>
                                    </div>
                                    <div className="user-actions">
                                        {user.is_active ? (
                                            <button className="btn-block" onClick={() => handleBlockUser(user.id)}>Block</button>
                                        ) : (
                                            <button className="btn-unblock" onClick={() => handleUnblockUser(user.id)}>Unblock</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
