// Configuración del ORM (Sequelize) para SQL Server
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    dialect: 'mssql',
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: false
      }
    },
    logging: false
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa');
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
  }
})();

export default sequelize;