import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import errorHandler from './middlewares/errorHandler';
import { initializeDynamoDBTable } from './services/dynamodbService';
import { seedInitialData } from './seed-dynamodb';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://example.com',
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Routes
app.use('/api', apiRouter);

// Error handler
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

// Initialize database on app startup
app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

export default app;
