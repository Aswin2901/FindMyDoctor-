import React, { useState, useEffect } from 'react';
import './DoctorList.css';
import axios from 'axios';
import defaultProfileIcon from '../../../Images/profile-icon.png';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/doctors/getdoctors/');
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const results = doctors.filter(doctor =>
      doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.qualification.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(results);
  }, [searchTerm, doctors]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const toggleExpandCard = (index) => {
    setExpandedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  return (
    <div>
      <Navbar/>

      <div className="doctor-list">
        <h2>Your Doctors</h2>

        {/* Search and Filter */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, specialty, or qualification"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="doctor-cards">
          {filteredDoctors.map((doctor, index) => (
            <div key={index} className="doctor-card">
              <div className="doctor-header" onClick={() => toggleExpandCard(index)}>
                <div className="doctor-info">
                  <img 
                    src={doctor.profile_picture || defaultProfileIcon} 
                    alt={doctor.full_name} 
                    className="doctor-image" 
                  />
                  <div>
                    <h3>{doctor.full_name}</h3>
                    <p>Qualification: {doctor.qualification}</p>
                    <p>Specialty: {doctor.specialty}</p>
                  </div>
                </div>
                <button className="expand-button">
                  {expandedCards[index] ? '▲' : '▼'}
                </button>
              </div>

              {expandedCards[index] && (
                <div className="doctor-details">
                  <p>Email: {doctor.email}</p>
                  <p>Phone: {doctor.phone}</p>
                  <p>Gender: {doctor.gender}</p>
                  <p>Experience: {doctor.experience} years</p>
                  <p>Hospital: {doctor.hospital}</p>
                  <p>Clinic: {doctor.clinic || "N/A"}</p>
                  <div className="doctor-actions">
                    <button className="appointment-button">Take Appointment</button>
                    <button className="add-doctor-button">Add to My Doctors</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default DoctorList;
