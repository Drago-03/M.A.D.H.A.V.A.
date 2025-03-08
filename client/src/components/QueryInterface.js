import React, { useState } from 'react';
import './QueryInterface.css';

const QueryInterface = ({ domain }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          domain: domain.toLowerCase(),
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
      setResponse({ error: 'Failed to get response' });
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
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Ask'}
          </button>
        </div>
      </form>

      {response && (
        <div className="response-section">
          <div className="answer">
            <h3>Answer:</h3>
            <p>{response.answer}</p>
          </div>
          
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