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
  try {
    const id = req.params.id;
    console.log('[Controller] Deleting card:', id);
    const card = await service.deleteHomepageCard(id);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    res.json({ success: true, data: card });
  } catch (error) {
    console.error('[Controller] Delete card error:', error);
    res.status(500).json({ success: false, message: `Failed to delete card: ${String(error)}` });
  }
}

export async function postHomepageBackground(req: Request, res: Response) {
  const background = await service.createHomepageBackground(req.body);
  res.status(201).json({ success: true, data: background });
}

export async function deleteHomepageBackground(req: Request, res: Response) {
  const background = await service.deleteHomepageBackground(req.params.id);
  if (!background) return res.status(404).json({ success: false, message: 'Background not found' });
  res.json({ success: true, data: background });
}

export async function adminLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  
  // Get admin credentials from environment variables
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim();
  const adminPassword = (process.env.ADMIN_PASSWORD || '').trim();
  
  // Sanitize input
  const inputEmail = (email || '').trim().toLowerCase();
  const inputPassword = (password || '').trim();
  
  console.log('[AdminLogin] Attempting login with:', {
    inputEmail,
    expectedEmail: adminEmail,
    passwordProvided: !!inputPassword,
    passwordMatch: inputPassword === adminPassword,
  });

  // Validate credentials
  if (!adminEmail || !adminPassword) {
    console.error('[AdminLogin] ERROR: Admin credentials not configured in environment variables');
    return res.status(500).json({ 
      success: false, 
      message: 'Server configuration error: Admin credentials not set' 
    });
  }

  if (inputEmail !== adminEmail.toLowerCase() || inputPassword !== adminPassword) {
    console.warn('[AdminLogin] Login failed: Invalid credentials');
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  console.log('[AdminLogin] Login successful for:', inputEmail);
  const token = signAdminToken({ email: inputEmail });
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

export async function getPresignedUploadUrl(req: Request, res: Response) {
  const { fileName, contentType, category } = req.body;

  if (!fileName || !contentType) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: fileName, contentType',
    });
  }

  try {
    const result = await service.getPresignedUploadUrl(fileName, contentType, category || 'general');
    res.json({
      success: true,
      presignedUrl: result.presignedUrl,
      key: result.key,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate presigned upload URL',
    });
  }
}
