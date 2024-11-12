import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../slices/authSlice';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

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
          console.log('....adfadf.......' , response.data)
          dispatch(login({
              user: {
                  id: response.data.userId,  // Pass the ID here
                  email: response.data.email,
                  isSuperUser: response.data.is_superuser,
              },
              role: response.data.is_superuser ? 'admin' : 'user',
          }));
    
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
