import React from 'react';
import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`side-menu-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      
      {/* Side Menu */}
      <div className={`side-menu ${isOpen ? 'active' : ''}`}>
        <div className="side-menu-header">
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="side-menu-content">
          {/* User Section */}
          <div className="menu-section">
            <h3>Account</h3>
            <ul>
              <li>
                <Link to="/profile">
                  <span className="icon">👤</span>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/signin">
                  <span className="icon">🔑</span>
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup">
                  <span className="icon">✨</span>
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* History Section */}
          <div className="menu-section">
            <h3>Activity</h3>
            <ul>
              <li>
                <Link to="/history">
                  <span className="icon">📜</span>
                  Query History
                </Link>
              </li>
              <li>
                <Link to="/saved">
                  <span className="icon">⭐</span>
                  Saved Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Settings Section */}
          <div className="menu-section">
            <h3>Preferences</h3>
            <ul>
              <li>
                <Link to="/settings">
                  <span className="icon">⚙️</span>
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/customization">
                  <span className="icon">🎨</span>
                  Customization
                </Link>
              </li>
            </ul>
          </div>

          {/* Integrations Section */}
          <div className="menu-section">
            <h3>Integrations</h3>
            <ul>
              <li>
                <Link to="/integrations/excel">
                  <span className="icon">📑</span>
                  Excel Integration
                </Link>
              </li>
              <li>
                <Link to="/integrations/docs">
                  <span className="icon">📄</span>
                  Google Docs
                </Link>
              </li>
              <li>
                <Link to="/integrations/slack">
                  <span className="icon">#</span>
                  Slack
                </Link>
              </li>
              <li>
                <Link to="/integrations/github">
                  <span className="icon"><svg viewBox="0 0 16 16" width="16" height="16" style={{fill: 'currentColor'}}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg></span>
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu; 