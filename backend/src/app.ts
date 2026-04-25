import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import errorHandler from './middlewares/errorHandler';
import { initializeDynamoDBTable } from './services/dynamodbService';
import { seedInitialData } from './seed';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://example.com',
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize database on first request
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

// Database initialization middleware - must come BEFORE routes
app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'GOSH Backend API', version: '0.2.0', status: 'running' });
});

// Error handler
app.use(errorHandler);

// 404 handler for any undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

export default app;
