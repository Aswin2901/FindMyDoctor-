import React, { useState } from 'react';
import axios from 'axios';
import './DoctorSignup.css';
import Navbar from '../../../components/Navbar/Navbar.js';
import Footer from '../../../components/Footer/Footer.js';
import { Link, useNavigate } from 'react-router-dom';

const DoctorSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    state: '',
    address: '',
    password: '',
    confirm_password: '',
  });

  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Passwords do not match!');
      setSuccessMessage(''); 
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/doctors/register/', formData);

      console.log('Registration successful', response.data);
      setErrorMessage(''); // Clear error message on success
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/doctorlogin'); // Redirect after success
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      setErrorMessage('Registration failed. Please try again.'); // Set error message
      setSuccessMessage(''); // Clear success message on error
    }
  };

  return (
    <div>
      <Navbar />
      <div className="signup-container">
        <div className="signup-form">
          <h2>DOCTOR SIGN UP HERE</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              placeholder="FULL NAME"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="PHONE"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              placeholder="DATE OF BIRTH"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="STATE"
              value={formData.state}
              onChange={handleChange}
              required
            />
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="YOUR ADDRESS"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="CONFIRM PASSWORD"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />

            {/* Display success or error message */}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button type="submit" className="signup-button">SIGN UP</button>
          </form>
          <div className="signup-links">
            <Link to='/doctorlogin'>Already have an account?</Link><br />
            <Link to='/'>Sign up as a user</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorSignup;
