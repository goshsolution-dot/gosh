import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/api';
import { initializeDynamoDBTable } from './services/dynamodbService';
import { seedInitialData } from './seed';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', apiRouter);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);

async function start() {
  try {
    // Initialize DynamoDB table
    await initializeDynamoDBTable();
    
    // Seed initial data
    await seedInitialData();
    
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`DynamoDB Table: ${process.env.DYNAMODB_TABLE_NAME || 'gosh-data-dev'}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();
