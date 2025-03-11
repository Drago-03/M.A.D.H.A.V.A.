import React, { useState } from 'react';

function Dashboard() {
  // Mock data for demonstration
  const [timeRange, setTimeRange] = useState('week');
  
  const performanceMetrics = {
    accuracyScore: 94.2,
    hallucinations: 3.8,
    successfulQueries: 1243,
    failedQueries: 32,
    avgResponseTime: 1.2, // in seconds
    knowledgeBaseCoverage: 87.5,
  };
  
  const recentQueries = [
    { id: 1, query: "What is the capital of France?", accurateResponse: true, confidence: 98.2, timestamp: "2023-06-15 14:32:45" },
    { id: 2, query: "Explain quantum computing", accurateResponse: true, confidence: 91.7, timestamp: "2023-06-15 13:45:22" },
    { id: 3, query: "Who won the World Cup in 1990?", accurateResponse: true, confidence: 96.5, timestamp: "2023-06-15 11:23:11" },
    { id: 4, query: "What is the recipe for creating antimatter?", accurateResponse: false, confidence: 45.3, timestamp: "2023-06-15 10:17:33" },
    { id: 5, query: "How does BERT handle context in NLP?", accurateResponse: true, confidence: 94.8, timestamp: "2023-06-14 16:52:07" },
  ];

  const knowledgeSourceStats = [
    { source: "Wikipedia", queriesServed: 532, accuracy: 96.2 },
    { source: "Research Papers", queriesServed: 318, accuracy: 92.8 },
    { source: "Internal Documents", queriesServed: 247, accuracy: 97.1 },
    { source: "Technical Manuals", queriesServed: 178, accuracy: 95.3 },
  ];

  return (
    <div className="dashboard-container">
      <h1>M.A.D.H.A.V.A. Dashboard</h1>
      <p className="dashboard-subtitle">Monitoring and Analytics for Decreased Hallucinations and Advanced Validation Architecture</p>
      
      <div className="time-range-selector">
        <button 
          className={`time-btn ${timeRange === 'day' ? 'active' : ''}`} 
          onClick={() => setTimeRange('day')}
        >Today</button>
        <button 
          className={`time-btn ${timeRange === 'week' ? 'active' : ''}`} 
          onClick={() => setTimeRange('week')}
        >This Week</button>
        <button 
          className={`time-btn ${timeRange === 'month' ? 'active' : ''}`} 
          onClick={() => setTimeRange('month')}
        >This Month</button>
        <button 
          className={`time-btn ${timeRange === 'custom' ? 'active' : ''}`} 
          onClick={() => setTimeRange('custom')}
        >Custom Range</button>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Accuracy Score</h3>
          <div className="metric-value">{performanceMetrics.accuracyScore}%</div>
          <div className="trend positive">+2.3% from last {timeRange}</div>
        </div>
        
        <div className="metric-card">
          <h3>Hallucination Rate</h3>
          <div className="metric-value">{performanceMetrics.hallucinations}%</div>
          <div className="trend positive">-1.2% from last {timeRange}</div>
        </div>
        
        <div className="metric-card">
          <h3>Successful Queries</h3>
          <div className="metric-value">{performanceMetrics.successfulQueries}</div>
          <div className="trend positive">+18% from last {timeRange}</div>
        </div>
        
        <div className="metric-card">
          <h3>Knowledge Coverage</h3>
          <div className="metric-value">{performanceMetrics.knowledgeBaseCoverage}%</div>
          <div className="trend positive">+5.2% from last {timeRange}</div>
        </div>
      </div>
      
      <div className="dashboard-row">
        <div className="recent-queries">
          <h2>Recent Queries</h2>
          <table className="queries-table">
            <thead>
              <tr>
                <th>Query</th>
                <th>Result</th>
                <th>Confidence</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentQueries.map(query => (
                <tr key={query.id}>
                  <td>{query.query}</td>
                  <td>
                    <span className={`status-badge ${query.accurateResponse ? 'success' : 'failure'}`}>
                      {query.accurateResponse ? 'Accurate' : 'Hallucination'}
                    </span>
                  </td>
                  <td>{query.confidence}%</td>
                  <td>{query.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="see-all">
            <a href="#/query-history">See All Queries →</a>
          </div>
        </div>
        
        <div className="knowledge-sources">
          <h2>Knowledge Sources</h2>
          <div className="sources-list">
            {knowledgeSourceStats.map((source, index) => (
              <div key={index} className="source-item">
                <div className="source-name">{source.source}</div>
                <div className="source-stats">
                  <div>{source.queriesServed} queries</div>
                  <div>{source.accuracy}% accuracy</div>
                </div>
                <div className="source-bar">
                  <div 
                    className="source-fill" 
                    style={{ width: `${source.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="see-all">
            <a href="#/knowledge-base">Manage Knowledge Base →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
