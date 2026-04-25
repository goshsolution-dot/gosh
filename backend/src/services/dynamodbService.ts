/**
 * DynamoDB Single Table Design for GOSH Project
 * 
 * Table Name: gosh-dynamodb-table
 * 
 * Partition Key (PK): entityId
 * Sort Key (SK): timestamp
 * 
 * Entity ID Format: {TYPE}#{ID}
 * Examples:
 * - INDUSTRY#1
 * - SOLUTION#5
 * - CUSTOMER#42
 * - BOOKING#123
 * - PAYMENT#789
 * - HOMEPAGE_CARD#1
 * - QUOTATION#456
 * 
 * GSI: type-timestamp-index
 * - PK: type (INDUSTRY, SOLUTION, CUSTOMER, BOOKING, etc.)
 * - SK: timestamp
 * Allows querying all entities of a specific type
 */

import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const dynamodbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

// Single unified DynamoDB table for all operationss
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'gosh-dynamodb-table';

/**
 * Initialize DynamoDB table if it doesn't exist
 */
export async function initializeDynamoDBTable() {
  try {
    await dynamodbClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`[DynamoDB] Table ${TABLE_NAME} already exists`);
  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
      console.log(`[DynamoDB] Creating table ${TABLE_NAME}...`);
      
      try {
        await dynamodbClient.send(
          new CreateTableCommand({
            TableName: TABLE_NAME,
            KeySchema: [
              { AttributeName: 'entityId', KeyType: 'HASH' }, // Partition key
              { AttributeName: 'timestamp', KeyType: 'RANGE' }, // Sort key
            ],
            AttributeDefinitions: [
              { AttributeName: 'entityId', AttributeType: 'S' },
              { AttributeName: 'timestamp', AttributeType: 'N' },
              { AttributeName: 'type', AttributeType: 'S' },
              { AttributeName: 'id', AttributeType: 'S' },
              { AttributeName: 'email', AttributeType: 'S' },
            ],
            BillingMode: 'PAY_PER_REQUEST', // Pay-per-request for cost efficiency
            GlobalSecondaryIndexes: [
              {
                IndexName: 'type-timestamp-index',
                KeySchema: [
                  { AttributeName: 'type', KeyType: 'HASH' },
                  { AttributeName: 'timestamp', KeyType: 'RANGE' },
                ],
                Projection: { ProjectionType: 'ALL' },
              },
              {
                IndexName: 'email-index',
                KeySchema: [
                  { AttributeName: 'email', KeyType: 'HASH' },
                  { AttributeName: 'timestamp', KeyType: 'RANGE' },
                ],
                Projection: { ProjectionType: 'ALL' },
              },
              {
                IndexName: 'id-index',
                KeySchema: [
                  { AttributeName: 'id', KeyType: 'HASH' },
                  { AttributeName: 'type', KeyType: 'RANGE' },
                ],
                Projection: { ProjectionType: 'ALL' },
              },
            ],
            StreamSpecification: {
              StreamEnabled: true,
              StreamViewType: 'NEW_AND_OLD_IMAGES',
            },
          })
        );

        console.log(`[DynamoDB] Table ${TABLE_NAME} created successfully`);
        // Wait for table to be active
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (createError) {
        console.error('[DynamoDB] Error creating table:', createError);
        throw createError;
      }
    } else {
      throw error;
    }
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Get current timestamp in milliseconds
 */
function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * INDUSTRY Operations
 */
export const IndustryOps = {
  async create(data: { name: string }) {
    const id = generateId();
    const entityId = `INDUSTRY#${id}`;
    const timestamp = getCurrentTimestamp();

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          entityId,
          id,
          type: 'INDUSTRY',
          timestamp,
          name: data.name,
          createdAt: new Date().toISOString(),
        },
      })
    );

    return { id, name: data.name };
  },

  async getAll() {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'type-timestamp-index',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':type': 'INDUSTRY' },
      })
    );

    return (result.Items || []).map((item: any) => ({
      id: item.id,
      name: item.name,
    }));
  },
};

/**
 * SOLUTION Operations
 */
export const SolutionOps = {
  async create(data: {
    name: string;
    description: string;
    demoLink?: string;
    demoAvailable: boolean;
    industryId: string;
  }) {
    const id = generateId();
    const entityId = `SOLUTION#${id}`;
    const timestamp = getCurrentTimestamp();

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          entityId,
          id,
          type: 'SOLUTION',
          timestamp,
          name: data.name,
          description: data.description,
          demoLink: data.demoLink,
          demoAvailable: data.demoAvailable,
          industryId: data.industryId,
          createdAt: new Date().toISOString(),
        },
      })
    );

    return { id, ...data };
  },

  async getAll(industryId?: string) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'type-timestamp-index',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':type': 'SOLUTION' },
      })
    );

    let items = (result.Items || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      demoLink: item.demoLink,
      demoAvailable: item.demoAvailable,
      industryId: item.industryId,
    }));

    if (industryId) {
      items = items.filter((item: any) => item.industryId === industryId);
    }

    return items;
  },

  async getById(id: string) {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { entityId: `SOLUTION#${id}`, timestamp: 0 },
      })
    );

    if (!result.Item) return null;

    const item = result.Item;
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      demoLink: item.demoLink,
      demoAvailable: item.demoAvailable,
      industryId: item.industryId,
    };
  },
};

/**
 * CUSTOMER Operations
 */
