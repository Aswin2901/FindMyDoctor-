import React from 'react';
import './Navbar.css';
import logo from '../../Images/icon.svg';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Find My Doctor Logo" />
                <span>FIND <span className="highlight">MY</span> DOCTOR</span>
            </div>
            <ul className="navbar-links">
                <li><button onClick={() => handleNavigate('/home')}>HOME</button></li>
                <li><button onClick={() => handleNavigate('/service')}>SERVICE</button></li>
                <li><button onClick={() => handleNavigate('/notification')}>NOTIFICATION</button></li>
            </ul>
            <div className="navbar-user-icon">
                <button onClick={() => handleNavigate('/profile')}>
                    <i className="fa fa-user"></i>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
