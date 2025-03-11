import React, { useState } from 'react';
import './QueryInterface.css';

const QueryInterface = ({ domain }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Ensure you have a "proxy": "http://localhost:5000" setting in your package.json if needed
      const response = await fetch('/api/query', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          domain: domain.toLowerCase(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
      setError(`Failed to get response. ${error.message}`);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-interface">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask anything about ${domain}...`}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Ask'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {response && (
        <div className="response-section">
          <div className="answer">
            <h3>Answer:</h3>
            <p>{response.answer}</p>
          </div>
          
          {response.insights && (
            <div className="insights">
              <h3>Key Insights:</h3>
              <p>{response.insights}</p>
            </div>
          )}

          {response.context && response.context.length > 0 && (
            <div className="context">
              <h3>Context:</h3>
              <ul>
                {response.context.map((ctx, index) => (
                  <li key={index}>{ctx}</li>
                ))}
              </ul>
            </div>
          )}

          {response.metrics && (
            <div className="metrics">
              <h3>Metrics:</h3>
              <pre>{JSON.stringify(response.metrics, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QueryInterface; 