# API Documentation

## Base URL

```
Development: http://localhost:8000
Production: https://api.yourdomain.com
```

## Authentication

### JWT Authentication

All API endpoints require JWT authentication unless specified otherwise.

```http
Authorization: Bearer <your_jwt_token>
```

### API Key Authentication

Some endpoints require an API key for access.

```http
X-API-Key: <your_api_key>
```

## Endpoints

### Query Processing

#### Process Query

```http
POST /api/query
Content-Type: application/json
Authorization: Bearer <token>

{
  "query": "string",
  "domain": "string",
  "context": {
    "additional_info": "string",
    "preferences": {}
  }
}
```

Response:

```json
{
  "response": "string",
  "insights": "string",
  "metrics": {},
  "timestamp": "string"
}
```

#### Get Query History

```http
GET /api/queries
Authorization: Bearer <token>
```

Response:

```json
{
  "queries": [
    {
      "id": "string",
      "query": "string",
      "response": "string",
      "domain": "string",
      "timestamp": "string"
    }
  ]
}
```

### User Management

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

Response:

```json
{
  "user_id": "string",
  "email": "string",
  "token": "string"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

Response:

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

### Domain-Specific Endpoints

#### Legal Analysis

```http
POST /api/legal/analyze
Content-Type: application/json
Authorization: Bearer <token>

{
  "document": "string",
  "analysis_type": "string",
  "jurisdiction": "string"
}
```

Response:

```json
{
  "analysis": "string",
  "citations": [],
  "risk_factors": [],
  "recommendations": []
}
```

#### Code Review

```http
POST /api/code/review
Content-Type: application/json
Authorization: Bearer <token>

{
  "code": "string",
  "language": "string",
  "review_type": "string"
}
```

Response:

```json
{
  "review": "string",
  "issues": [],
  "suggestions": [],
  "metrics": {}
}
```

#### Financial Analysis

```http
POST /api/finance/analyze
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": "string",
  "analysis_type": "string",
  "parameters": {}
}
```

Response:

```json
{
  "analysis": "string",
  "metrics": {},
  "recommendations": [],
  "risks": []
}
```

### Analytics

#### Get Usage Statistics

```http
GET /api/analytics/usage
Authorization: Bearer <token>
```

Response:

```json
{
  "total_queries": "number",
  "queries_by_domain": {},
  "average_response_time": "number"
}
```

## WebSocket Endpoints

### Real-time Updates

```
WebSocket: ws://localhost:8000/ws
```

Connection Parameters:

```json
{
  "token": "string",
  "domain": "string"
}
```

Message Format:

```json
{
  "type": "string",
  "data": {},
  "timestamp": "string"
}
```

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

### Common Error Codes

- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

- Rate limit: 100 requests per minute
- Headers:

  ```http
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1640995200
  ```

## Pagination

Query Parameters:

```
?page=1&limit=10&sort=timestamp&order=desc
```

Response Format:

```json
{
  "data": [],
  "pagination": {
    "total": "number",
    "pages": "number",
    "current_page": "number",
    "per_page": "number"
  }
}
```

## API Versioning

Version is specified in the URL:

```
/api/v1/endpoint
```

## Best Practices

1. **Error Handling**
   - Always check response status codes
   - Handle rate limiting gracefully
   - Implement retry logic for 5xx errors

2. **Authentication**
   - Store tokens securely
   - Refresh tokens before expiry
   - Handle token revocation

3. **Performance**
   - Use compression
   - Implement caching
   - Batch requests when possible

4. **Security**
   - Use HTTPS
   - Validate input
   - Sanitize output
