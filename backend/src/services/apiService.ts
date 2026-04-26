/**
 * API Service - DynamoDB Implementation
 * All operations use AWS DynamoDB instead of SQL databases
 */

import * as db from './dynamodbService';

// ============================================================================
// INDUSTRIES
// ============================================================================

export async function getIndustries() {
  try {
    const industries = await db.IndustryOps.getAll();
    return industries;
  } catch (error) {
    console.error('[API Service] Error getting industries:', error);
    throw error;
  }
}

// ============================================================================
// SOLUTIONS
// ============================================================================

export async function getSolutions(industryId?: string) {
  try {
    const solutions = await db.SolutionOps.getAll(industryId);
    return solutions;
  } catch (error) {
    console.error('[API Service] Error getting solutions:', error);
    throw error;
  }
}

export async function getSolutionById(id: number) {
  try {
    const solution = await db.SolutionOps.getById(`SOLUTION#${id}`);
    return solution;
  } catch (error) {
    console.error('[API Service] Error getting solution:', error);
    throw error;
  }
}

// ============================================================================
// HOMEPAGE DATA
// ============================================================================

export async function getHomepageData() {
  try {
    const [cards, backgrounds] = await Promise.all([
      db.HomepageCardOps.getAll(),
      db.HomepageBackgroundOps.getAll(),
    ]);

    return {
      cards,
      backgrounds,
    };
  } catch (error) {
    console.error('[API Service] Error getting homepage data:', error);
    throw error;
  }
}

// ============================================================================
// DEMO REQUESTS
// ============================================================================

export async function requestDemo(data: any) {
  try {
    const booking = await db.BookingOps.create({
      type: 'demo',
      customerId: data.customerId,
      solutionId: data.solutionId,
      requestedDate: data.requestedDate,
      message: data.message,
      serviceDetails: JSON.stringify(data),
    });
    return booking;
  } catch (error) {
    console.error('[API Service] Error creating demo request:', error);
    throw error;
  }
}

// ============================================================================
// DISCUSSION REQUESTS
// ============================================================================

export async function requestDiscussion(data: any) {
  try {
    const booking = await db.BookingOps.create({
      type: 'discussion',
      customerId: data.customerId,
      solutionId: data.solutionId,
      requestedDate: data.requestedDate,
      message: data.message,
      serviceDetails: JSON.stringify(data),
    });
    return booking;
  } catch (error) {
    console.error('[API Service] Error creating discussion request:', error);
    throw error;
  }
}

// ============================================================================
// PAYMENTS
// ============================================================================

export async function submitPayment(data: any) {
  try {
    const payment = await db.PaymentOps.create({
      customerId: data.customerId,
      amount: data.amount,
      transactionReference: data.transactionReference,
      service: data.service,
    });
    return payment;
  } catch (error) {
    console.error('[API Service] Error submitting payment:', error);
    throw error;
  }
}

// ============================================================================
// HOSTING REQUESTS
// ============================================================================

export async function requestHosting(data: any) {
  try {
    const booking = await db.BookingOps.create({
      type: 'hosting',
      customerId: data.customerId,
      requestedDate: data.requestedDate,
      message: data.message,
      provider: data.provider,
      serviceDetails: JSON.stringify(data),
    });
    return booking;
  } catch (error) {
    console.error('[API Service] Error creating hosting request:', error);
    throw error;
  }
}

// ============================================================================
// QUOTATION REQUESTS
// ============================================================================

export async function requestQuotation(data: any) {
  try {
    const quotation = await db.QuotationOps.create({
      cardId: data.cardId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      businessName: data.businessName,
      requirements: data.requirements,
      requestedDate: data.requestedDate,
      status: data.status || 'pending',
    });
    return quotation;
  } catch (error) {
    console.error('[API Service] Error creating quotation request:', error);
    throw error;
  }
}

export async function getQuotationRequests() {
  try {
    const quotations = await db.QuotationOps.getAll();
    return quotations;
  } catch (error) {
    console.error('[API Service] Error getting quotation requests:', error);
    throw error;
  }
}

// ============================================================================
// HOMEPAGE CARDS
// ============================================================================

export async function createHomepageCard(data: any) {
  try {
    const card = await db.HomepageCardOps.create({
      title: data.title,
      subtitle: data.subtitle,
      icon: data.icon,
      expandedText: data.expandedText,
      badgeText: data.badgeText,
      demoLink: data.demoLink,
      images: data.images || [],
      order: data.order || 0,
    });
    return card;
  } catch (error) {
    console.error('[API Service] Error creating homepage card:', error);
    throw error;
  }
}

export async function deleteHomepageCard(id: string) {
  try {
    console.log('[API Service] Deleting homepage card with id:', id);
    const result = await db.HomepageCardOps.delete(id);
    console.log('[API Service] Card deleted successfully:', result);
    return { id };
  } catch (error) {
    console.error('[API Service] Error deleting homepage card:', error);
    throw error;
  }
}

// ============================================================================
// HOMEPAGE BACKGROUNDS
// ============================================================================

export async function createHomepageBackground(data: any) {
  try {
    const background = await db.HomepageBackgroundOps.create({
      title: data.title,
      imageData: data.imageData,
      order: data.order || 0,
    });
    return background;
  } catch (error) {
    console.error('[API Service] Error creating homepage background:', error);
    throw error;
  }
}

export async function deleteHomepageBackground(id: string) {
  try {
    await db.HomepageBackgroundOps.delete(id);
    return { id };
  } catch (error) {
    console.error('[API Service] Error deleting homepage background:', error);
    throw error;
  }
}

// ============================================================================
// ADMIN OVERVIEW
// ============================================================================

export async function getAdminOverview() {
  try {
    const [industries, solutions, bookings, payments, quotations] = await Promise.all([
      db.IndustryOps.getAll(),
      db.SolutionOps.getAll(),
      db.BookingOps.getAll(),
      db.PaymentOps.getAll(),
      db.QuotationOps.getAll(),
    ]);

    return {
      industryCount: industries.length,
      solutionCount: solutions.length,
      bookingCount: bookings.length,
      paymentCount: payments.length,
      quotationCount: quotations.length,
      totalRevenue: payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
    };
  } catch (error) {
    console.error('[API Service] Error getting admin overview:', error);
    throw error;
  }
}

// ============================================================================
// ADMIN RECORDS
// ============================================================================

export async function getAdminRecords() {
  try {
    const [industries, solutions, bookings, payments, quotations, customers] = await Promise.all([
      db.IndustryOps.getAll(),
      db.SolutionOps.getAll(),
      db.BookingOps.getAll(),
      db.PaymentOps.getAll(),
      db.QuotationOps.getAll(),
      db.CustomerOps.getAll(),
    ]);

    return {
      industries,
      solutions,
      bookings,
      payments,
      quotations,
      customers,
    };
  } catch (error) {
    console.error('[API Service] Error getting admin records:', error);
    throw error;
  }
}

// ============================================================================
// S3 PRESIGNED URLs
// ============================================================================

import s3Service from './s3Service';

export async function getPresignedUploadUrl(fileName: string, contentType: string, category: string = 'general') {
  try {
    // Generate a unique S3 key with category prefix
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const s3Key = `${category}/${timestamp}-${randomStr}-${fileName}`;
    
    // Generate presigned URL valid for 1 hour
    const presignedUrl = await s3Service.generatePresignedUploadUrl(s3Key, contentType, 3600);
    
    return {
      presignedUrl,
      key: s3Key,
    };
  } catch (error) {
    console.error('[API Service] Error generating presigned URL:', error);
    throw error;
  }
}
