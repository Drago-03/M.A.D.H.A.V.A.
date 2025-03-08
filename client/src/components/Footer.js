import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>M.A.D.H.A.V.A.</h3>
          <p>Multi-domain Analytical Data Harvesting & Automated Verification Assistant</p>
          <div className="social-links">
            <a href="https://github.com/madhava-ai" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://discord.gg/madhava" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Domain Analysis</h4>
          <ul>
            <li><a href="/finance">Finance</a></li>
            <li><a href="/healthcare">Healthcare</a></li>
            <li><a href="/legal">Legal</a></li>
            <li><a href="/news">News</a></li>
            <li><a href="/ecommerce">E-commerce</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Code Assistance</h4>
          <ul>
            <li><a href="/code/debug">AI Debugging</a></li>
            <li><a href="/code/review">Code Review</a></li>
            <li><a href="/code/refactor">Refactoring</a></li>
            <li><a href="/code/optimize">Performance Optimization</a></li>
            <li><a href="/code/security">Security Analysis</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="/docs">Documentation</a></li>
            <li><a href="/api">API Reference</a></li>
            <li><a href="/examples">Code Examples</a></li>
            <li><a href="/tutorials">Tutorials</a></li>
            <li><a href="/blog">Tech Blog</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/community">Community</a></li>
            <li><a href="/status">System Status</a></li>
            <li>Email: support@madhava.ai</li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/enterprise">Enterprise</a></li>
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