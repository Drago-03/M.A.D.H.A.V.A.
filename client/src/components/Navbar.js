import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">M.A.D.H.A.V.A.</Link>
      </div>
      <div className="navbar-links">
        <Link to="/finance" className={isActive('/finance') ? 'active' : ''}>
          Finance
        </Link>
        <Link to="/healthcare" className={isActive('/healthcare') ? 'active' : ''}>
          Healthcare
        </Link>
        <Link to="/legal" className={isActive('/legal') ? 'active' : ''}>
          Legal
        </Link>
        <Link to="/news" className={isActive('/news') ? 'active' : ''}>
          News
        </Link>
        <Link to="/ecommerce" className={isActive('/ecommerce') ? 'active' : ''}>
          E-commerce
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 