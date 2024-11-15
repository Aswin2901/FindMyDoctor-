import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MyDoctorsPage from '../MyDoctor.js/MyDoctorsPage';
import defaultProfilePicture from '../../../Images/profile-icon.png'
import { useAuth } from '../../../contexts/AuthContext';

const ProfilePage = () => {
    const { logout , auth } = useAuth()
    console.log(auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = auth.user.id;
    const [activeSection, setActiveSection] = useState("profile"); 
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        gender: '',
        email: '',
        mobile: '',
        address: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setError('User ID is not available.');
            setLoading(false);
            return;
        }

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('Access token is missing.');
            setLoading(false);
            return;
        }

        const getProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/accounts/get_profile/${userId}`);
                setUserData({
                    name: response.data.full_name,
                    gender: response.data.gender,
                    email: response.data.email,
                    mobile: response.data.phone,
                    address: response.data.address,
                });
            } catch (error) {
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [userId]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Do you want to log out?");
        if (confirmLogout) {
            logout()
            navigate('/');
        }
    };

    const renderProfileSection = () => (
        <>
            <div className="section-header">
                <h2>Personal Information</h2>
                <button className="edit-button" onClick={handleEditToggle}>
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>
            <div className="info-field">
                <label>Name:</label>
                {isEditing ? (
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                    />
                ) : (
                    <span>{userData.name}</span>
                )}
            </div>
            <div className="info-field">
                <label>Gender:</label>
                {isEditing ? (
                    <>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={userData.gender === 'Male'}
                                onChange={handleInputChange}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={userData.gender === 'Female'}
                                onChange={handleInputChange}
                            />
                            Female
                        </label>
                    </>
                ) : (
                    <span>{userData.gender}</span>
                )}
            </div>
            <div className="info-field">
                <label>Email:</label>
                {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                    />
                ) : (
                    <span>{userData.email}</span>
                )}
            </div>
            <div className="info-field">
                <label>Mobile:</label>
                {isEditing ? (
                    <input
                        type="text"
                        name="mobile"
                        value={userData.mobile}
                        onChange={handleInputChange}
                    />
                ) : (
                    <span>{userData.mobile}</span>
                )}
            </div>
            <div className="info-field">
                <label>Address:</label>
                {isEditing ? (
                    <input
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                    />
                ) : (
                    <span>{userData.address}</span>
                )}
            </div>
        </>
    );

    const renderMyDoctorsSection = () => (
        <div style={{width : '100%' , }}>
            <MyDoctorsPage/>
        </div>
    );

    return (
        <div>
            <Navbar /><br />
            <div className="profile-page">
                <div className="sidebar">
                    <div className="user-info">
                        <img src={defaultProfilePicture} alt="User" className="user-avatar" />
                        <div>
                        <h2>Hello,</h2>
                        <h3>{userData.name}</h3>
                        </div>
                    </div>
                    <ul className="sidebar-menu">
                        <li 
                            className={activeSection === 'profile' ? 'active' : ''}
                            onClick={() => setActiveSection('profile')}
                        >
                            Profile Information
                        </li>
                        <li 
                            className={activeSection === 'myDoctors' ? 'active' : ''}
                            onClick={() => setActiveSection('myDoctors')}
                        >
                            My Doctors
                        </li>
                        <li onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
                <div className="profile-details">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        activeSection === 'profile' ? renderProfileSection() : renderMyDoctorsSection()
                    )}
                </div>
            </div><br />
            <Footer />
        </div>
    );
};

export default ProfilePage;
