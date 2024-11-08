import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentModal from '../Appointment/AppointmentModal';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import defaultProfileIcon from '../../../Images/profile-icon.png';
import './DoctorList.css';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [qualificationFilter, setQualificationFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [appointmentDoctorId, setAppointmentDoctorId] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/doctors/getdoctors/');
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const results = doctors.filter(doctor =>
      doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter ? doctor.location === locationFilter : true) &&
      (qualificationFilter ? doctor.qualification === qualificationFilter : true) &&
      (specialtyFilter ? doctor.specialty === specialtyFilter : true)
    );
    setFilteredDoctors(results);
  }, [searchTerm, locationFilter, qualificationFilter, specialtyFilter, doctors]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const toggleExpandCard = (index) => {
    setExpandedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div>
      <Navbar />
      <div className="doctor-list-container">
        <div className="filter-section">
          <h3>Filter by</h3>
          <div className="filter-group">
            <label>Location</label>
            <select onChange={(e) => setLocationFilter(e.target.value)} value={locationFilter}>
              <option value="">All</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              {/* Add more locations as needed */}
            </select>
          </div>

          <div className="filter-group">
            <label>Qualification</label>
            <select onChange={(e) => setQualificationFilter(e.target.value)} value={qualificationFilter}>
              <option value="">All</option>
              <option value="MBBS">MBBS</option>
              <option value="MD">MD</option>
              {/* Add more qualifications as needed */}
            </select>
          </div>

          <div className="filter-group">
            <label>Specialty</label>
            <select onChange={(e) => setSpecialtyFilter(e.target.value)} value={specialtyFilter}>
              <option value="">All</option>
              <option value="Cardiologist">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              {/* Add more specialties as needed */}
            </select>
          </div>
        </div>

        <div className="doctor-list">
          <h2>Your Doctors</h2>

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
                    <p>Clinic: {doctor.clinic || 'N/A'}</p>
                    <div className="doctor-actions">
                      <button
                        className="appointment-btn"
                        onClick={() => setAppointmentDoctorId(doctor.id)}
                      >
                        Take Appointment
                      </button>
                      <button className="add-doctor-btn">Add to My Doctors</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Render the AppointmentModal if appointmentDoctorId is set */}
        {appointmentDoctorId && (
          <AppointmentModal
            doctorId={appointmentDoctorId}
            closeModal={() => setAppointmentDoctorId(null)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DoctorList;