export const CustomerOps = {
  async findOrCreate(data: { name: string; email: string; phone?: string }) {
    // Query by email using GSI
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': data.email },
      })
    );

    if (result.Items && result.Items.length > 0) {
      return result.Items[0];
    }

    // Create new customer
    const id = generateId();
    const entityId = `CUSTOMER#${id}`;
    const timestamp = getCurrentTimestamp();

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          entityId,
          id,
          type: 'CUSTOMER',
          timestamp,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          createdAt: new Date().toISOString(),
        },
      })
    );

    return { id, ...data };
  },

  async getAll() {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'type-timestamp-index',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':type': 'CUSTOMER' },
      })
    );

    return (result.Items || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
    }));
  },
};

/**
 * BOOKING Operations
 */
export const BookingOps = {
  async create(data: {
    type: 'demo' | 'discussion' | 'hosting';
    customerId: string;
    solutionId?: string;
    requestedDate?: string;
    message: string;
    provider?: string;
    serviceDetails?: string;
  }) {
    const id = generateId();
    const entityId = `BOOKING#${id}`;
    const timestamp = getCurrentTimestamp();

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          entityId,
          id,
          type: 'BOOKING',
          bookingType: data.type,
          timestamp,
          customerId: data.customerId,
          solutionId: data.solutionId,
          requestedDate: data.requestedDate,
          message: data.message,
          provider: data.provider,
          serviceDetails: data.serviceDetails,
          createdAt: new Date().toISOString(),
        },
      })
    );

    return { id, ...data };
  },

  async getAll() {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'type-timestamp-index',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':type': 'BOOKING' },
      })
    );

    return result.Items || [];
  },
};

/**
 * PAYMENT Operations
 */
export const PaymentOps = {
  async create(data: {
    customerId: string;
    amount: number;
    transactionReference: string;
    service: string;
  }) {
    const id = generateId();
    const entityId = `PAYMENT#${id}`;
    const timestamp = getCurrentTimestamp();

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          entityId,
          id,
          type: 'PAYMENT',
          timestamp,
          customerId: data.customerId,
          amount: data.amount,
          transactionReference: data.transactionReference,
          service: data.service,
          createdAt: new Date().toISOString(),
        },
      })
    );

    return { id, ...data };
  },

  async getAll() {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'type-timestamp-index',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':type': 'PAYMENT' },
        ScanIndexForward: false, // Sort descending (newest first)
      })
    );

    return (result.Items || []).map((item: any) => ({
      id: item.id,
      customerId: item.customerId,
      amount: item.amount,
      transactionReference: item.transactionReference,
      service: item.service,
    }));
  },
};

/**
 * QUOTATION REQUEST Operations
 */
export const QuotationOps = {
  async create(data: {
    cardId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    businessName: string;
    requirements: string;
    requestedDate: string;
    status?: 'pending' | 'reviewed' | 'quoted' | 'rejected';
  }) {
    const id = generateId();
    const entityId = `QUOTATION#${id}`;
    const timestamp = getCurrentTimestamp();

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          entityId,
          id,
          type: 'QUOTATION',
          timestamp,
          cardId: data.cardId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          businessName: data.businessName,
          requirements: data.requirements,
          requestedDate: data.requestedDate,
          status: data.status || 'pending',
          createdAt: new Date().toISOString(),
        },
      })
    );

    return { id, ...data };
  },

  async getAll() {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'type-timestamp-index',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':type': 'QUOTATION' },
        ScanIndexForward: false, // Sort descending (newest first)
      })
    );

    return result.Items || [];
  },
};

/**
 * HOMEPAGE CARD Operations
 */
export const HomepageCardOps = {
  async create(data: {
    title: string;
    subtitle: string;
    icon: string;
    badgeText?: string;
    demoLink?: string;
    images: string[];
    expandedText?: string;
    order: number;
  }) {
    const id = generateId();
    const entityId = `HOMEPAGE_CARD#${id}`;
    const timestamp = getCurrentTimestamp();

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          entityId,
          id,
          type: 'HOMEPAGE_CARD',
          timestamp,
          title: data.title,
          subtitle: data.subtitle,
          icon: data.icon,
          badgeText: data.badgeText,
          demoLink: data.demoLink,
          images: data.images,
          expandedText: data.expandedText,
          order: data.order,
          createdAt: new Date().toISOString(),
        },
      })
    );

    return { id, ...data };
  },

  async getAll() {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'type-timestamp-index',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':type': 'HOMEPAGE_CARD' },
      })
    );

    return (result.Items || [])
      .sort((a: any, b: any) => a.order - b.order)
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        icon: item.icon,
        badgeText: item.badgeText,
        demoLink: item.demoLink,
        images: item.images || [],
        expandedText: item.expandedText,
        order: item.order,
      }));
  },

  async delete(id: string) {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { entityId: `HOMEPAGE_CARD#${id}`, timestamp: 0 },
      })
    );

    return { id };
  },
};

/**
 * HOMEPAGE BACKGROUND Operations
 */
export const HomepageBackgroundOps = {
  async create(data: {
    title: string;
    imageData: string;
    order: number;
  }) {
    const id = generateId();
    const entityId = `HOMEPAGE_BG#${id}`;
    const timestamp = getCurrentTimestamp();

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          entityId,
          id,
          type: 'HOMEPAGE_BG',
          timestamp,
          title: data.title,
          imageData: data.imageData,
          order: data.order,
          createdAt: new Date().toISOString(),
        },
      })
    );

    return { id, ...data };
  },

  async getAll() {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'type-timestamp-index',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':type': 'HOMEPAGE_BG' },
      })
    );

    return (result.Items || [])
      .sort((a: any, b: any) => a.order - b.order)
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        imageData: item.imageData,
        order: item.order,
      }));
  },

  async delete(id: string) {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { entityId: `HOMEPAGE_BG#${id}`, timestamp: 0 },
      })
    );

    return { id };
  },
};

export default docClient;
