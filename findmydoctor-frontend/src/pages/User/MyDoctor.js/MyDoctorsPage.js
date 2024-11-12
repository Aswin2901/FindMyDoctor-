import React, { useState, useEffect } from 'react';
import './MyDoctorsPage.css';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import defaultProfilePic from '../../../Images/profile-icon.png'

const MyDoctorsPage = () => {
    const navigate = useNavigate();
    const userId = useSelector((state) => state.auth.user?.id);
    const [favoriteDoctors, setFavoriteDoctors] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavoriteDoctors = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/accounts/${userId}/favorites`);
                setFavoriteDoctors(response.data);
            } catch (error) {
                console.error("Error fetching favorite doctors:", error);
                setError("Failed to load favorite doctors.");
            }
        };

        if (userId) {
            fetchFavoriteDoctors();
        }
    }, [userId]);

    const handleRemoveDoctor = async (doctorId) => {
        if (window.confirm("Are you sure you want to remove this doctor from your favorites?")) {
            try {
                await axios.delete(`http://localhost:8000/accounts/${userId}/favorites/${doctorId}`);
                setFavoriteDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor.id !== doctorId));
            } catch (error) {
                console.error("Error removing doctor:", error);
                setError("Failed to remove doctor.");
            }
        }
    };

    const handleAddDoctor = () => {
        navigate('/doctorlist');
    };

    return (
        <div className="my-doctors-page">
            {error && <p className="error-message">{error}</p>}
            
            <h2>My Favorite Doctors</h2>
            <table className="doctor-table">
                <thead>
                    <tr>
                        <th>Profile Picture</th>
                        <th>Name</th>
                        <th>Specialty</th>
                        <th>Phone</th>
                        <th>Hospital</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {favoriteDoctors.map((doctor) => (
                        <tr key={doctor.id}>
                            <td>
                                <img
                                    src={doctor.imageUrl || defaultProfilePic}
                                    alt={doctor.name}
                                    className="doctor-avatar"
                                />
                            </td>
                            <td className="doctor-name">{doctor.full_name}</td>
                            <td className="doctor-specialty">{doctor.specialty}</td>
                            <td className='doctor-phone'>{doctor.phone}</td>
                            <td className="doctor-hospital">{doctor.hospital}</td>
                            <td>
                                <button onClick={() => handleRemoveDoctor(doctor.id)} className="remove-button">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={handleAddDoctor} className="add-button">
                Add Doctor
            </button>
        </div>
    );
};

export default MyDoctorsPage;
