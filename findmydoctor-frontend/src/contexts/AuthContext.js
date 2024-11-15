import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    console.log('authProvider')
  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    user: null,
  });
 console.log('auth' , auth)

  const login = (data) => {
    setAuth({
      accessToken: data.access,
      refreshToken: data.refresh,
      user: {
        id: data.id,
        role: data.is_superuser ? 'admin' : data.is_doctor ? 'doctor' : 'user',
      },
    });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  };

  const logout = () => {
    setAuth({ accessToken: null, refreshToken: null, user: null });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const refreshAccessToken = async () => {
    try {
        console.log('called')
      const response = await axios.post('http://localhost:8000/token/refresh/', {
        refresh: auth.refreshToken,
      });
      setAuth((prev) => ({ ...prev, accessToken: response.data.access }));
      
      localStorage.setItem('access_token', response.data.access);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    console.log('called')
    const interval = setInterval(refreshAccessToken, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [auth.refreshToken]);

  return (
    <AuthContext.Provider value={{ auth, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};