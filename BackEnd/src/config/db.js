import sql from 'mssql';

// Función para parsear la cadena de conexión en Azure
function parseConnectionString(connStr) {
  const params = {};
  connStr.split(';').forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) params[key.trim().toLowerCase()] = value.trim();
  });
  return {
    user: params.uid,
    password: params.pwd,
    server: params.server.replace('tcp:', '').split(',')[0],
    database: params.database,
    port: parseInt(params.server.split(',')[1], 10) || 1433,
    options: {
      encrypt: params.encrypt === 'yes',
      trustServerCertificate: params.trustservercertificate === 'yes'
    }
  };
}

let config;
if (process.env.SQLCONNSTR_FENRIRDB) {
  // En Azure: parsea la cadena de conexión
  config = parseConnectionString(process.env.SQLCONNSTR_FENRIRDB);
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