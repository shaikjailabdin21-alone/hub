const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('./config/database');
const seedData = require('./seed');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic CORS configuration allowing localhost Vite dev server
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://jailuu.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
];

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// API Root summary
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Hub Learning Website API',
    health: '/api/health',
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.status(200).json({
    status: 'online',
    service: 'Hub Learning Website API',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hubs', require('./routes/hubRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/career', require('./routes/careerRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// 404 Handler for Unrecognized API Endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found.`,
  });
});

// ---------- Serve Frontend in Production ----------
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
const fs = require('fs');

if (fs.existsSync(frontendBuildPath)) {
  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(frontendBuildPath));

  // For any non-API route, send the React app's index.html (client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // Development fallback: show API status JSON when no frontend build exists
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'online',
      service: 'Hub Learning Website Backend API',
      version: '1.0.0',
      health: '/api/health',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        hubs: '/api/hubs',
        topics: '/api/topics',
        quizzes: '/api/quizzes',
        projects: '/api/projects',
        progress: '/api/progress',
      },
      message: 'Backend server is running properly and ready for requests.',
    });
  });
}

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    ...(isProduction ? {} : { error: err.message, stack: err.stack }),
  });
});

// Start Server with resilient port binding
let serverInstance = null;

const portsToTry = [PORT, 5001, 5002, 5005];
let portIndex = 0;

const tryListen = () => {
  const currentPort = portsToTry[portIndex];
  serverInstance = app.listen(currentPort, () => {
    console.log(`===============================================`);
    console.log(`🚀 Hub Learning Backend running on port ${currentPort}`);
    console.log(`📡 API Endpoints available at: http://localhost:${currentPort}/api`);
    console.log(`===============================================`);
  });

  serverInstance.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      portIndex++;
      if (portIndex < portsToTry.length) {
        console.warn(`[Port ${currentPort} in use] Retrying on fallback port ${portsToTry[portIndex]}...`);
        tryListen();
      } else {
        console.error(`\n❌ [PORTS OCCUPIED]: Could not bind to any fallback port.`);
        process.exit(1);
      }
    } else {
      console.error('[Server Error]:', err.message);
    }
  });
};

const startServer = async () => {
  try {
    await connectDB();
    await seedData();

    // Initialize scheduled cron jobs
    const { initWeeklyCron } = require('./services/schedulerService');
    initWeeklyCron();

    // Only start accepting incoming HTTP requests once DB & seeds are ready
    tryListen();
  } catch (err) {
    console.error('[Database Initialization Error]:', err.message);
    process.exit(1);
  }
};

// Graceful shutdown
const handleExit = async () => {
  console.log('\n[Server] Shutting down cleanly...');
  if (serverInstance) {
    serverInstance.close();
  }
  await disconnectDB();
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

// Execute initialization
startServer();

module.exports = app;
