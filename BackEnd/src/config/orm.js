// Configuración del ORM (Sequelize) para SQL Server

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,        // Nombre de la base de datos
  process.env.DB_USER,        // Usuario
  process.env.DB_PASSWORD,    // Contraseña
  {
    host: process.env.DB_SERVER, // Servidor
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

module.exports = sequelize;