import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import doctor1 from '../../../Images/pixelcut-export.png';
import doctor2 from '../../../Images/doctor-herp.jpg';
import doctor3 from '../../../Images/doc-3.jpeg';
import doctorpatient from '../../../Images/service doctor -1.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Home = () => {
  const auth = useAuth()
  console.log('userId : ', auth.auth.user.id); 

  const navigate = useNavigate()

  useEffect(() => {
    // Prevent back navigation
    const preventBack = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBack);

    return () => window.removeEventListener('popstate', preventBack);
  }, []);

  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    doctor1,
    doctor2,
    doctor3
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-container">
      <Navbar />

      <div 
        className="hero-section"
        style={{ backgroundImage: `url(${images[currentImage]})` }} 
      >
        <div className="hero-content">
          <h1>Find Your Personal <span>Doctor</span> <br/> Anytime!</h1>
          <div className="action-buttons">
            <div className="button search-button" >
              <FontAwesomeIcon icon={faSearch} className="icon" />
              <p>SEARCH</p>
            </div>
            <div className="button appointment-button" onClick={()=>{
              navigate('/user/appointment_list');
            }}>
              <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
              <p>APPOINTMENT</p>
            </div>
            <div className="button profile-button" onClick={()=>{
              navigate('/doctorlist')
            }}>
              <FontAwesomeIcon icon={faUser} className="icon" />
              <p>DOCTORS</p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-text">
          <h2>We connect you with the best <span>Doctors</span> for your health needs.</h2>
          <button className="book-now-btn">Book Now</button>
        </div>
        <div className="info-image">
          <img src={doctorpatient} alt="Doctor and Patient" />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
