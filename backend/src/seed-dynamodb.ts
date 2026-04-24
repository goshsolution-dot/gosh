/**
 * Seed initial data for GOSH application
 * Creates Industries, Solutions, and Homepage content
 */

import { IndustryOps, SolutionOps, HomepageCardOps, HomepageBackgroundOps } from './services/dynamodbService';

export async function seedInitialData() {
  try {
    // Check if data already exists
    const existingIndustries = await IndustryOps.getAll();
    if (existingIndustries.length > 0) {
      console.log('[Seed] Data already exists, skipping seed');
      return;
    }

    console.log('[Seed] Starting data initialization...');

    // Create Industries
    const educationIndustry = await IndustryOps.create({ name: 'Education' });
    const retailIndustry = await IndustryOps.create({ name: 'Retail' });
    const healthIndustry = await IndustryOps.create({ name: 'Health' });

    console.log('[Seed] Industries created');

    // Create Solutions
    await SolutionOps.create({
      name: 'Learning Management System',
      description: 'A modern LMS for schools and training providers.',
      demoLink: 'https://example.com/lms-demo',
      demoAvailable: true,
      industryId: educationIndustry.id,
    });

    await SolutionOps.create({
      name: 'Retail Inventory Platform',
      description: 'Inventory and sales management for retail businesses.',
      demoAvailable: false,
      industryId: retailIndustry.id,
    });

    await SolutionOps.create({
      name: 'Health Clinic Portal',
      description: 'Patient management and appointment booking.',
      demoLink: 'https://example.com/health-demo',
      demoAvailable: true,
      industryId: healthIndustry.id,
    });

    console.log('[Seed] Solutions created');

    // Create Homepage Cards
    await HomepageCardOps.create({
      title: 'Hotel Management System',
      subtitle: 'Complete booking and operations management',
      icon: '🏨',
      expandedText: 'Manage reservations, guest check-ins, room status, billing, and staff schedules in one integrated platform. Real-time dashboard with occupancy rates and revenue tracking.',
      badgeText: 'FEATURED',
      demoLink: 'https://demo.gosh.local',
      images: [],
      order: 1,
    });

    await HomepageCardOps.create({
      title: 'Retail POS Solution',
      subtitle: 'Point of sale and inventory tracking',
      icon: '🛒',
      expandedText: 'Streamline checkout processes, manage inventory in real-time, track sales analytics, and generate detailed reports. Perfect for shops, boutiques, and supermarkets.',
      badgeText: 'POPULAR',
      demoLink: 'https://demo.gosh.local',
      images: [],
      order: 2,
    });

    await HomepageCardOps.create({
      title: 'Pharmacy Management',
      subtitle: 'Prescription and stock management',
      icon: '💊',
      expandedText: 'Manage prescription inventories, track medication stock levels, handle patient records and billing. Compliant with health regulations.',
      badgeText: 'NEW',
      demoLink: 'https://demo.gosh.local',
      images: [],
      order: 3,
    });

    console.log('[Seed] Homepage cards created');

    // Create Homepage Backgrounds
    await HomepageBackgroundOps.create({
      title: 'Blue Gradient',
      imageData: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      order: 1,
    });

    console.log('[Seed] Homepage backgrounds created');
    console.log('[Seed] Initial data seeding complete!');
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    // Don't throw - allow app to continue even if seeding fails
  }
}
