import React from 'react';
import './Footer.css';
import logo from '../logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <div className="footer-logo-text">
              <h3>M.A.D.H.A.V.A.</h3>
              <p>Multi-domain Analytical Data Harvesting & Retrieval Augmented Generation Assistant</p>
            </div>
            <img className="animated-logo" src={logo} alt="M.A.D.H.A.V.A. Logo" />
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Core Features</h4>
          <ul>
            <li>Document Retrieval</li>
            <li>LLM Integration</li>
            <li>Contextual Generation</li>
            <li>Data Analytics</li>
            <li>Custom Reporting</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;