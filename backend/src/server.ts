import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/api';
import { sequelize, Industry, Solution, HomepageCard, HomepageBackground } from './models/index';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', apiRouter);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);

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

  // Seed homepage cards if empty
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
        images: [],
        order: 1,
      },
      {
        title: 'Retail POS Solution',
        subtitle: 'Point of sale and inventory tracking',
        icon: '🛒',
        expandedText: 'Streamline checkout processes, manage inventory in real-time, track sales analytics, and generate detailed reports. Perfect for shops, boutiques, and supermarkets.',
        badgeText: 'POPULAR',
        demoLink: 'https://demo.gosh.local',
        images: [],
        order: 2,
      },
      {
        title: 'Pharmacy Management',
        subtitle: 'Prescription and stock management',
        icon: '💊',
        expandedText: 'Manage prescription inventories, track medication stock levels, handle patient records and billing. Compliant with health regulations.',
        badgeText: 'NEW',
        demoLink: 'https://demo.gosh.local',
        images: [],
        order: 3,
      },
    ]);
    console.log('[Seed] Homepage cards initialized.');
  }

  // Seed background images if empty
  const bgCount = await HomepageBackground.count();
  if (bgCount === 0) {
    await HomepageBackground.bulkCreate([
      {
        title: 'Blue Gradient',
        imageData: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        order: 1,
      },
      {
        title: 'Pink Gradient',
        imageData: 'linear-gradient(to right, #f093fb 0%, #f5576c 100%)',
        order: 2,
      },
    ]);
    console.log('[Seed] Background images initialized.');
  }
}

async function start() {
  try {
    await sequelize.sync();
    await populateSeedData();
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();
