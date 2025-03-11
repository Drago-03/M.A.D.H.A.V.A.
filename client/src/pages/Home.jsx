import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to M.A.D.H.A.V.A.</h1>
      <p>Your Personal AI Assistant</p>
      <Link to="/query" className="cta-button">Start Query</Link>
      <style>{`
        .home {
          text-align: center;
          padding: 4rem 1rem;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }
        .cta-button {
          display: inline-block;
          padding: 1rem 2rem;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 1.2rem;
        }
        .cta-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default Home;
