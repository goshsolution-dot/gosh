import { Customer, Industry, Payment, Booking, Solution } from '../models/index';

interface RequestCustomerData {
  name: string;
  email: string;
  phone?: string;
}

async function findOrCreateCustomer(customer: RequestCustomerData) {
  const [record] = await Customer.findOrCreate({
    where: { email: customer.email },
    defaults: { name: customer.name, email: customer.email, phone: customer.phone },
  });
  return record;
}

export async function getIndustries() {
  return Industry.findAll({ include: [{ model: Solution, as: 'solutions' }] });
}

export async function getSolutions(industryId?: string) {
  const where = industryId ? { industryId: Number(industryId) } : undefined;
  return Solution.findAll({ where, include: [{ model: Industry, as: 'industry' }] });
}

export async function getSolutionById(id: number) {
  return Solution.findByPk(id, { include: [{ model: Industry, as: 'industry' }] });
}

export async function requestDemo(data: {
  solutionId: number;
  requestedDate: string;
  customer: RequestCustomerData;
  message: string;
}) {
  const customer = await findOrCreateCustomer(data.customer);
  return Booking.create({
    type: 'demo',
    customerId: customer.id,
    solutionId: data.solutionId,
    requestedDate: data.requestedDate,
    message: data.message,
  });
}

export async function requestDiscussion(data: {
  solutionId: number;
  requestedDate: string;
  customer: RequestCustomerData;
  message: string;
}) {
  const customer = await findOrCreateCustomer(data.customer);
  return Booking.create({
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
  return Payment.create({
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
  return Booking.create({
    type: 'hosting',
    customerId: customer.id,
    message: data.message,
    provider: data.provider,
    serviceDetails: data.serviceDetails,
  });
}

export async function getAdminOverview() {
  const solutionCount = await Solution.count();
  const industryCount = await Industry.count();
  const customerCount = await Customer.count();
  const bookingCount = await Booking.count();
  const paymentCount = await Payment.count();
  return { solutionCount, industryCount, customerCount, bookingCount, paymentCount };
}

export async function getAdminRecords() {
  const solutions = await Solution.findAll({ include: [{ model: Industry, as: 'industry' }] });
  const bookings = await Booking.findAll({ include: [{ model: Customer, as: 'customer' }, { model: Solution, as: 'solution' }] });
  const payments = await Payment.findAll({ include: [{ model: Customer, as: 'customer' }] });
  const customers = await Customer.findAll();
  return { solutions, bookings, payments, customers };
}
