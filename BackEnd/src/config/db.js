import sql from 'mssql';

console.log('===> db.js actualizado');

/*let config;
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
}*/

const config = {
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

export async function getProductos() {
  try {
    console.log('Entrando a getProductos');
    console.log('Cadena de conexión:', config);
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM impresoras WHERE activo = 1');
    console.log('Resultado SQL:', result);
    return result.recordset;
  } catch (err) {
    console.error('Error al consultar productos:', err);
    return [];
  } finally {
    await sql.close();
  }
}