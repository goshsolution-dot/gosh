/**
 * DynamoDB Configuration
 * AWS serverless database for GOSH Project
 */

import dotenv from 'dotenv';

dotenv.config();

export const dynamodbConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  tableName: process.env.DYNAMODB_TABLE_NAME || 'gosh-data-dev',
  billingMode: process.env.DYNAMODB_BILLING_MODE || 'PAY_PER_REQUEST',
  pointInTimeRecoveryEnabled: process.env.DYNAMODB_POINT_IN_TIME_RECOVERY === 'true',
};

export default dynamodbConfig;
