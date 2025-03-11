import React, { useState } from 'react';

function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'M.A.D.H.A.V.A.',
    defaultLanguage: 'English',
    maxTokens: 2048,
    temperature: 0.7,
    logLevel: 'info',
  });
  
  const [ragSettings, setRagSettings] = useState({
    retrievalTopK: 5,
    minRelevanceScore: 0.75,
    maxChunkSize: 1000,
    chunkOverlap: 200,
    useReranking: true,
    hybridSearch: true,
  });
  
  const [evaluationSettings, setEvaluationSettings] = useState({
    enableAutoEvaluation: true,
    evaluationFrequency: 'daily',
    factualAccuracyWeight: 0.6,
    relevanceWeight: 0.3,
    coherenceWeight: 0.1,
    storeEvaluationResults: true,
    humanFeedbackCollection: true,
  });
  
  const [modelSettings, setModelSettings] = useState({
    primaryModel: 'gpt-4',
    fallbackModel: 'gpt-3.5-turbo',
    embeddingModel: 'text-embedding-ada-002',
    useCache: true,
    cacheExpiration: '24',
    streamResponses: true,
  });

  return (
    <div className="settings-container">
      <h1>System Settings</h1>
      
      <div className="settings-tabs">
        <button 
          className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rag' ? 'active' : ''}`}
          onClick={() => setActiveTab('rag')}
        >
          RAG Configuration
        </button>
        <button 
          className={`tab-btn ${activeTab === 'evaluation' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluation')}
        >
          Evaluation
        </button>
        <button 
          className={`tab-btn ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          Models
        </button>
        <button 
          className={`tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          Integrations
        </button>
      </div>
      
      <div className="settings-content">
        {activeTab === 'general' && (
          <div className="settings-section">
            <h2>General Settings</h2>
            
            <div className="settings-form">
              <div className="form-group">
                <label>System Name:</label>
                <input 
                  type="text" 
                  value={generalSettings.systemName}
                  onChange={(e) => setGeneralSettings({...generalSettings, systemName: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Default Language:</label>
                <select 
                  value={generalSettings.defaultLanguage}
                  onChange={(e) => setGeneralSettings({...generalSettings, defaultLanguage: e.target.value})}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Max Tokens:</label>
                <input 
                  type="number" 
                  value={generalSettings.maxTokens}
                  onChange={(e) => setGeneralSettings({...generalSettings, maxTokens: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Temperature:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={generalSettings.temperature}
                  onChange={(e) => setGeneralSettings({...generalSettings, temperature: parseFloat(e.target.value)})}
                />
                <span>{generalSettings.temperature}</span>
              </div>
              
              <div className="form-group">
                <label>Log Level:</label>
                <select 
                  value={generalSettings.logLevel}
                  onChange={(e) => setGeneralSettings({...generalSettings, logLevel: e.target.value})}
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
            
            <div className="button-group">
              <button className="save-btn">Save Changes</button>
              <button className="reset-btn">Reset to Default</button>
            </div>
          </div>
        )}
        
        {activeTab === 'rag' && (
          <div className="settings-section">
            <h2>RAG Configuration</h2>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Top-K Retrieval:</label>
                <input 
                  type="number" 
                  value={ragSettings.retrievalTopK}
                  onChange={(e) => setRagSettings({...ragSettings, retrievalTopK: e.target.value})}
                />
                <small>Number of documents to retrieve for each query</small>
              </div>
              
              <div className="form-group">
                <label>Minimum Relevance Score:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={ragSettings.minRelevanceScore}
                  onChange={(e) => setRagSettings({...ragSettings, minRelevanceScore: parseFloat(e.target.value)})}
                />
                <span>{ragSettings.minRelevanceScore}</span>
                <small>Minimum similarity score for retrieved documents</small>
              </div>
              
              <div className="form-group">
                <label>Max Chunk Size:</label>
                <input 
                  type="number" 
                  value={ragSettings.maxChunkSize}
                  onChange={(e) => setRagSettings({...ragSettings, maxChunkSize: e.target.value})}
                />
                <small>Maximum number of tokens per document chunk</small>
              </div>
              
              <div className="form-group">
                <label>Chunk Overlap:</label>
                <input 
                  type="number" 
                  value={ragSettings.chunkOverlap}
                  onChange={(e) => setRagSettings({...ragSettings, chunkOverlap: e.target.value})}
                />
                <small>Number of overlapping tokens between chunks</small>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="useReranking"
                  checked={ragSettings.useReranking}
                  onChange={(e) => setRagSettings({...ragSettings, useReranking: e.target.checked})}
                />
                <label htmlFor="useReranking">Use Reranking for Retrieved Documents</label>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="hybridSearch"
                  checked={ragSettings.hybridSearch}
                  onChange={(e) => setRagSettings({...ragSettings, hybridSearch: e.target.checked})}
                />
                <label htmlFor="hybridSearch">Enable Hybrid Search (Vector + Keyword)</label>
              </div>
            </div>
            
            <div className="button-group">
              <button className="save-btn">Save Changes</button>
              <button className="reset-btn">Reset to Default</button>
            </div>
          </div>
        )}
        
        {activeTab === 'evaluation' && (
          <div className="settings-section">
            <h2>Evaluation Settings</h2>
            
            <div className="settings-form">
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="enableAutoEvaluation"
                  checked={evaluationSettings.enableAutoEvaluation}
                  onChange={(e) => setEvaluationSettings({...evaluationSettings, enableAutoEvaluation: e.target.checked})}
                />
                <label htmlFor="enableAutoEvaluation">Enable Automatic Evaluation</label>
              </div>
              
              <div className="form-group">
                <label>Evaluation Frequency:</label>
                <select 
                  value={evaluationSettings.evaluationFrequency}
                  onChange={(e) => setEvaluationSettings({...evaluationSettings, evaluationFrequency: e.target.value})}
                  disabled={!evaluationSettings.enableAutoEvaluation}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Factual Accuracy Weight:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={evaluationSettings.factualAccuracyWeight}
                  onChange={(e) => setEvaluationSettings({...evaluationSettings, factualAccuracyWeight: parseFloat(e.target.value)})}
                />
                <span>{evaluationSettings.factualAccuracyWeight}</span>
              </div>
              
              <div className="form-group">
                <label>Relevance Weight:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={evaluationSettings.relevanceWeight}
                  onChange={(e) => setEvaluationSettings({...evaluationSettings, relevanceWeight: parseFloat(e.target.value)})}
                />
                <span>{evaluationSettings.relevanceWeight}</span>
              </div>
              
              <div className="form-group">
                <label>Coherence Weight:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={evaluationSettings.coherenceWeight}
                  onChange={(e) => setEvaluationSettings({...evaluationSettings, coherenceWeight: parseFloat(e.target.value)})}
                />
                <span>{evaluationSettings.coherenceWeight}</span>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="storeEvaluationResults"
                  checked={evaluationSettings.storeEvaluationResults}
                  onChange={(e) => setEvaluationSettings({...evaluationSettings, storeEvaluationResults: e.target.checked})}
                />
                <label htmlFor="storeEvaluationResults">Store Evaluation Results</label>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="humanFeedbackCollection"
                  checked={evaluationSettings.humanFeedbackCollection}
                  onChange={(e) => setEvaluationSettings({...evaluationSettings, humanFeedbackCollection: e.target.checked})}
                />
                <label htmlFor="humanFeedbackCollection">Collect Human Feedback</label>
              </div>
            </div>
            
            <div className="button-group">
              <button className="save-btn">Save Changes</button>
              <button className="reset-btn">Reset to Default</button>
            </div>
          </div>
        )}
        
        {activeTab === 'models' && (
          <div className="settings-section">
            <h2>Model Settings</h2>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Primary LLM:</label>
                <select 
                  value={modelSettings.primaryModel}
                  onChange={(e) => setModelSettings({...modelSettings, primaryModel: e.target.value})}
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-2">Claude 2</option>
                  <option value="llama-2">Llama 2</option>
                  <option value="mixtral">Mixtral</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Fallback LLM:</label>
                <select 
                  value={modelSettings.fallbackModel}
                  onChange={(e) => setModelSettings({...modelSettings, fallbackModel: e.target.value})}
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude-2">Claude 2</option>
                  <option value="llama-2">Llama 2</option>
                  <option value="mixtral">Mixtral</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Embedding Model:</label>
                <select 
                  value={modelSettings.embeddingModel}
                  onChange={(e) => setModelSettings({...modelSettings, embeddingModel: e.target.value})}
                >
                  <option value="text-embedding-ada-002">text-embedding-ada-002</option>
                  <option value="text-embedding-3-large">text-embedding-3-large</option>
                  <option value="sentence-transformers">Sentence Transformers</option>
                  <option value="e5-large-v2">E5-large-v2</option>
                </select>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="useCache"
                  checked={modelSettings.useCache}
                  onChange={(e) => setModelSettings({...modelSettings, useCache: e.target.checked})}
                />
                <label htmlFor="useCache">Use Response Caching</label>
              </div>
              
              <div className="form-group">
                <label>Cache Expiration (hours):</label>
                <input 
                  type="number" 
                  value={modelSettings.cacheExpiration}
                  onChange={(e) => setModelSettings({...modelSettings, cacheExpiration: e.target.value})}
                  disabled={!modelSettings.useCache}
                />
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="streamResponses"
                  checked={modelSettings.streamResponses}
                  onChange={(e) => setModelSettings({...modelSettings, streamResponses: e.target.checked})}
                />
                <label htmlFor="streamResponses">Stream Responses</label>
              </div>
            </div>
            
            <div className="button-group">
              <button className="save-btn">Save Changes</button>
              <button className="reset-btn">Reset to Default</button>
            </div>
          </div>
        )}
        
        {activeTab === 'integrations' && (
          <div className="settings-section">
            <h2>Integrations</h2>
            <p>Configure integrations with external services and APIs.</p>
            {/* Integrations content would go here */}
            <div className="placeholder-ui">
              <p>API integrations configuration placeholder</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
