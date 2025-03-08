import React from 'react';
import QueryInterface from '../components/QueryInterface';
import './DomainPage.css';

const DomainPage = ({ domain, description, icon }) => {
  return (
    <div className="domain-page">
      <div className="domain-header">
        <div className="domain-icon">{icon}</div>
        <h1>{domain}</h1>
        <p>{description}</p>
      </div>
      <QueryInterface domain={domain} />
    </div>
  );
};

export default DomainPage; 