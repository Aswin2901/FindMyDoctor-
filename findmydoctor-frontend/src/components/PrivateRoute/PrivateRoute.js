import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const accessToken = localStorage.getItem('access_token'); // Get the access token from local storage

    // Check if the user is authenticated via Redux or has a valid access token in local storage
    const isUserAuthenticated = isAuthenticated || !!accessToken;

    return isUserAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;