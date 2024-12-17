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
import SubNavbar from '../../../components/SubNavBar/SubNavbar';

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
  const [location, setLocation] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = () => {
    if (!location) {
      alert("Please choose a location!");
      return;
    }
    console.log("Searching for:", searchKeyword, "in location:", location);

    // Here you can implement your logic to fetch or filter doctors
    // Example: Call API to fetch doctors
    // fetchDoctors({ location, keyword: searchKeyword });
  };

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
      <SubNavbar/>

      <div 
        className="hero-section"
        style={{ backgroundImage: `url(${images[currentImage]})` }} 
      >
        <div className="hero-content">
          <h1>Find Your Personal <span>Doctor</span> <br/> Anytime!</h1>
          
          {/* Search Section */}
          <div className="home-search-section" >
            {/* Location Dropdown */}
            <select 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 15px',
                border: 'none',
                backgroundColor: '#f0f4f8',
                color: '#333',
                fontSize: '1rem',
                outline: 'none',
                width: '30%',
                margin: '0px',
                height: '100%',
              }}
              className="home-location-select" 
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Location</option>
              <option value="new-york">New York</option>
              <option value="los-angeles">Los Angeles</option>
              <option value="chicago">Chicago</option>
              {/* Add more locations as needed */}
            </select>
            
            {/* Search Input */}
            <input 
              style={{'padding':'12px 15px','outline':'none','font-size':'1rem','color':'#333','margin': '0px','width':'100%','height':'100%'}}
              type="text" 
              placeholder="Search for doctor, specialty, etc." 
              className="home-search-input" 
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            
            {/* Search Button */}
            <button 
              className="home-search-button" 
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-text">
          <h2>We connect you with the best <span>Doctors</span> for your health needs.</h2>
          <button className="book-now-btn" onClick={()=>{
              navigate('/doctorlist')
            }}>Book Now</button>
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
