import { sequelize } from './models/index';
const { HomepageCard, HomepageBackground } = sequelize.models || {};

async function seedData() {
  try {
    console.log('Starting seed...');
    
    // Sync database
    await sequelize.sync();
    console.log('Database synced');

    const Card = sequelize.models.HomepageCard;
    const Background = sequelize.models.HomepageBackground;

    // Create sample homepage cards
    const card1 = await Card.create({
      title: 'Hotel Management System',
      subtitle: 'Complete booking and operations management',
      icon: '🏨',
      expandedText: 'Manage reservations, guest check-ins, room status, billing, and staff schedules in one integrated platform. Real-time dashboard with occupancy rates and revenue tracking.',
      badgeText: 'FEATURED',
      demoLink: 'https://demo.gosh.local',
      images: [],
      order: 1,
    });

    const card2 = await Card.create({
      title: 'Retail POS Solution',
      subtitle: 'Point of sale and inventory tracking',
      icon: '🛒',
      expandedText: 'Streamline checkout processes, manage inventory in real-time, track sales analytics, and generate detailed reports. Perfect for shops, boutiques, and supermarkets.',
      badgeText: 'POPULAR',
      demoLink: 'https://demo.gosh.local',
      images: [],
      order: 2,
    });

    const card3 = await Card.create({
      title: 'Pharmacy Management',
      subtitle: 'Prescription and stock management',
      icon: '💊',
      expandedText: 'Manage prescription inventories, track medication stock levels, handle patient records and billing. Compliant with health regulations.',
      badgeText: 'NEW',
      demoLink: 'https://demo.gosh.local',
      images: [],
      order: 3,
    });

    console.log('✓ Created 3 homepage cards');

    // Create sample background images
    const bg1 = await Background.create({
      title: 'Blue Gradient',
      imageData: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      order: 1,
    });

    const bg2 = await Background.create({
      title: 'Pink Gradient',
      imageData: 'linear-gradient(to right, #f093fb 0%, #f5576c 100%)',
      order: 2,
    });

    console.log('✓ Created 2 background images');
    console.log('✓ Seed completed!');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

seedData();
