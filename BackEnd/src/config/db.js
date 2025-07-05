// Configuración de la base de datos: parámetros de conexión y setup inicial.

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'fenrir3d-server-test.database.windows.net',
  port: 1433,
  user: 'Milaneso',           
  password: 'QueLindo.SeriaPromocionar-EstaMateria_123',     
  database: 'Fenrir3d-productos',
  ssl: {
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;


