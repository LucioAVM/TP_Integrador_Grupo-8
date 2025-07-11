const { Sequelize } = require('sequelize');

// Configuración de la conexión a Azure SQL usando variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,         // Nombre de la base de datos
  process.env.DB_USER,         // Usuario
  process.env.DB_PASSWORD,     // Contraseña
  {
    host: process.env.DB_SERVER,   // Servidor
    port: process.env.DB_PORT || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: false
      }
    },
    logging: false // Opcional: desactiva logs de SQL en consola
  }
);

module.exports = sequelize;