import express from 'express';
const router = express.Router();
import productService from '../../services/productService.js';
import Producto from '../../Models/producto.js';

// Public API: listado paginado, búsqueda y filtros (compatible con frontend)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 6, 1);
    const q = req.query.q || null;
    const categoria = req.query.categoria || null;
    const tipo = req.query.tipo || null;

    const data = await productService.list({ page, limit, q, categoria, tipo });
    res.json(data);
  } catch (err) {
    console.error('Error API /api/productos:', err);
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

// Filtros para la UI
router.get('/filters', async (req, res) => {
  try {
    const categoriasRows = await Producto.findAll({
      attributes: ['categoria'],
      where: { activo: true },
      group: ['categoria']
    });
    const tiposRows = await Producto.findAll({
      attributes: ['tipo'],
      where: { activo: true },
      group: ['tipo']
    });
    const categorias = Array.from(new Set(categoriasRows.map(r => (r.categoria || '').toString().toLowerCase()).filter(Boolean)));
    const tipos = Array.from(new Set(tiposRows.map(r => (r.tipo || '').toString().toLowerCase()).filter(Boolean)));
    res.json({ categorias, tipos });
  } catch (err) {
    console.error('Error API /api/productos/filters:', err);
    res.status(500).json({ error: 'Error al obtener filtros' });
  }
});

// Obtener un producto por ID (unificado vía vista)
router.get('/:id', async (req, res) => {
  try {
    const producto = await productService.getById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    console.error('Error API /api/productos/:id', err);
    res.status(500).json({ error: err.message });
  }
});
export default router;