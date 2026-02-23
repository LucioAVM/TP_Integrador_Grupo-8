import db from '../config/db.js';

export const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM insumos WHERE activo = 1');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener insumos' });
  }
};

export default { getAll };