import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT || 1433,
    dialect: 'mssql',
    timezone: '-03:00',
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: false,
        // Evitar conversiones de fecha con offsets incompatibles en algunos despliegues
        useUTC: false,
        connectTimeout: 30000,
        requestTimeout: 30000
      }
    }
    ,
    logging: false
  }
);

export default sequelize;