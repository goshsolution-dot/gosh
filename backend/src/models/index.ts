import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface IndustryAttributes {
  id: number;
  name: string;
}

interface SolutionAttributes {
  id: number;
  name: string;
  description: string;
  demoLink?: string;
  demoAvailable: boolean;
  industryId: number;
}

interface CustomerAttributes {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface BookingAttributes {
  id: number;
  type: 'demo' | 'discussion' | 'hosting';
  customerId: number;
  solutionId?: number;
  requestedDate?: string;
  message: string;
  provider?: string;
  serviceDetails?: string;
}

interface PaymentAttributes {
  id: number;
  customerId: number;
  amount: number;
  transactionReference: string;
  service: string;
}

interface EquipmentAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

interface HomepageCardAttributes {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  badgeText?: string;
  demoLink?: string;
  images: string;
  expandedText?: string;
  order: number;
}

interface HomepageBackgroundAttributes {
  id: number;
  title: string;
  imageData: string;
  order: number;
}

type IndustryModel = Model<IndustryAttributes, Optional<IndustryAttributes, 'id'>> & IndustryAttributes;
type SolutionModel = Model<SolutionAttributes, Optional<SolutionAttributes, 'id'>> & SolutionAttributes;
type CustomerModel = Model<CustomerAttributes, Optional<CustomerAttributes, 'id'>> & CustomerAttributes;
type BookingModel = Model<BookingAttributes, Optional<BookingAttributes, 'id'>> & BookingAttributes;
type PaymentModel = Model<PaymentAttributes, Optional<PaymentAttributes, 'id'>> & PaymentAttributes;
type EquipmentModel = Model<EquipmentAttributes, Optional<EquipmentAttributes, 'id'>> & EquipmentAttributes;
type HomepageCardModel = Model<HomepageCardAttributes, Optional<HomepageCardAttributes, 'id'>> & HomepageCardAttributes;
type HomepageBackgroundModel = Model<HomepageBackgroundAttributes, Optional<HomepageBackgroundAttributes, 'id'>> & HomepageBackgroundAttributes;

const Industry = sequelize.define<IndustryModel>('Industry', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Solution = sequelize.define<SolutionModel>('Solution', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  demoLink: { type: DataTypes.STRING, allowNull: true },
  demoAvailable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  industryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
});

const Customer = sequelize.define<CustomerModel>('Customer', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
});

const Booking = sequelize.define<BookingModel>('Booking', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.ENUM('demo', 'discussion', 'hosting'), allowNull: false },
  customerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  solutionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  requestedDate: { type: DataTypes.STRING, allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
  provider: { type: DataTypes.STRING, allowNull: true },
  serviceDetails: { type: DataTypes.TEXT, allowNull: true },
});

const Payment = sequelize.define<PaymentModel>('Payment', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  customerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  transactionReference: { type: DataTypes.STRING, allowNull: false },
  service: { type: DataTypes.STRING, allowNull: false },
});

const Equipment = sequelize.define<EquipmentModel>('Equipment', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});

const HomepageCard = sequelize.define<HomepageCardModel>('HomepageCard', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.TEXT, allowNull: false },
  icon: { type: DataTypes.STRING, allowNull: false, defaultValue: '📦' },
  badgeText: { type: DataTypes.STRING, allowNull: true },
  demoLink: { type: DataTypes.STRING, allowNull: true },
  images: { type: DataTypes.TEXT, allowNull: false, defaultValue: '[]' },
  expandedText: { type: DataTypes.TEXT, allowNull: true },
  order: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
});

const HomepageBackground = sequelize.define<HomepageBackgroundModel>('HomepageBackground', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  imageData: { type: DataTypes.TEXT, allowNull: false },
  order: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
});

Industry.hasMany(Solution, { foreignKey: 'industryId', as: 'solutions' });
Solution.belongsTo(Industry, { foreignKey: 'industryId', as: 'industry' });
Customer.hasMany(Booking, { foreignKey: 'customerId', as: 'bookings' });
Booking.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Solution.hasMany(Booking, { foreignKey: 'solutionId', as: 'bookings' });
Booking.belongsTo(Solution, { foreignKey: 'solutionId', as: 'solution' });
Customer.hasMany(Payment, { foreignKey: 'customerId', as: 'payments' });
Payment.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

export {
  sequelize,
  Industry,
  Solution,
  Customer,
  Booking,
  Payment,
  Equipment,
  HomepageCard,
  HomepageBackground,
};
