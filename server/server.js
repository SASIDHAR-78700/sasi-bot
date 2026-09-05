const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load .env relative to this file so the server works regardless of the
// directory it is started from (e.g. `npm start` from the repo root).
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Parse configured origins from environment
const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...configuredOrigins,
]);

// Allow any localhost origin dynamically (for dev servers on random ports)
const isLocalhost = (origin) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  } catch {
    return false;
  }
};

// Middleware
app.use(cors({
  origin(origin, callback) {
    // Allow requests without Origin header (health checks, server-to-server)
    if (!origin) return callback(null, true);
    
    // Allow any localhost origin for development (handles dynamic ports)
    if (isLocalhost(origin)) return callback(null, true);
    
    // Check against explicit whitelist
    if (allowedOrigins.has(origin.replace(/\/+$/, ''))) {
      return callback(null, true);
    }

    // In production, strict check
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    }
    
    // In development, allow unknown origins for convenience
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());

// Security headers
app.use(helmet());

// Rate limiting: protect auth endpoints from brute-force attacks and cap
// overall API usage per IP. Limits are configurable via env vars so they can
// be tuned per environment (defaults are dev-friendly; tighten in production).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_AUTH_MAX) || 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_API_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/chat', apiLimiter, chatRoutes);

// Health check (also reports database connectivity)
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'ok' : 'degraded',
    db: dbConnected ? 'connected' : 'disconnected',
    message: dbConnected
      ? 'AI Chat App server is running'
      : 'Server running but database is not connected',
  });
});

app.use((err, req, res, next) => {
  if (err.message?.includes('is not allowed by CORS')) {
    return res.status(403).json({ message: err.message });
  }
  return next(err);
});

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'GROQ_API_KEY'];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('   Please set them in the .env file or environment.');
  process.exit(1);
}

// In production, the frontend is hosted separately
if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.json({ message: 'Sasi API is running. Frontend is hosted separately.' });
  });
}

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const server = app.listen(PORT, () => {
      console.log(`🚀 Sasi server running on port ${PORT}`);
    });

    // Graceful shutdown: close HTTP server and DB connection on SIGINT/SIGTERM
    const shutdown = (signal) => {
      console.log(`\n${signal} received — shutting down...`);
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('👋 Server and DB connection closed');
          process.exit(0);
        });
      });
      // Force-exit if connections take too long to close
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
