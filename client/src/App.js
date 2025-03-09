import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDarkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
        </svg>
      )}
    </button>
  );
};

function AppContent() {
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
        <ThemeToggle />
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

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
