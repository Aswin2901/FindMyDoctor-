import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css';
import Navbar from '../../../components/Navbar/Navbar.js';
import Footer from '../../../components/Footer/Footer.js';
import { Link } from 'react-router-dom';

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState(''); // State for handling errors

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData.email, formData.password);
      const response = await axios.post('http://localhost:8000/doctors/login/', {
        email: formData.email,
        password: formData.password,
      });

      console.log('Login successful', response.data);

      // Store the token in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Navigate to the doctor dashboard after successful login
      navigate('/doctordashboard');
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);

      // Set error message if login fails
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />

      <div className="login-container">
        <div className="login-form">
          <h2>DOCTOR LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Display error message for login failure */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button type="submit" className="login-button">LOGIN</button>
          </form>

          <div className="login-links">
            <Link to='/doctorsignup'>Don't have an account? Sign up here</Link><br />
            <Link to='/'>Go to user login</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorLogin;
