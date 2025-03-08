import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DomainPage from './pages/DomainPage';
import logo from './logo.png';
import './App.css';

// Icons (you can replace these with actual icons)
const icons = {
  finance: '💰',
  healthcare: '🏥',
  legal: '⚖️',
  news: '📰',
  ecommerce: '🛍️'
};

const domainDescriptions = {
  finance: 'Analyze financial data, market trends, and investment opportunities with AI-powered insights.',
  healthcare: 'Access medical information, research, and healthcare analytics with advanced natural language processing.',
  legal: 'Navigate legal documents, cases, and regulations with intelligent document analysis.',
  news: 'Stay updated with real-time news analysis and trend detection across multiple sources.',
  ecommerce: 'Track market trends, analyze consumer behavior, and optimize e-commerce operations.'
};

function App() {
  return (
    <Router>
      <div className="App">
        <div className="floating-logo">
          <img src={logo} alt="M.A.D.H.A.V.A. Logo" />
        </div>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={
              <div className="home">
                <header className="App-header">
                  <h1>M.A.D.H.A.V.A.</h1>
                  <p>Multi-domain Analytical Data Harvesting & Automated Verification Assistant</p>
                </header>
                <main className="domain-grid">
                  {Object.entries(icons).map(([domain, icon]) => (
                    <div key={domain} className="domain-card" onClick={() => window.location.href = `/${domain}`}>
                      <div className="domain-icon">{icon}</div>
                      <h2>{domain.charAt(0).toUpperCase() + domain.slice(1)}</h2>
                      <p>{domainDescriptions[domain]}</p>
                    </div>
                  ))}
                </main>
              </div>
            } />
            
            {Object.entries(icons).map(([domain, icon]) => (
              <Route
                key={domain}
                path={`/${domain}`}
                element={
                  <DomainPage
                    domain={domain.charAt(0).toUpperCase() + domain.slice(1)}
                    description={domainDescriptions[domain]}
                    icon={icon}
                  />
                }
              />
            ))}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
