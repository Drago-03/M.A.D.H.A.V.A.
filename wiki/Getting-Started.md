# Getting Started Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- Python (v3.11 or higher)
- Git
- MongoDB (v6.0 or higher)
- Redis (v7.0 or higher)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/project.git
cd project
```

### 2. Backend Setup

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

- `MONGODB_URI`: Your MongoDB connection string
- `REDIS_URL`: Your Redis connection string
- `GEMINI_API_KEY`: Your Google Gemini API key

4. Start the backend server:

```bash
python main.py
```

### 3. Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_WS_URL`: WebSocket URL

4. Start the development server:

```bash
npm start
```

## Configuration

### Database Configuration

1. MongoDB:

- Create a new database
- Set up collections for:
  - Users
  - Queries
  - Analytics
  - Documents

2. Redis:

- Configure persistence
- Set up key prefixes
- Configure memory limits

### API Keys

1. Google Gemini:

- Create an account at Google Cloud Console
- Enable Gemini API
- Generate API key
- Add key to `.env`

## Usage

### 1. Accessing the Application

- Frontend: <http://localhost:8001>
- Backend API: <http://localhost:8000>
- API Documentation: <http://localhost:8000/docs>

### 2. Basic Features

1. **Domain Selection**
   - Choose from available domains
   - Each domain has specific features

2. **Query Interface**
   - Enter your query
   - View AI-generated responses
   - Access domain-specific insights

3. **History**
   - View past queries
   - Filter by domain
   - Export history

### 3. Advanced Features

1. **Code Assistant**
   - AI debugging
   - Code review
   - Performance optimization

2. **Legal Analysis**
   - Document analysis
   - Case research
   - Compliance checking

3. **Finance**
   - Market analysis
   - Investment insights
   - Risk assessment

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check MongoDB connection
   - Verify Redis is running
   - Confirm API keys are valid

2. **Performance Issues**
   - Check server logs
   - Monitor Redis memory
   - Review MongoDB indexes

3. **API Rate Limits**
   - Monitor Gemini API usage
   - Implement caching
   - Use rate limiting

## Next Steps

1. Read the [Architecture Overview](./Architecture.md)
2. Review [API Documentation](./API-Documentation.md)
3. Check [Contributing Guidelines](./Contributing.md)
4. Join the community discussions
