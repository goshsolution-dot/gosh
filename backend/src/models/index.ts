/**
 * TypeScript Interfaces for DynamoDB Entities
 * These are type definitions only - no ORM used with DynamoDB
 */

// ============================================================================
// ENTITY TYPES
// ============================================================================

export interface Industry {
  id: string;
  type: 'INDUSTRY';
  name: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

export interface Solution {
  id: string;
  type: 'SOLUTION';
  name: string;
  description: string;
  demoLink?: string;
  demoAvailable: boolean;
  industryId: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  type: 'CUSTOMER';
  name: string;
  email: string;
  phone?: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  type: 'BOOKING';
  bookingType: 'demo' | 'discussion' | 'hosting';
  customerId: string;
  solutionId?: string;
  requestedDate?: string;
  message: string;
  provider?: string;
  serviceDetails?: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  type: 'PAYMENT';
  customerId: string;
  amount: number;
  transactionReference: string;
  service: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageCard {
  id: string;
  type: 'HOMEPAGE_CARD';
  title: string;
  subtitle: string;
  icon: string;
  expandedText: string;
  badgeText?: string;
  demoLink?: string;
  images?: string[];
  order: number;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageBackground {
  id: string;
  type: 'HOMEPAGE_BACKGROUND';
  title: string;
  imageData: string;
  order: number;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}


export interface Quotation {
  id: string;
  type: 'QUOTATION';
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName: string;
  description?: string;
  requirements: string;
  budget?: number;
  cardId?: string;
  requestedDate?: string;
  status?: string;
  timestamp: number;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// NOTES
// ============================================================================

/**
 * NOTE: This project uses AWS DynamoDB as the database, not a traditional SQL database.
 * 
 * Instead of using an ORM like Sequelize, we use:
 * - AWS SDK v3 (@aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb)
 * - Document Client for easier JSON-like operations
 * - Single table design with entity type differentiation
 * 
 * All database operations are in: services/dynamodbService.ts
 * Business logic layer: services/apiService.ts
 * 
 * The Sequelize models that were previously here have been removed as they
 * are not compatible with DynamoDB (which is NoSQL, not SQL).
 */
