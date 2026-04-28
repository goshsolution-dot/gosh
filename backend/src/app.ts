import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import errorHandler from './middlewares/errorHandler';
import { initializeDynamoDBTable } from './services/dynamodbService';
import { seedInitialData } from './seed';

dotenv.config();

const app = express();

/**
 * -------------------------
 * REQUEST LOGGING (KEEPED)
 * -------------------------
 */
app.use((req, res, next) => {
  console.log('[Express] ===== INCOMING REQUEST =====');
  console.log('[Express] Method:', req.method);
  console.log('[Express] Path:', req.path);
  console.log('[Express] URL:', req.url);
  console.log('[Express] Origin header:', req.get('origin'));
  console.log('[Express] All headers:', JSON.stringify(req.headers, null, 2));
  next();
});

/**
 * -------------------------
 * CORS CONFIGURATION (REQUIRED)
 * -------------------------
 */
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://d2l1zjbdxeq7mh.cloudfront.net',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5001',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    console.log('[CORS] Origin:', origin, 'Allowed:', allowedOrigins);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type'],
  maxAge: 86400,
}));

/**
 * -------------------------
 * EXPLICIT CORS HEADERS (BACKUP)
 * -------------------------
 */
app.use((req, res, next) => {
  const origin = req.get('origin');
  const allowedOrigins = [
    'https://d2l1zjbdxeq7mh.cloudfront.net',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5001',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.set('Access-Control-Expose-Headers', 'Content-Type');
    console.log('[CORS] Headers set for origin:', origin);
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

/**
 * -------------------------
 * BODY PARSING
 * -------------------------
 */
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

/**
 * -------------------------
 * DATABASE INIT (KEEPED)
 * -------------------------
 */
let dbInitialized = false;

async function initializeDatabase() {
  if (dbInitialized) return;

  try {
    await initializeDynamoDBTable();
    await seedInitialData();
    dbInitialized = true;
    console.log('[DynamoDB] Database initialized successfully');
  } catch (error) {
    console.error('[DynamoDB] Initialization error:', error);
    throw error;
  }
}

/**
 * DB INIT MIDDLEWARE (KEEPED)
 */
app.use(async (req, res, next) => {
  console.log('[Express] Incoming request:', {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
  });

  try {
    await initializeDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * -------------------------
 * ROUTES
 * -------------------------
 */
app.use('/api', apiRouter);

/**
 * HEALTH
 */
app.get('/health', (req, res) => {
  console.log('[Express] Health check');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * ROOT
 */
app.get('/', (req, res) => {
  console.log('[Express] Root endpoint hit');
  res.json({ message: 'GOSH Backend API', version: '0.2.0', status: 'running' });
});

/**
 * -------------------------
 * ERROR HANDLER
 * -------------------------
 */
app.use((err, req, res, next) => {
  console.error('[Express] ERROR:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

/**
 * -------------------------
 * 404 HANDLER
 * -------------------------
 */
app.use((req, res) => {
  console.log('[Express] 404 Not Found:', req.method, req.path);

  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

export default app;