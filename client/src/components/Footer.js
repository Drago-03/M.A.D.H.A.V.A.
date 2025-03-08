import React from 'react';
import './Footer.css';
import logo from '../logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="M.A.D.H.A.V.A. Logo" />
          </div>
          <h3>M.A.D.H.A.V.A.</h3>
          <p>Multi-domain Analytical Data Harvesting & Automated Verification Assistant</p>
        </div>
        <div className="footer-section">
          <h4>Finance</h4>
          <ul>
            <li>Market Analysis</li>
            <li>Investment Insights</li>
            <li>Risk Assessment</li>
            <li>Portfolio Management</li>
            <li>Financial Planning</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Healthcare</h4>
          <ul>
            <li>Medical Research</li>
            <li>Clinical Analysis</li>
            <li>Patient Care</li>
            <li>Health Monitoring</li>
            <li>Treatment Plans</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li>Case Analysis</li>
            <li>Legal Research</li>
            <li>Compliance</li>
            <li>Document Review</li>
            <li>Risk Management</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Code Assistant</h4>
          <ul>
            <li>AI Debugging</li>
            <li>Code Review</li>
            <li>Refactoring</li>
            <li>Performance Optimization</li>
            <li>Security Analysis</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>News</h4>
          <ul>
            <li>Trend Analysis</li>
            <li>Real-time Updates</li>
            <li>Event Tracking</li>
            <li>Source Verification</li>
            <li>Impact Assessment</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>E-commerce</h4>
          <ul>
            <li>Market Trends</li>
            <li>Consumer Behavior</li>
            <li>Sales Analytics</li>
            <li>Product Analysis</li>
            <li>Performance Metrics</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} M.A.D.H.A.V.A. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 