import sql from 'mssql';
import 'dotenv/config';

let config;
if (process.env.SQLCONNSTR_FENRIRDB) {
  config = process.env.SQLCONNSTR_FENRIRDB; // Azure
} else {
  config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
      encrypt: true,
      trustServerCertificate: false
    }
  };
}

export async function getProductos() {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM impresoras WHERE activo = 1');
    return result.recordset;
  } catch (err) {
    console.error('Error al consultar productos:', err);
    return [];
  }
}