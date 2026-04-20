import { Request, Response } from 'express';
import * as service from '../services/apiService';
import { signAdminToken } from '../utils/jwt';
import dotenv from 'dotenv';

dotenv.config();

export async function getIndustries(req: Request, res: Response) {
  const industries = await service.getIndustries();
  res.json({ success: true, data: industries });
}

export async function getSolutions(req: Request, res: Response) {
  const industryId = req.query.industryId as string | undefined;
  const solutions = await service.getSolutions(industryId);
  res.json({ success: true, data: solutions });
}

export async function getSolution(req: Request, res: Response) {
  const solution = await service.getSolutionById(Number(req.params.id));
  if (!solution) return res.status(404).json({ success: false, message: 'Solution not found' });
  res.json({ success: true, data: solution });
}

export async function getHomepageData(req: Request, res: Response) {
  const homepage = await service.getHomepageData();
  res.json({ success: true, data: homepage });
}

export async function postDemoRequest(req: Request, res: Response) {
  const booking = await service.requestDemo(req.body);
  res.status(201).json({ success: true, data: booking });
}

export async function postDiscussionRequest(req: Request, res: Response) {
  const booking = await service.requestDiscussion(req.body);
  res.status(201).json({ success: true, data: booking });
}

export async function postPayment(req: Request, res: Response) {
  const payment = await service.submitPayment(req.body);
  res.status(201).json({ success: true, data: payment });
}

export async function postHostingRequest(req: Request, res: Response) {
  const booking = await service.requestHosting(req.body);
  res.status(201).json({ success: true, data: booking });
}

export async function postQuotationRequest(req: Request, res: Response) {
  const quotation = await service.requestQuotation(req.body);
  res.status(201).json({ success: true, data: quotation });
}

export async function getQuotationRequests(req: Request, res: Response) {
  const quotations = await service.getQuotationRequests();
  res.json({ success: true, data: quotations });
}

export async function postHomepageCard(req: Request, res: Response) {
  const card = await service.createHomepageCard(req.body);
  res.status(201).json({ success: true, data: card });
}

export async function deleteHomepageCard(req: Request, res: Response) {
  const card = await service.deleteHomepageCard(Number(req.params.id));
  if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
  res.json({ success: true, data: card });
}

export async function postHomepageBackground(req: Request, res: Response) {
  const background = await service.createHomepageBackground(req.body);
  res.status(201).json({ success: true, data: background });
}

export async function deleteHomepageBackground(req: Request, res: Response) {
  const background = await service.deleteHomepageBackground(Number(req.params.id));
  if (!background) return res.status(404).json({ success: false, message: 'Background not found' });
  res.json({ success: true, data: background });
}

export async function adminLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  const token = signAdminToken({ email });
  res.json({ success: true, token });
}

export async function getAdminOverview(req: Request, res: Response) {
  const overview = await service.getAdminOverview();
  res.json({ success: true, data: overview });
}

export async function getAdminRecords(req: Request, res: Response) {
  const records = await service.getAdminRecords();
  res.json({ success: true, data: records });
}
