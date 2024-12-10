import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Footer from '../../../components/Footer/Footer';
import ProfileIcon from '../../../Images/profile-icon.png';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../AdminNav/AdminNav';

const Dashboard = () => {
    // State variables
    const [recentDoctors, setRecentDoctors] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dashboardCounts, setDashboardCounts] = useState({
        totalDoctors: 0,
        totalUsers: 0,
        totalAppointments: 0,
        newAppointments: 0,
    })
    const [appointments, setAppointments] = useState([]);

    const navigate = useNavigate();

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filtered and paginated data
    const filteredDoctors = doctorsList.filter((doctor) => {
        return statusFilter === '' || doctor.is_verified.toString() === statusFilter;
    });
    const currentDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);
    const currentUsers = usersList.slice(indexOfFirstItem, indexOfLastItem);

    // Fetch recent doctors
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

        const fetchDashboardCounts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/appointments/dashboard/counts/');
                const { total_doctors, total_users, total_appointments, new_appointments } = response.data;
                setDashboardCounts({
                    totalDoctors: total_doctors,
                    totalUsers: total_users,
                    totalAppointments: total_appointments,
                    newAppointments: new_appointments,
                });
            } catch (error) {
                console.error('Error fetching dashboard counts:', error);
            }
        };
    
        fetchDashboardCounts();
    }, []);

    // Fetch doctors list
    const fetchDoctorsList = async () => {
        try {
            const response = await axios.get('http://localhost:8000/doctors/all/');
            setDoctorsList(response.data);
        } catch (error) {
            console.error('Error fetching doctors list:', error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8000/appointments/all_appointments/');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    // Fetch users list
    const fetchUsersList = async () => {
        try {
            const response = await axios.get('http://localhost:8000/accounts/all/');
            setUsersList(response.data);
        } catch (error) {
            console.error('Error fetching users list:', error);
        }
    };

    // Handle section menu clicks
    const handleMenuClick = (section) => {
        setActiveSection(section);
        setSelectedDoctor(null);
        setErrorMessage('');
        if (section === 'doctors') fetchDoctorsList();
        if (section === 'users') fetchUsersList();
        if (section === 'appointments') fetchAppointments();
    };

    // Logout function
    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to log out?');
        if (confirmLogout) {
            localStorage.clear();
            navigate('/');
        }
    };

    // Review doctor details
    const handleReviewDoctor = async (doctorId) => {
        try {
            const response = await axios.get(`http://localhost:8000/doctors/review/${doctorId}/`);
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

    // Verify doctor
    const handleVerifyDoctor = async () => {
        try {
            await axios.post(`http://localhost:8000/doctors/makeverify/${selectedDoctor.doc_id}/`);
            alert('Doctor verified successfully');
            setSelectedDoctor(null);
            fetchDoctorsList();
        } catch (error) {
            console.error('Error verifying doctor:', error);
        }
    };

    // Cancel doctor verification
    const handleCancelVerification = () => {
        setSelectedDoctor(null);
    };

    // Block/unblock user
    const handleBlockUser = async (userId, currentStatus) => {
        const confirmAction = window.confirm(
            `Are you sure you want to ${currentStatus ? 'block' : 'unblock'} this user?`
        );

        if (confirmAction) {
            try {
                const response = await axios.patch(`http://localhost:8000/accounts/${userId}/block/`, {
                    is_active: !currentStatus,
                });
                setUsersList(usersList.map(user =>
                    user.id === userId ? { ...user, is_active: response.data.is_active } : user
                ));
            } catch (error) {
                console.error('Error blocking/unblocking user:', error);
                alert('An error occurred while updating the user status.');
            }
        }
    };

    // Render the dashboard UI
    return (
        <div className="dashboard-container">
            <AdminNav />

            <div className="dashboard-main">
                <aside className="sidebar">
                    <div className="menu-title">Primary Menu</div>
                    <ul className="menu-list">
                        <li
                            className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                            onClick={() => handleMenuClick('dashboard')}
                        >
                            Dashboard
                        </li>
                        <li className={`menu-item ${activeSection === 'appointments' ? 'active' : ""}`}
                            onClick={() => handleMenuClick('appointments')}
                         >
                            Appointments 
                        </li>
                        <li
                            className={`menu-item ${activeSection === 'doctors' ? 'active' : ''}`}
                            onClick={() => handleMenuClick('doctors')}
                        >
                            Doctors
                        </li>
                        <li
                            className={`menu-item ${activeSection === 'users' ? 'active' : ''}`}
                            onClick={() => handleMenuClick('users')}
                        >
                            Users
                        </li>
                        <li className="menu-item logout" onClick={handleLogout}>
                            Logout
                        </li>
                    </ul>
                </aside>

                <section className="dashboard-content">
                    {/* Dashboard Overview Section */}
                    {activeSection === 'dashboard' && (
                        <>
                            <div className="categories">
                                <div className="category-card">
                                    <h3>{dashboardCounts.newAppointments || 5}</h3>
                                    <p>New Appointments</p>
                                </div>
                                <div className="category-card">
                                    <h3>{dashboardCounts.totalAppointments || 0}</h3>
                                    <p>Total Appointments</p>
                                </div>
                                <div className="category-card">
                                    <h3>{ dashboardCounts.totalUsers || 0}</h3>
                                    <p>Total Users</p>
                                </div>
                                <div className="category-card">
                                    <h3>{dashboardCounts.totalDoctors || 0}</h3>
                                    <p>Total Doctors</p>
                                </div>
                            </div>

                            <div className="new-doctors">
                                <h4>New Doctors</h4>
                                {recentDoctors.map((doctor, index) => (
                                    <div className="doctor-card" key={index}>
                                        <div className="doctor-info">
                                            <img
                                                src={doctor.profile_picture || ProfileIcon}
                                                alt={`${doctor.full_name}'s Profile`}
                                                className="doctor-profile-picture"
                                            />
                                            <h5>{doctor.full_name}</h5>
                                            <p>{doctor.email}</p>
                                            <p>{doctor.phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeSection === 'appointments' && (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Appointment ID</th>
                                    <th>Doctor</th>
                                    <th>User</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>{appointment.id}</td>
                                        <td>{appointment.doctor__full_name}</td>
                                        <td>{appointment.patient__full_name}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.time}</td>
                                        <td>{appointment.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Doctors Section */}
                    {activeSection === 'doctors' && !selectedDoctor && (
                        <>
                            <div className="admin-filter-section">
                                <label htmlFor="statusFilter">Filter by Status:</label>
                                <select
                                    id="statusFilter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
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
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentDoctors.map((doctor) => (
                                        <tr key={doctor.id}>
                                            <td>
                                                <img
                                                    src={doctor.profile_picture || ProfileIcon}
                                                    alt={`${doctor.full_name}'s Profile`}
                                                    className="table-profile-picture"
                                                />
                                            </td>
                                            <td>{doctor.full_name}</td>
                                            <td>{doctor.email}</td>
                                            <td>{doctor.phone}</td>
                                            <td style={{ color: doctor.is_verified ? 'green' : 'red' }}>
                                                {doctor.is_verified ? 'Verified' : 'Not Verified'}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-review"
                                                    onClick={() => handleReviewDoctor(doctor.id)}
                                                >
                                                    Review & Verify
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* Verification Details Section */}
                    {activeSection === 'doctors' && selectedDoctor && (
                        <div className="verification-details">
                            <h4>Verification Details</h4>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            {selectedDoctor && (
                                <>
                                    <p>Full Name: {selectedDoctor.full_name}</p>
                                    <p>Email: {selectedDoctor.email}</p>
                                    <p>Phone: {selectedDoctor.phone}</p>
                                    <p>State: {selectedDoctor.state}</p>
                                    <p>Address: {selectedDoctor.address}</p>
                                    <p>Date of Birth: {selectedDoctor.date_of_birth}</p>
                                    <p>Gender: {selectedDoctor.gender}</p>
                                    <div className="verification-buttons">
                                        <button
                                            className="btn-verify"
                                            onClick={handleVerifyDoctor}
                                        >
                                            Verify
                                        </button>
                                        <button
                                            className="btn-cancel"
                                            onClick={handleCancelVerification}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Users Section */}
                    {activeSection === 'users' && (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.full_name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td style={{ color: user.is_active ? 'green' : 'red' }}>
                                            {user.is_active ? 'Active' : 'Blocked'}
                                        </td>
                                        <td>
                                            <button
                                                className={`btn-block ${user.is_active ? 'block' : 'unblock'}`}
                                                onClick={() => handleBlockUser(user.id, user.is_active)}
                                            >
                                                {user.is_active ? 'Block' : 'Unblock'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
