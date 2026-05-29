import { Sequelize } from 'sequelize';

const useEncrypt = process.env.DB_ENCRYPT ? process.env.DB_ENCRYPT === 'true' : true;
const trustServerCertificate = process.env.DB_TRUST_SERVER_CERTIFICATE
  ? process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
  : true;

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
        encrypt: useEncrypt,
        trustServerCertificate,
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