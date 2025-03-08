const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { createProxyMiddleware } = require('http-proxy-middleware');
const redis = require('redis');

const app = express();

// Redis client for caching
const redisClient = redis.createClient(process.env.REDIS_URL);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Proxy middleware setup
const mainServiceProxy = createProxyMiddleware({
  target: process.env.MAIN_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/'
  }
});

// Routes
app.use('/api', mainServiceProxy);

const PORT = process.env.GATEWAY_PORT || 4000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
