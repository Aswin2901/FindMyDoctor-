import React from 'react';
import './Dashboard.css';
// import doctor1 from '../../Images/doctor1.jpg'; // Assuming image paths
// import doctor2 from '../../Images/doctor2.jpg'; // Assuming image paths
// import logo from '../../Images/logo.svg'; // Assuming image paths

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                {/* <img src={logo} alt="Find My Doctor Logo" className="dashboard-logo" /> */}
            </header>

            <div className="dashboard-main">
                <aside className="sidebar">
                    <div className="menu-title">Primary Menu</div>
                    <ul className="menu-list">
                        <li className="menu-item active">Dashboard</li>
                        <li className="menu-item">Appointment Management</li>
                        <li className="menu-item">Doctors</li>
                        <li className="menu-item">Users</li>
                        <li className="menu-item logout">Logout</li>
                    </ul>
                </aside>

                <section className="dashboard-content">
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
                        <div className="doctor-card">
                            {/* <img src={doctor1} alt="Dr. John Jacob" /> */}
                            <div className="doctor-info">
                                <h5>DR JOHN JACOB</h5>
                                <p>Cardiologists</p>
                                <p>Harmony Wellness Center</p>
                            </div>
                        </div>
                        <div className="doctor-card">
                            {/* <img src={doctor2} alt="Dr. Sam" /> */}
                            <div className="doctor-info">
                                <h5>DR SAM</h5>
                                <p>Gynecologist</p>
                                <p>Wholebody Care Clinic</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="dashboard-footer">
                <p>READY FOR YOUR <span className="highlight">NEXT STEP</span> TOWARDS BETTER <span className="highlight">HEALTH</span>?</p>
                <div className="footer-icons">
                    <i className="fa fa-globe"></i>
                    <i className="fa fa-facebook"></i>
                    <i className="fa fa-linkedin"></i>
                    <i className="fa fa-instagram"></i>
                </div>
                <p className="footer-contact">info@findmydoctor.com</p>
                <div className="footer-links">
                    <a href="/">privacy policy</a>
                    <a href="/">terms & conditions</a>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
