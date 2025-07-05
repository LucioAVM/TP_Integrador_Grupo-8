// Configuración del ORM (Sequelize) para SQL Server

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'Fenrir3d-productos', // Nombre de la base de datos
  process.env.DB_USER || 'Milaneso',           // Usuario
  process.env.DB_PASS || 'QueLindo.SeriaPromocionar-EstaMateria_123', // Contraseña
  {
    host: process.env.DB_HOST || 'fenrir3d-server-test.database.windows.net',
    dialect: 'mssql',
    port: 1433,
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: false
      }
    },
    logging: false // Cambia a true si quieres ver las queries en consola
  }
);

module.exports = sequelize;