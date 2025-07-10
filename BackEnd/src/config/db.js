import sql from 'mssql';

// Función para parsear la cadena de conexión de Azure a objeto
function parseConnectionString(connStr) {
  const params = {};
  connStr.split(';').forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) params[key.trim().toLowerCase()] = value.trim();
  });
  return {
    user: params.uid,
    password: params.pwd,
    server: params.server?.replace('tcp:', '').split(',')[0],
    database: params.database,
    port: params.server?.includes(',') ? parseInt(params.server.split(',')[1], 10) : 1433,
    options: {
      encrypt: params.encrypt === 'yes',
      trustServerCertificate: params.trustservercertificate === 'yes'
    }
  };
}

// Detecta si está en Azure (cadena de conexión) o local (.env)
let config;
if (process.env.SQLCONNSTR_FENRIRDB) {
  config = parseConnectionString(process.env.SQLCONNSTR_FENRIRDB); // Azure: parsea la cadena
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