import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const ProfileSettings = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <section className="profile-section">
      <h2>Profile Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself"
          />
        </div>
        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </section>
  );
};

const AccountSettings = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: user?.preferences?.twoFactorEnabled || false,
    emailNotifications: user?.preferences?.emailNotifications || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    onSave(formData);
  };

  return (
    <section className="profile-section">
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter current password"
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
          />
        </div>
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={formData.twoFactorEnabled}
              onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
            />
            Enable Two-Factor Authentication
          </label>
        </div>
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
            />
            Enable Email Notifications
          </label>
        </div>
        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </section>
  );
};

const NotificationSettings = ({ user, onSave }) => {
  const [settings, setSettings] = useState({
    emailUpdates: user?.preferences?.emailUpdates || false,
    queryAlerts: user?.preferences?.queryAlerts || false,
    weeklyDigest: user?.preferences?.weeklyDigest || false,
    domainUpdates: user?.preferences?.domainUpdates || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <section className="profile-section">
      <h2>Notification Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div className="notification-options">
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.emailUpdates}
                onChange={(e) => setSettings({ ...settings, emailUpdates: e.target.checked })}
              />
              Email Updates
            </label>
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.queryAlerts}
                onChange={(e) => setSettings({ ...settings, queryAlerts: e.target.checked })}
              />
              Query Alerts
            </label>
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
              />
              Weekly Digest
            </label>
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.domainUpdates}
                onChange={(e) => setSettings({ ...settings, domainUpdates: e.target.checked })}
              />
              Domain Updates
            </label>
          </div>
        </div>
        <button type="submit" className="save-button">Save Preferences</button>
      </form>
    </section>
  );
};

