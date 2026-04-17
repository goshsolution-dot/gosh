import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { sequelize, Industry, Solution } from './models/index';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use(errorHandler);

const port = Number(process.env.PORT || 4000);

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
    console.log('Seed data initialized.');
  }
}

async function start() {
  try {
    await sequelize.sync({ alter: true });
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
