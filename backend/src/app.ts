import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { sequelize, Industry, Solution, HomepageCard, HomepageBackground } from './models/index';
import errorHandler from './middlewares/errorHandler';

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
    await sequelize.authenticate();
    await sequelize.sync();
    await populateSeedData();
    dbInitialized = true;
    console.log('[DB] Database initialized successfully');
  } catch (error) {
    console.error('[DB] Initialization error:', error);
    throw error;
  }
}

async function populateSeedData() {
  const industryCount = await Industry.count();
  if (industryCount === 0) {
    const industries = await Industry.bulkCreate([
      { name: 'Education' },
      { name: 'Retail' },
      { name: 'Health' },
    ]);

    await Solution.bulkCreate([
      {
        name: 'Learning Management System',
        description: 'A modern LMS for schools and training providers.',
        demoLink: 'https://example.com/lms-demo',
        demoAvailable: true,
        industryId: industries[0].id,
      },
      {
        name: 'Retail Inventory Platform',
        description: 'Inventory and sales management for retail businesses.',
        demoAvailable: false,
        industryId: industries[1].id,
      },
      {
        name: 'Health Clinic Portal',
        description: 'Patient management and appointment booking.',
        demoLink: 'https://example.com/health-demo',
        demoAvailable: true,
        industryId: industries[2].id,
      },
    ]);
    console.log('[Seed] Industries and Solutions initialized.');
  }

  const cardCount = await HomepageCard.count();
  if (cardCount === 0) {
    await HomepageCard.bulkCreate([
      {
        title: 'Hotel Management System',
        subtitle: 'Complete booking and operations management',
        icon: '🏨',
        expandedText: 'Manage reservations, guest check-ins, room status, billing, and staff schedules in one integrated platform. Real-time dashboard with occupancy rates and revenue tracking.',
        badgeText: 'FEATURED',
        demoLink: 'https://demo.gosh.local',
        images: '[]',
        order: 1,
      },
      {
        title: 'Retail POS Solution',
        subtitle: 'Point of sale and inventory tracking',
        icon: '🛒',
        expandedText: 'Streamline checkout processes, manage inventory in real-time, track sales analytics, and generate detailed reports. Perfect for shops, boutiques, and supermarkets.',
        badgeText: 'POPULAR',
        demoLink: 'https://demo.gosh.local',
        images: '[]',
        order: 2,
      },
      {
        title: 'Pharmacy Management',
        subtitle: 'Prescription and stock management',
        icon: '💊',
        expandedText: 'Manage prescription inventories, track medication stock levels, handle patient records and billing. Compliant with health regulations.',
        badgeText: 'NEW',
        demoLink: 'https://demo.gosh.local',
        images: '[]',
        order: 3,
      },
    ]);
    console.log('[Seed] Homepage cards initialized.');
  }

  const bgCount = await HomepageBackground.count();
  if (bgCount === 0) {
    await HomepageBackground.bulkCreate([
      {
        title: 'Blue Gradient',
        imageData: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        order: 1,
      },
    ]);
    console.log('[Seed] Homepage backgrounds initialized.');
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
