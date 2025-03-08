const API_BASE_URL = 'http://localhost:4000';

export const api = {
  async query(domain, queryText) {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: queryText,
        domain: domain.toLowerCase(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getAlerts(domain, severity) {
    const params = new URLSearchParams();
    if (domain) params.append('domain', domain);
    if (severity) params.append('severity', severity);

    const response = await fetch(`${API_BASE_URL}/alerts?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getSystemStatus() {
    const response = await fetch(`${API_BASE_URL}/status`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getDomainMetrics(domain) {
    const response = await fetch(`${API_BASE_URL}/metrics/${domain}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}; 