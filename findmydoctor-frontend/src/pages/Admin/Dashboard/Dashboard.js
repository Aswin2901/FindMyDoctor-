import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; 
import Footer from '../../../components/Footer/Footer';
import Navbar from '../../../components/Navbar/Navbar';
import ProfileIcon from '../../../Images/profile-icon.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect

const Dashboard = () => {
    const [recentDoctors, setRecentDoctors] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate function

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
        setSelectedDoctor(null);
        setErrorMessage('');
        if (section === 'doctors') {
            fetchDoctorsList();
        } else if (section === 'users') {
            fetchUsersList();
        }
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to log out?');
        if (confirmLogout) {
            localStorage.clear(); // Clear any stored user data
            navigate('/'); // Redirect to the login page
        }
    };

    // Placeholder function for handling review of a doctor
    const handleReviewDoctor = (doctorId) => {
        console.log("Reviewing doctor with ID:", doctorId);
        // Set selected doctor for further details
        const doctor = doctorsList.find(d => d.id === doctorId);
        setSelectedDoctor(doctor);
    };

    // Placeholder function for handling verification of a doctor
    const handleVerifyDoctor = () => {
        console.log("Verifying doctor:", selectedDoctor);
        // Logic to verify the doctor (e.g., send a request to backend to mark as verified)
        setErrorMessage('Doctor has been verified successfully.');
        setSelectedDoctor(null); // Clear selection after verification
    };

    // Placeholder function for canceling verification of a doctor
    const handleCancelVerification = () => {
        console.log("Canceled verification for doctor:", selectedDoctor);
        setSelectedDoctor(null); // Clear selection
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
                        <li className="menu-item logout" onClick={handleLogout}>Logout</li>
                    </ul>
                </aside>

                <section className="dashboard-content">
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
                                            <img src={doctor.profile_picture || ProfileIcon } 
                                                 alt={`${doctor.full_name}'s Profile`} 
                                                 className="doctor-profile-picture" />
                                            <h5>{doctor.full_name}</h5>
                                            <p>{doctor.email}</p>
                                            <p>{doctor.phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeSection === 'doctors' && !selectedDoctor && (
                        <div className="doctors-list">
                            <h4>Doctors List</h4><br/>
                            {doctorsList.map((doctor) => (
                                <div className="doctor-card" key={doctor.id}>
                                    <div className="doctor-info">
                                        <img src={doctor.profile_picture || ProfileIcon } 
                                             alt={`${doctor.full_name}'s Profile`} 
                                             className="doctor-profile-picture" />
                                        <div>
                                            <h3>{doctor.full_name}</h3><br/>
                                            <p>{doctor.email}</p>
                                        </div>
                                        <div>
                                            <p>{doctor.phone}</p><br/>
                                            <p>{doctor.state}</p>
                                        </div>
                                        
                                        {doctor.is_verified ? (
                                            <div className='Isverified'>
                                                <p style={ {color: 'green'} }>Verified</p>
                                            </div>
                                        ) : (
                                            <div className='Isverified'>
                                                <p style={ {color: 'red'} }>Not Verified</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="doctor-actions">
                                        <button className="btn-review" onClick={() => handleReviewDoctor(doctor.id)}>
                                            Review & Verify
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="error-message">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    {selectedDoctor && (
                        <div className="verification-details">
                            <h4>Verification Details for {selectedDoctor.full_name}</h4>
                            <p>Email: {selectedDoctor.email}</p>
                            <p>Phone: {selectedDoctor.phone}</p>
                            <p>Qualification: {selectedDoctor.qualification}</p>
                            <p>Specialty: {selectedDoctor.specialty}</p>
                            <p>Experience: {selectedDoctor.experience} years</p>
                            <p>Hospital: {selectedDoctor.hospital}</p>
                            <p>Clinic: {selectedDoctor.clinic}</p>
                            <p>License: {selectedDoctor.license}</p>
                            <p>Issuing Authority: {selectedDoctor.issuing_authority}</p>
                            <p>License Expiry Date: {selectedDoctor.expiry_date}</p>
                            <p>Medical Registration: {selectedDoctor.medical_registration}</p>

                            <div className="document-thumbnails">
                                <div className="document-thumbnail">
                                    <a href={selectedDoctor.id_proof} target="_blank" rel="noopener noreferrer">
                                        <img src={`http://localhost:8000${selectedDoctor.id_proof}`} alt="ID Proof" />
                                    </a>
                                </div>
                                <div className="document-thumbnail">
                                    <a href={selectedDoctor.medical_license} target="_blank" rel="noopener noreferrer">
                                        <img src={`http://localhost:8000${selectedDoctor.medical_license}`} alt="Medical License" />
                                    </a>
                                </div>
                                <div className="document-thumbnail">
                                    <a href={selectedDoctor.degree_certificate} target="_blank" rel="noopener noreferrer">
                                        <img src={`http://localhost:8000${selectedDoctor.degree_certificate}`} alt="Degree Certificate" />
                                    </a>
                                </div>
                            </div>

                            <div className="verification-actions">
                                <button className="btn-verify" onClick={handleVerifyDoctor}>Verify</button>
                                <button className="btn-cancel" onClick={handleCancelVerification}>Cancel</button>
                            </div>
                        </div>
                    )}

{activeSection === 'users' && (
                        <div className="users-list">
                            <h4>Users List</h4>
                            {usersList.map((user) => (
                                <div className="user-card" key={user.id}>
                                    <div className="user-info">
                                        <div>
                                            <h3>{user.full_name}</h3>
                                            <p>{user.email}</p>
                                        </div>
                                        <div>
                                            <p>{user.phone}</p>
                                            <p>{user.state}</p>
                                        </div>
                                    </div>
                                    <div className="user-actions">
                                        {user.is_active ? (
                                            <button className="btn-block">Block</button>
                                        ) : (
                                            <button className="btn-unblock">Unblock</button>
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
