import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbDialect = (process.env.DB_DIALECT as Dialect) || 'sqlite';

let sequelize: Sequelize;

if (dbDialect === 'postgres') {
  // AWS RDS PostgreSQL Configuration
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'gosh',
    ssl: process.env.DB_SSL === 'true',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 1,
      idle: 30000,
      acquire: 30000,
    },
  });
} else if (dbDialect === 'mysql') {
  // AWS RDS MySQL Configuration
  sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'gosh',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 1,
      idle: 30000,
      acquire: 30000,
    },
  });
} else {
  // Local SQLite (development)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false,
  });
}

export default sequelize;
