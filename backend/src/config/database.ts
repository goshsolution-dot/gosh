import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const dialect = (process.env.DB_DIALECT || 'sqlite') as 'sqlite' | 'postgres' | 'mysql';
const storage = process.env.DB_STORAGE || './database.sqlite';

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, { logging: false })
  : new Sequelize({
      dialect,
      storage,
      logging: false,
    });

export default sequelize;
