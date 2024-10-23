import React from 'react';
import './Navbar.css';
import logo from '../../Images/icon.svg'


const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Find My Doctor Logo" />
                <span>FIND <span className="highlight">MY</span> DOCTOR</span>
            </div>
            <ul className="navbar-links">
                <li><a href="/">HOME</a></li>
                <li><a href="/service">SERVICE</a></li>
                <li><a href="/notification">NOTIFICATION</a></li>
            </ul>
            <div className="navbar-user-icon">
                <a href="/profile">
                    <i className="fa fa-user"></i>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
