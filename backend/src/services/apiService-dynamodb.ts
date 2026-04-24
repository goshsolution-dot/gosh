import {
  IndustryOps,
  SolutionOps,
  CustomerOps,
  BookingOps,
  PaymentOps,
  QuotationOps,
  HomepageCardOps,
  HomepageBackgroundOps,
} from './dynamodbService';

interface RequestCustomerData {
  name: string;
  email: string;
  phone?: string;
}

async function findOrCreateCustomer(customer: RequestCustomerData) {
  return CustomerOps.findOrCreate(customer);
}

export async function getIndustries() {
  return IndustryOps.getAll();
}

export async function getSolutions(industryId?: string) {
  return SolutionOps.getAll(industryId);
}

export async function getSolutionById(id: string) {
  return SolutionOps.getById(id);
}

export async function requestDemo(data: {
  solutionId: string;
  requestedDate: string;
  customer: RequestCustomerData;
  message: string;
}) {
  const customer = await findOrCreateCustomer(data.customer);
  return BookingOps.create({
    type: 'demo',
    customerId: customer.id,
    solutionId: data.solutionId,
    requestedDate: data.requestedDate,
    message: data.message,
  });
}

export async function requestDiscussion(data: {
  solutionId?: string;
  requestedDate?: string;
  customer: RequestCustomerData;
  message: string;
}) {
  const customer = await findOrCreateCustomer(data.customer);
  return BookingOps.create({
    type: 'discussion',
    customerId: customer.id,
    solutionId: data.solutionId,
    requestedDate: data.requestedDate,
    message: data.message,
  });
}

export async function submitPayment(data: {
  customer: RequestCustomerData;
  amount: number;
  transactionReference: string;
  service: string;
}) {
  const customer = await findOrCreateCustomer(data.customer);
  return PaymentOps.create({
    customerId: customer.id,
    amount: data.amount,
    transactionReference: data.transactionReference,
    service: data.service,
  });
}

export async function requestHosting(data: {
  customer: RequestCustomerData;
  provider: string;
  serviceDetails: string;
  message: string;
}) {
  const customer = await findOrCreateCustomer(data.customer);
  return BookingOps.create({
    type: 'hosting',
    customerId: customer.id,
    message: data.message,
    provider: data.provider,
    serviceDetails: data.serviceDetails,
  });
}

export async function requestQuotation(data: {
  cardId: string;
  customer: RequestCustomerData;
  business: string;
  requirements: string;
  requestedDate: string;
}) {
  return QuotationOps.create({
    cardId: data.cardId,
    customerName: data.customer.name,
    customerEmail: data.customer.email,
    customerPhone: data.customer.phone || '',
    businessName: data.business,
    requirements: data.requirements,
    requestedDate: data.requestedDate,
    status: 'pending',
  });
}

export async function getQuotationRequests() {
  return QuotationOps.getAll();
}

export async function getHomepageData() {
  const cards = await HomepageCardOps.getAll();
  const backgrounds = await HomepageBackgroundOps.getAll();
  return {
    cards,
    backgrounds,
  };
}

export async function createHomepageCard(data: {
  title: string;
  subtitle: string;
  icon: string;
  badgeText?: string;
  demoLink?: string;
  images: string[];
  expandedText?: string;
  order?: number;
}) {
  return HomepageCardOps.create({
    title: data.title,
    subtitle: data.subtitle,
    icon: data.icon,
    badgeText: data.badgeText,
    demoLink: data.demoLink,
    images: data.images || [],
    expandedText: data.expandedText,
    order: data.order || 0,
  });
}

export async function deleteHomepageCard(id: string) {
  return HomepageCardOps.delete(id);
}

export async function createHomepageBackground(data: {
  title: string;
  imageData: string;
  order?: number;
}) {
  return HomepageBackgroundOps.create({
    title: data.title,
    imageData: data.imageData,
    order: data.order || 0,
  });
}

export async function deleteHomepageBackground(id: string) {
  return HomepageBackgroundOps.delete(id);
}

export async function getAdminOverview() {
  const bookings = await BookingOps.getAll();
  const quotations = await QuotationOps.getAll();
  const solutions = await SolutionOps.getAll();
  const industries = await IndustryOps.getAll();

  return {
    totalBookings: bookings.length,
    totalQuotations: quotations.length,
    totalSolutions: solutions.length,
    totalIndustries: industries.length,
    recentBookings: bookings.slice(0, 5),
    recentQuotations: quotations.slice(0, 5),
  };
}

export async function getAdminRecords() {
  const bookings = await BookingOps.getAll();
  const quotations = await QuotationOps.getAll();
  const payments: any[] = [];

  return {
    bookings,
    quotations,
    payments,
  };
}
