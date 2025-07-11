import sql from 'mssql';

let config;
if (process.env.SQLCONNSTR_FENRIRDB) {
  // En Azure
  config = process.env.SQLCONNSTR_FENRIRDB;
} else {
  // En local
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

import sql from 'mssql';

export async function getProductos() {
  try {
    await sql.connect(connStr);
    const result = await sql.query('SELECT * FROM impresoras WHERE activo = 1');
    console.log('Resultado SQL:', result); // <-- Agrega este log
    return result.recordset;
  } catch (err) {
    console.error('Error al consultar productos:', err); // <-- Agrega este log
    return [];
  } finally {
    await sql.close();
  }
}