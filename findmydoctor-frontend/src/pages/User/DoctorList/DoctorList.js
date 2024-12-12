import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentModal from '../Appointment/AppointmentModal';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import defaultProfileIcon from '../../../Images/profile-icon.png';
import './DoctorList.css';
import { useAuth } from '../../../contexts/AuthContext';
import { containerClasses } from '@mui/material';

const DoctorList = () => {
  const auth = useAuth();
  const userId = auth.auth.user.id;
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [qualificationFilter, setQualificationFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [appointmentDoctorId, setAppointmentDoctorId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [doctorQualifications, setDoctorQualifications] = useState([]);
  const [doctorSpecialty , setDoctorSpeciality] = useState([])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/doctors/getdoctors/');
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        const uniqueQualifications = new Set(response.data.map(doctor => doctor.qualification)); 
        setDoctorQualifications(Array.from(uniqueQualifications));

        const uniqueSpeciality = new Set(response.data.map(doctor => doctor.specialty)); 
        setDoctorSpeciality(Array.from(uniqueSpeciality));

        const uniqueLocations = [...new Set(response.data.map((doctor) => doctor.location))];
        setLocations(uniqueLocations);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setErrorMessage('Failed to fetch doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const results = doctors.filter((doctor) =>
      doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter ? doctor.location === locationFilter : true) &&
      (qualificationFilter ? doctor.qualification === qualificationFilter : true) &&
      (specialtyFilter ? doctor.specialty === specialtyFilter : true)
    );
    setFilteredDoctors(results);
  }, [searchTerm, locationFilter, qualificationFilter, specialtyFilter, doctors]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const toggleExpandCard = (index) => {
    setExpandedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const findNearestDoctors = async () => {
    if (!userLocation) {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          try {
            const response = await axios.get('http://localhost:8000/doctors/nearest/', {
              params: { latitude, longitude },
            });
            setFilteredDoctors(response.data);
          } catch (error) {
            console.error('Error fetching nearest doctors:', error);
            setErrorMessage('Failed to fetch nearest doctors. Please try again later.');
          }
        }, (error) => {
          console.error('Geolocation error:', error);
          setErrorMessage('Location access denied. Please enable location to find nearest doctors.');
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMessage('Failed to retrieve your location.');
      }
    }
  };

  const addToMyDoctors = async (doctorId) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/accounts/add-to-my-doctors/',
        { doctor_id: doctorId, userId: userId }
      );
      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error adding doctor to My Doctors:', error);
      setErrorMessage('Failed to add doctor. Please try again later.');
      setTimeout(() => setErrorMessage(null), 5000);
    }
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
            <select
              onChange={(e) => {
                const value = e.target.value;
                setLocationFilter(value);
                if (value === 'nearest') {
                  findNearestDoctors();
                }
              }}
              value={locationFilter}
            >
              <option value="">All</option>
              <option value="nearest">Nearest</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Qualification</label>
            <select 
              onChange={(e) => setQualificationFilter(e.target.value)} 
              value={qualificationFilter}
            >
              <option value="">All</option>
              {doctorQualifications.map((qualification) => ( 
                <option key={qualification} value={qualification}>{qualification}</option> 
              ))} 
            </select>
          </div>

          <div className="filter-group">
            <label>Specialty</label>
            <select 
              onChange={(e) => setSpecialtyFilter(e.target.value)} 
              value={specialtyFilter}
            >
              <option value="">All</option>
              {doctorSpecialty.map((specialty) => ( 
                <option key={specialty} value={specialty}>{specialty}</option> 
              ))} 
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

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="doctor-cards">
            {filteredDoctors.map((doctor, index) => (
              <div key={index} className="doctor-card">
                <div className="doctor-header" onClick={() => toggleExpandCard(index)}>
                  <div className="doctor-info">
                    <p style={{color:'rebeccapurple', fontSize: 'large'}}>{doctor.distance ? `KM : ${doctor.distance}` : '' }</p>
                    <img
                      src={`http://localhost:8000${doctor.profile_picture}` || defaultProfileIcon}
                      alt={doctor.full_name}
                      className="doctor-image"
                    />
                    <h3>{doctor.full_name}</h3>
                    <p>Qualification: {doctor.qualification}</p>
                    <p>Specialty: {doctor.specialty}</p>
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
                    <p>Clinic Address: {doctor.clinic_address || 'N/A'}</p>
                    <p>Location: {doctor.location}</p>
                    <div className="doctor-actions">
                      <button
                        className="appointment-btn"
                        onClick={() => setAppointmentDoctorId(doctor.id)}
                      >
                        Take Appointment
                      </button>
                      <button
                        className="add-doctor-btn"
                        onClick={() => addToMyDoctors(doctor.id)}
                      >
                        Add to My Doctors
                      </button>
                    </div>
                    </div>
                )}
              </div>
            ))}
            </div>
        </div>

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