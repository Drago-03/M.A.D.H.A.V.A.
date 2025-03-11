import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileMenu.css';

const ProfileMenu = ({ user, onClose, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleItemClick = useCallback((route) => (e) => {
    e.preventDefault();
    setIsOpen(false);
    onClose?.();
    navigate(route);
  }, [navigate, onClose]);

  const handleLogout = useCallback((e) => {
    e.preventDefault();
    onLogout();
    setIsOpen(false);
    navigate('/');
  }, [navigate, onLogout]);

  const toggleMenu = useCallback((e) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button className="profile-button" onClick={toggleMenu}>
        <div className="profile-avatar">
          <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
        </div>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-info">
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <div className="profile-menu-items">
            <button 
              className="menu-item"
              onClick={handleItemClick('/profile/settings')}
            >
              <span className="icon">👤</span>
              Profile Settings
            </button>
            <button 
              className="menu-item"
              onClick={handleItemClick('/account/settings')}
            >
              <span className="icon">⚙️</span>
              Account Settings
            </button>
            <button 
              className="menu-item"
              onClick={handleItemClick('/notifications')}
            >
              <span className="icon">🔔</span>
              Notifications
            </button>
            <button 
              className="menu-item"
              onClick={handleItemClick('/analytics')}
            >
              <span className="icon">📊</span>
              Analytics
            </button>
            <div className="menu-divider"></div>
            <button 
              className="menu-item"
              onClick={handleItemClick('/support')}
            >
              <span className="icon">❓</span>
              Help & Support
            </button>
            <button 
              className="menu-item logout"
              onClick={handleLogout}
            >
              <span className="icon">🚪</span>
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProfileMenu); 