const Analytics = ({ user }) => {
  const stats = user?.stats || {
    totalQueries: 0,
    savedItems: 0,
    domainsUsed: 0,
    queryHistory: [
      {
        id: 1,
        text: "What are the current market trends in renewable energy?",
        domain: "finance",
        date: "2024-03-10T10:30:00Z",
        icon: "💰"
      },
      {
        id: 2,
        text: "Analyze the latest healthcare policy changes",
        domain: "healthcare",
        date: "2024-03-09T15:45:00Z",
        icon: "🏥"
      },
      {
        id: 3,
        text: "Review this contract for potential risks",
        domain: "legal",
        date: "2024-03-08T09:20:00Z",
        icon: "⚖️"
      }
    ]
  };

  return (
    <section className="analytics-section">
      <h2>Analytics Overview</h2>
      <div className="analytics-grid">
        <div className="stat-card">
          <h3>Total Queries</h3>
          <p className="stat-number">{stats.totalQueries}</p>
        </div>
        <div className="stat-card">
          <h3>Saved Items</h3>
          <p className="stat-number">{stats.savedItems}</p>
        </div>
        <div className="stat-card">
          <h3>Domains Used</h3>
          <p className="stat-number">{stats.domainsUsed}</p>
        </div>
      </div>

      <div className="query-history">
        <h3>Recent Queries</h3>
        <div className="history-list">
          {stats.queryHistory.map((query) => (
            <div key={query.id} className="history-item">
              <p className="query-text">{query.text}</p>
              <div className="query-meta">
                <div className="query-domain">
                  <span>{query.icon}</span>
                  <span>{query.domain}</span>
                </div>
                <span className="query-date">
                  {new Date(query.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Support = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('faq');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Support message sent! We will get back to you soon.');
    setMessage('');
  };

  return (
    <section className="profile-section">
      <h2>Help & Documentation</h2>
      
      <div className="documentation-tabs">
        <button 
          className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          FAQs
        </button>
        <button 
          className={`tab-button ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          User Guide
        </button>
        <button 
          className={`tab-button ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          API Documentation
        </button>
        <button 
          className={`tab-button ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => setActiveTab('support')}
        >
          Support
        </button>
      </div>

      <div className="documentation-content">
        {activeTab === 'faq' && (
          <div className="faq-section">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-list">
              <div className="faq-item">
                <h4>How do I get started?</h4>
                <p>Select a domain from the home page and start asking questions! Each domain is specialized for specific types of queries.</p>
              </div>
              <div className="faq-item">
                <h4>How does the AI work?</h4>
                <p>Our AI uses advanced language models (including Google's Gemini and custom-trained models) to analyze your queries and provide accurate responses with domain-specific context.</p>
              </div>
              <div className="faq-item">
                <h4>What domains are supported?</h4>
                <p>We currently support:</p>
                <ul>
                  <li>💰 Finance: Market analysis, investment insights, financial planning</li>
                  <li>🏥 Healthcare: Medical research, clinical analysis, health information</li>
                  <li>⚖️ Legal: Case analysis, compliance, contract review</li>
                  <li>💻 Code Assistant: Debugging, code review, optimization</li>
                  <li>📰 News: Real-time analysis, trend detection, fact-checking</li>
                  <li>🛍️ E-commerce: Market trends, consumer behavior, pricing analysis</li>
                </ul>
              </div>
              <div className="faq-item">
                <h4>How accurate are the responses?</h4>
                <p>Our AI models are trained on verified data sources and use real-time validation. However, always verify critical information from official sources.</p>
              </div>
              <div className="faq-item">
                <h4>Can I save my queries?</h4>
                <p>Yes! All queries are automatically saved in your history. You can also bookmark important responses for quick reference.</p>
              </div>
              <div className="faq-item">
                <h4>Is my data secure?</h4>
                <p>We employ industry-standard encryption and security measures. Your data is never shared without consent and is stored securely.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="guide-section">
            <h3>User Guide</h3>
            <div className="guide-content">
              <section className="guide-item">
                <h4>Getting Started</h4>
                <ol>
                  <li>Create an account or sign in</li>
                  <li>Select your primary domain of interest</li>
                  <li>Configure your notification preferences</li>
                  <li>Start asking questions!</li>
                </ol>
              </section>
              
              <section className="guide-item">
                <h4>Best Practices</h4>
                <ul>
                  <li>Be specific in your queries for better results</li>
                  <li>Use domain-specific terminology when possible</li>
                  <li>Check the confidence score of responses</li>
                  <li>Verify critical information from multiple sources</li>
                </ul>
              </section>

              <section className="guide-item">
                <h4>Advanced Features</h4>
                <ul>
                  <li>Cross-domain queries for comprehensive analysis</li>
                  <li>Custom data integration</li>
                  <li>API access for automation</li>
                  <li>Batch processing capabilities</li>
                </ul>
              </section>

              <section className="guide-item">
                <h4>Keyboard Shortcuts</h4>
                <div className="shortcuts-grid">
                  <div><kbd>Ctrl</kbd> + <kbd>K</kbd> Quick search</div>
                  <div><kbd>Ctrl</kbd> + <kbd>S</kbd> Save response</div>
                  <div><kbd>Ctrl</kbd> + <kbd>D</kbd> Toggle dark mode</div>
                  <div><kbd>Esc</kbd> Close modals</div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="api-section">
            <h3>API Documentation</h3>
            <div className="api-content">
              <section className="api-item">
                <h4>Authentication</h4>
                <pre><code>{`
// API Key Authentication
Authorization: Bearer YOUR_API_KEY

// Example Request
curl -X POST https://api.madhava.ai/v1/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Your question here",
    "domain": "finance"
  }'
                `}</code></pre>
              </section>

              <section className="api-item">
                <h4>Endpoints</h4>
                <ul className="api-endpoints">
                  <li>
                    <strong>POST /api/query</strong>
                    <p>Submit a query to any domain</p>
                  </li>
                  <li>
                    <strong>GET /api/history</strong>
                    <p>Retrieve query history</p>
                  </li>
                  <li>
                    <strong>POST /api/analyze</strong>
                    <p>Deep analysis of documents</p>
                  </li>
                </ul>
              </section>

              <section className="api-item">
                <h4>Rate Limits</h4>
                <ul>
                  <li>Free tier: 100 requests/day</li>
                  <li>Pro tier: 1000 requests/day</li>
                  <li>Enterprise: Custom limits</li>
                </ul>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="support-section">
            <h3>Contact Support</h3>
            <div className="support-options">
              <div className="support-channels">
                <h4>Support Channels</h4>
                <ul>
                  <li>📧 Email: support@madhava.ai</li>
                  <li>💬 Live Chat: Available 24/7</li>
                  <li>📞 Phone: +1 (555) 123-4567</li>
                  <li>📚 Knowledge Base: docs.madhava.ai</li>
                </ul>
              </div>
              
              <div className="contact-form">
                <h4>Send us a message</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your issue or question..."
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="submit-button">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Profile = ({ user, section }) => {
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSave = (data) => {
    // Here you would typically make an API call to update the user data
    console.log('Saving data:', data);
    alert('Changes saved successfully!');
  };

  const renderSection = () => {
    switch (section) {
      case 'settings':
        return <ProfileSettings user={user} onSave={handleSave} />;
      case 'account':
        return <AccountSettings user={user} onSave={handleSave} />;
      case 'notifications':
        return <NotificationSettings user={user} onSave={handleSave} />;
      case 'analytics':
        return <Analytics user={user} />;
      case 'support':
        return <Support />;
      default:
        return <ProfileSettings user={user} onSave={handleSave} />;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button 
          className="home-button"
          onClick={() => navigate('/')}
        >
          <span className="home-icon">🏠</span>
          Home
        </button>
        <div className="profile-avatar">
          <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
        </div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
      {renderSection()}
    </div>
  );
};

export default Profile; 