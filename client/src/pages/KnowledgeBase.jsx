import React, { useState } from 'react';

function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState('sources');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock data for demonstration
  const sources = [
    { id: 1, name: 'Company Documentation', category: 'Internal', documents: 245, lastUpdated: '2023-06-10', status: 'Active' },
    { id: 2, name: 'Wikipedia Articles', category: 'External', documents: 1872, lastUpdated: '2023-06-12', status: 'Active' },
    { id: 3, name: 'Scientific Papers', category: 'Research', documents: 538, lastUpdated: '2023-06-01', status: 'Active' },
    { id: 4, name: 'Product Manuals', category: 'Internal', documents: 124, lastUpdated: '2023-05-28', status: 'Active' },
    { id: 5, name: 'Technical Blogs', category: 'External', documents: 397, lastUpdated: '2023-06-08', status: 'Inactive' },
    { id: 6, name: 'Customer Support Tickets', category: 'Internal', documents: 712, lastUpdated: '2023-06-14', status: 'Active' },
    { id: 7, name: 'Programming Tutorials', category: 'External', documents: 256, lastUpdated: '2023-05-30', status: 'Active' },
  ];

  const categories = ['Internal', 'External', 'Research'];
  
  // Filter sources based on search term and category
  const filteredSources = sources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || source.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="knowledge-base-container">
      <h1>Knowledge Base Management</h1>
      
      <div className="knowledge-base-tabs">
        <button 
          className={`tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => setActiveTab('sources')}
        >
          Sources
        </button>
        <button 
          className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
        <button 
          className={`tab-btn ${activeTab === 'embedding' ? 'active' : ''}`}
          onClick={() => setActiveTab('embedding')}
        >
          Embedding Models
        </button>
        <button 
          className={`tab-btn ${activeTab === 'retrieval' ? 'active' : ''}`}
          onClick={() => setActiveTab('retrieval')}
        >
          Retrieval Settings
        </button>
      </div>
      
      <div className="knowledge-content">
        {activeTab === 'sources' && (
          <div className="sources-section">
            <div className="source-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn">🔍</button>
              </div>
              
              <div className="filter-container">
                <label>Category:</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <button className="add-source-btn">Add Source</button>
            </div>
            
            <div className="sources-grid">
              {filteredSources.map(source => (
                <div key={source.id} className="source-card">
                  <div className="source-header">
                    <h3>{source.name}</h3>
                    <span className={`status-badge ${source.status.toLowerCase()}`}>
                      {source.status}
                    </span>
                  </div>
                  <div className="source-info">
                    <p><span>Category:</span> {source.category}</p>
                    <p><span>Documents:</span> {source.documents}</p>
                    <p><span>Last Updated:</span> {source.lastUpdated}</p>
                  </div>
                  <div className="card-actions">
                    <button className="action-btn">Update</button>
                    <button className="action-btn">Configure</button>
                    <button className="action-btn danger">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredSources.length === 0 && (
              <div className="no-results">
                No sources found matching your search criteria.
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="documents-section">
            <h2>Documents Management</h2>
            <p>Upload, manage, and index documents for your knowledge base.</p>
            {/* Document management interface would go here */}
            <div className="placeholder-ui">
              <p>Document management interface placeholder</p>
            </div>
          </div>
        )}
        
        {activeTab === 'embedding' && (
          <div className="embedding-section">
            <h2>Embedding Models</h2>
            <p>Configure and manage embedding models for vector representation of your documents.</p>
            {/* Embedding models interface would go here */}
            <div className="placeholder-ui">
              <p>Embedding models configuration placeholder</p>
            </div>
          </div>
        )}
        
        {activeTab === 'retrieval' && (
          <div className="retrieval-section">
            <h2>Retrieval Settings</h2>
            <p>Configure retrieval parameters such as top-k, similarity thresholds, and reranking.</p>
            {/* Retrieval settings interface would go here */}
            <div className="placeholder-ui">
              <p>Retrieval settings configuration placeholder</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KnowledgeBase;
