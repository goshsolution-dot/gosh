import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import * as controller from '../controllers/apiController';
import { authenticateAdmin } from '../utils/jwt';

const router = Router();

router.get('/industries', asyncHandler(controller.getIndustries));
router.get('/solutions', asyncHandler(controller.getSolutions));
router.get('/solutions/:id', asyncHandler(controller.getSolution));
router.post('/demo-requests', asyncHandler(controller.postDemoRequest));
router.post('/discussions', asyncHandler(controller.postDiscussionRequest));
router.post('/payments', asyncHandler(controller.postPayment));
router.post('/hosting-requests', asyncHandler(controller.postHostingRequest));
router.get('/homepage', asyncHandler(controller.getHomepageData));
router.post('/admin/login', asyncHandler(controller.adminLogin));
router.get('/admin/overview', authenticateAdmin, asyncHandler(controller.getAdminOverview));
router.get('/admin/records', authenticateAdmin, asyncHandler(controller.getAdminRecords));
router.post('/admin/homepage/cards', authenticateAdmin, asyncHandler(controller.postHomepageCard));
router.delete('/admin/homepage/cards/:id', authenticateAdmin, asyncHandler(controller.deleteHomepageCard));
router.post('/admin/homepage/backgrounds', authenticateAdmin, asyncHandler(controller.postHomepageBackground));
router.delete('/admin/homepage/backgrounds/:id', authenticateAdmin, asyncHandler(controller.deleteHomepageBackground));

export default router;
