import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { useTheme } from '../context/ThemeContext.jsx';
import './Navbar.css';

const Navbar = ({ onMenuClick, user, onAuthClick, onLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleProfileClick = () => {
    if (user) {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    } else {
      onAuthClick('signin');
    }
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark' : ''}`}>
      <div className="navbar-left">
        <button className="menu-button" onClick={onMenuClick}>
          <span className="menu-icon">☰</span>
        </button>
        <Link to="/" className="logo">
          M.A.D.H.A.V.A.
        </Link>
      </div>

      <div className="navbar-right">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {user ? (
          <div className="profile-section">
            <button className="profile-button" onClick={handleProfileClick}>
              <div className="avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </button>
            {isProfileMenuOpen && (
              <ProfileMenu 
                user={user}
                onClose={() => setIsProfileMenuOpen(false)}
                onLogout={onLogout}
              />
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button 
              className="auth-button signin" 
              onClick={() => onAuthClick('signin')}
            >
              Sign In
            </button>
            <button 
              className="auth-button signup" 
              onClick={() => onAuthClick('signup')}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 