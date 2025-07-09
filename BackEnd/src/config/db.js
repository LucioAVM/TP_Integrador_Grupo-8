const sql = require('mssql');

const config = process.env.SQLCONNSTR_FENRIRDB;

async function getProductos() {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Productos WHERE activo = 1');
    return result.recordset;
  } catch (err) {
    console.error('Error al consultar productos:', err);
    return [];
  }
}

module.exports = { getProductos };