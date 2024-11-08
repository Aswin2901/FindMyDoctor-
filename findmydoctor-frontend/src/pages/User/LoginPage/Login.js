import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar.js';
import Footer from '../../../components/Footer/Footer.js';
import { useDispatch } from 'react-redux';
import { login } from '../../../slices/authSlice';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/token/', {
        email: formData.email,
        password: formData.password,
      });

      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      if (response.data.is_doctor) {
            localStorage.setItem('doctor_id', response.data.doctor_id);
        }

      // Dispatch Redux action to update global auth state
      dispatch(login({
        user: {
            id: response.data.id,  // Pass the ID here
            email: formData.email,
            isSuperUser: response.data.is_superuser,
        },
        role: response.data.is_superuser ? 'admin' : 'user',
    }));

      setSuccessMessage('Login successful! Redirecting...');
      setErrorMessage('');

      setTimeout(() => {
        let destination = '/home'; 
    
        if (response.data.is_doctor) {
            destination = '/doctordashboard';
        } else if (response.data.is_superuser) {
            destination = '/admin/dashboard';
        }
    
        // Navigate to the determined destination
        navigate(destination);
    
        window.history.replaceState(null, '', destination);
    }, 2000);

    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setErrorMessage('Invalid email or password!');
      setSuccessMessage('');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/accounts/oauth/login/');
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Google login failed', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-container">
        <div className="login-form">
          <h2>LOGIN HERE</h2>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="login-button">LOGIN</button>
          </form>
          <div className="login-links">
            <Link to='/signup'>Don't have an account?</Link>
          </div>
        </div>

        {/* Google Login Button */}
        <button onClick={handleGoogleLogin} className="google-login-button">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google logo" />
          <span>Login with Google</span>
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Login;