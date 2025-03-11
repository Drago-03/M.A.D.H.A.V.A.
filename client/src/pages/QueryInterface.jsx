import React, { useState } from 'react';

function QueryInterface() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error processing your query');
    }
  };

  return (
    <div className="query-container">
      <h1>M.A.D.H.A.V.A. Query Interface</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query here..."
          rows="4"
        />
        <button type="submit">Submit Query</button>
      </form>
      {response && (
        <div className="response-container">
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
      <style>
        {`
          .query-container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 1rem;
          }
          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          textarea {
            padding: 0.5rem;
            font-size: 1rem;
            border-radius: 4px;
            border: 1px solid #ccc;
          }
          button {
            padding: 0.5rem 1rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0056b3;
          }
          .response-container {
            margin-top: 2rem;
            padding: 1rem;
            background-color: #f8f9fa;
            border-radius: 4px;
          }
        `}
      </style>
    </div>
  );
}

export default QueryInterface;