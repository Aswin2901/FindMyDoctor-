import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokens = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      console.log('Authorization code:', code); // Log the code for debugging

      if (code) {
        try {
          const response = await axios.get(`http://localhost:8000/accounts/oauth/callback/?code=${code}`);

          console.log('Login success:', response.data); // This should log the success response
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('refresh_token' , response.data.refresh_token);
          console.log('Access token saved to localStorage'); // Log to confirm access token is saved
          navigate('/home'); // Redirect to home after successful login
        } catch (error) {
          console.error('Error exchanging code for token', error);
        }
      } else {
        console.error('No authorization code found'); 
      }
    };

    fetchTokens();
  }, [navigate]);

  return <div>Logging you in...</div>; 
};

export default GoogleCallback;
