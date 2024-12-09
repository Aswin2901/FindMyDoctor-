import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyDoctorsPage from '../MyDoctor.js/MyDoctorsPage';
import ChatPage from '../ChatPage/ChatPage';
import defaultProfilePicture from '../../../Images/profile-icon.png';
import { useAuth } from '../../../contexts/AuthContext';
import * as yup from 'yup'; // Importing yup for validation
import ChatArea from '../../../components/Chat/ChatArea/ChatArea';

const ProfilePage = () => {
    const { logout, auth } = useAuth();
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
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Validation schema using yup
    const validationSchema = yup.object().shape({
        name: yup.string().required('Name is required.'),
        gender: yup.string().oneOf(['Male', 'Female'], 'Please select a valid gender.').required('Gender is required.'),
        mobile: yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits.').required('Mobile number is required.'),
        address: yup.string().required('Address is required.'),
    });

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
        if (isEditing) {
            updateUserProfile();
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const updateUserProfile = async () => {
        try {
            // Validate the data using yup
            await validationSchema.validate(userData, { abortEarly: false });
            setFieldErrors({}); // Clear previous field errors

            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                setError('Access token is missing.');
                return;
            }

            const response = await axios.patch(
                `http://localhost:8000/accounts/update_user_profile/${userId}/`,
                {
                    full_name: userData.name,
                    phone: userData.mobile,
                    gender: userData.gender,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setSuccessMessage(response.data.message);
            setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
        } catch (error) {
            if (error.name === 'ValidationError') {
                // Handle validation errors from yup
                const errors = {};
                error.inner.forEach((err) => {
                    errors[err.path] = err.message;
                });
                setFieldErrors(errors);
            } else {
                setError('Failed to update profile.');
                setTimeout(() => setError(''), 3000); // Clear error message after 3 seconds
            }
        }
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Do you want to log out?");
        if (confirmLogout) {
            logout();
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
                    <>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                        />
                        {fieldErrors.name && <p className="error-message">{fieldErrors.name}</p>}
                    </>
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
                        {fieldErrors.gender && <p className="error-message">{fieldErrors.gender}</p>}
                    </>
                ) : (
                    <span>{userData.gender}</span>
                )}
            </div>
            <div className="info-field">
                <label>Email:</label>
                <span>{userData.email}</span>
            </div>
            <div className="info-field">
                <label>Mobile:</label>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="mobile"
                            value={userData.mobile}
                            onChange={handleInputChange}
                        />
                        {fieldErrors.mobile && <p className="error-message">{fieldErrors.mobile}</p>}
                    </>
                ) : (
                    <span>{userData.mobile}</span>
                )}
            </div>
            <div className="info-field">
                <label>Address:</label>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="address"
                            value={userData.address}
                            onChange={handleInputChange}
                        />
                        {fieldErrors.address && <p className="error-message">{fieldErrors.address}</p>}
                    </>
                ) : (
                    <span>{userData.address}</span>
                )}
            </div>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {error && <p className="error-message">{error}</p>}
        </>
    );

    const renderMyDoctorsSection = () => (
        <div style={{ width: '100%' }}>
            <MyDoctorsPage />
        </div>
    );

    const renderChatSection = () => (
        <div style={{ width: '100%' }}>
            <ChatArea userType="patient" /> 
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
                        <li
                            className={activeSection === 'chat' ? 'active' : ''}
                            onClick={() => setActiveSection('chat')}
                        >
                            Chat
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
                        activeSection === 'profile'
                            ? renderProfileSection()
                            : activeSection === 'myDoctors'
                            ? renderMyDoctorsSection()
                            : renderChatSection() // Render the Chat section when active
                    )}
                </div>
            </div><br />
            <Footer />
        </div>
    );
};

export default ProfilePage;
