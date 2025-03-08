import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DomainPage from './pages/DomainPage';
import logo from './logo.png';
import './App.css';
import SideMenu from './components/SideMenu';

// Icons (you can replace these with actual icons)
const icons = {
  finance: '💰',
  healthcare: '🏥',
  legal: '⚖️',
  'code-assistant': '💻',
  news: '📰',
  ecommerce: '🛍️'
};

const domainDescriptions = {
  finance: 'Analyze financial data, market trends, and investment opportunities with AI-powered insights.',
  healthcare: 'Access medical information, research, and healthcare analytics with advanced natural language processing.',
  legal: 'Navigate legal documents, cases, and regulations with intelligent document analysis.',
  'code-assistant': 'Get intelligent debugging assistance, code reviews, and optimization suggestions powered by AI.',
  news: 'Stay updated with real-time news analysis and trend detection across multiple sources.',
  ecommerce: 'Track market trends, analyze consumer behavior, and optimize e-commerce operations.'
};

const domainDisplayNames = {
  finance: 'Finance',
  healthcare: 'Healthcare',
  legal: 'Legal',
  'code-assistant': 'Code Assistant',
  news: 'News',
  ecommerce: 'E-commerce'
};

function App() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <button className="menu-toggle" onClick={toggleSideMenu}>
            ☰
          </button>
          <div className="header-logo">
            <img src={logo} alt="M.A.D.H.A.V.A. Logo" />
          </div>
        </header>
        <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
        <div className="content">
          <Routes>
            <Route path="/" element={
              <div className="home">
                <main className="domain-grid">
                  {Object.entries(icons).map(([domain, icon]) => (
                    <div key={domain} className="domain-card" onClick={() => window.location.href = `/${domain}`}>
                      <div className="domain-icon">{icon}</div>
                      <h2>{domainDisplayNames[domain]}</h2>
                      <p>{domainDescriptions[domain]}</p>
                      {domain === 'code-assistant' && (
                        <div className="code-features">
                          <ul>
                            <li>🔍 AI Debugging</li>
                            <li>📝 Code Review</li>
                            <li>🔄 Refactoring</li>
                            <li>⚡ Performance Optimization</li>
                            <li>🔒 Security Analysis</li>
                          </ul>
                        </div>
                      )}
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
                    domain={domainDisplayNames[domain]}
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
