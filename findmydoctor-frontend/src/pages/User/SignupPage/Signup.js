import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', gender: '', date_of_birth: '', state: '', address: '', password: '', confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessages, setErrorMessages] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessages("Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/accounts/register/', formData);
      setErrorMessages('')
      console.log('OTP sent', response.data);
      setOtpSent(true); // Show OTP input field
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      setErrorMessages('An error occurred. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/accounts/verify-otp/', { ...formData, otp });
      console.log('User registered successfully', response.data);
      setErrorMessages('')
      navigate('/login', { state: { message: 'Signup successful! Please log in.' } });
    } catch (error) {
      console.error('OTP verification error:', error.response ? error.response.data : error.message);
      setErrorMessages('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      {/* Display Error Messages */}
      {errorMessages && <div className="error-message">{errorMessages}</div>}
      
      {/* Signup form */}
      {!otpSent ? (
        <form onSubmit={handleSubmit} className="signup-form">
          <h2>Sign Up</h2>
          <label>
            Full Name:
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Phone:
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </label>
          <label>
            Gender:
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label>
            Date of Birth:
            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
          </label>
          <label>
            State:
            <input type="text" name="state" value={formData.state} onChange={handleChange} required/>
          </label>
          <label>
            Address:
            <input type="text" name="address" value={formData.address} onChange={handleChange} required/>
          </label>
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
          <label>
            Confirm Password:
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </label>
          <button type="submit" className="signup-button">SIGN UP</button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="otp-form">
          <h2>Enter OTP</h2>
          <label>OTP:</label>
          <input type="text" name="otp" value={otp} onChange={handleOtpChange} required />
          <button type="submit" className="otp-button">VERIFY OTP</button>
        </form>
      )}
    </div>
  );
};

export default Signup;
