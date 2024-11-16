import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; 
import Footer from '../../../components/Footer/Footer';
import ProfileIcon from '../../../Images/profile-icon.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect
import AdminNav from '../AdminNav/AdminNav';

const Dashboard = () => {
    const [recentDoctors, setRecentDoctors] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    let currentDoctors = doctorsList.slice(indexOfFirstItem, indexOfLastItem);
    let currentUsers = usersList.slice(indexOfFirstItem, indexOfLastItem);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate function

    const [statusFilter, setStatusFilter] = useState('');

    const filteredDoctors = doctorsList.filter((doctor) => {
        return statusFilter === '' || doctor.is_verified.toString() === statusFilter;
    });

    currentDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

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
            localStorage.clear(); 
            navigate('/'); 
        }
    };

    // Placeholder function for handling review of a doctor
    const handleReviewDoctor = async (doctorId) => {
        try {
            const response = await axios.get(`http://localhost:8000/doctors/review/${doctorId}/`);
            console.log(response.data)
            setSelectedDoctor(response.data);
            setErrorMessage('');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage('The doctor has not submitted the documents yet.');
            } else {
                console.error('Error fetching doctor verification details:', error);
                setErrorMessage('An error occurred while fetching the verification details.');
            }
            
        }
    };

    const handleVerifyDoctor = async () => {
        try {
            await axios.post(`http://localhost:8000/doctors/makeverify/${selectedDoctor.doc_id}/`);
            alert("Doctor verified");
            setSelectedDoctor(null);
            fetchDoctorsList();
        } catch (error) {
            console.error('Error verifying doctor:', error);
        }
    };

    const handleCancelVerification = () => {
        console.log("Canceled verification for doctor:", selectedDoctor);
        setSelectedDoctor(null); // Clear selection
    };

    return (
        <div className="dashboard-container">
            <AdminNav/>

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
                            {errorMessage && (
                                <div className="error-message">
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            <div className="filter-section">
                                <label htmlFor="statusFilter">Filter by Status:</label>
                                <select id="statusFilter" onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                                    <option value="">All</option>
                                    <option value="true">Verified</option>
                                    <option value="false">Not Verified</option>
                                </select>
                            </div>

                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Profile</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>State</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentDoctors.map((doctor) => (
                                        <tr key={doctor.id}>
                                            <td><img src={doctor.profile_picture || ProfileIcon} alt={`${doctor.full_name}'s Profile`} className="table-profile-picture" /></td>
                                            <td>{doctor.full_name}</td>
                                            <td>{doctor.email}</td>
                                            <td>{doctor.phone}</td>
                                            <td>{doctor.state}</td>
                                            <td style={{ color: doctor.is_verified ? 'green' : 'red' }}>{doctor.is_verified ? 'Verified' : 'Not Verified'}</td>
                                            <td className='actions'><button className="btn-review" onClick={() => handleReviewDoctor(doctor.id)}>Review & Verify</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-controls">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                    Previous
                                </button>
                                <span>Page {currentPage} of {Math.ceil(doctorsList.length / itemsPerPage)}</span>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(doctorsList.length / itemsPerPage)))} 
                                        disabled={currentPage === Math.ceil(doctorsList.length / itemsPerPage)}>
                                    Next
                                </button>
                            </div>
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
                                    <a href={`http://localhost:8000${selectedDoctor.id_proof}`} target="_blank" rel="noopener noreferrer">
                                        <img src={`http://localhost:8000${selectedDoctor.id_proof}`} alt="ID Proof" />
                                    </a>
                                </div>
                                <div className="document-thumbnail">
                                    <a href={`http://localhost:8000${selectedDoctor.medical_license}`} target="_blank" rel="noopener noreferrer">
                                        <img src={`http://localhost:8000${selectedDoctor.medical_license}`} alt="Medical License" />
                                    </a>
                                </div>
                                <div className="document-thumbnail">
                                    <a href={`http://localhost:8000${selectedDoctor.degree_certificate}`} target="_blank" rel="noopener noreferrer">
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

                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>State</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.full_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.state}</td>
                                            <td className='actions'>
                                                <button className={user.is_active ? "btn-block" : "btn-unblock"}>
                                                    {user.is_active ? 'Block' : 'Unblock'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-controls">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                    Previous
                                </button>
                                <span>Page {currentPage} of {Math.ceil(doctorsList.length / itemsPerPage)}</span>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(doctorsList.length / itemsPerPage)))} 
                                        disabled={currentPage === Math.ceil(doctorsList.length / itemsPerPage)}>
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
