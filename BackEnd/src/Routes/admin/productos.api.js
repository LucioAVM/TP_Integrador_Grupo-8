import express from 'express';
import productService from '../../services/productService.js';
import { requireAdmin } from '../../middlewares/auth.middleware.js';
import { validarProducto } from '../../middlewares/crearProductoMiddleware.js';

const router = express.Router();

// Rutas administrativas para productos (protegidas)
router.post('/', requireAdmin, validarProducto, async (req, res) => {
  try {
    const producto = await productService.createProduct(req.body);
    res.status(201).json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const producto = await productService.updateProduct(req.params.id, req.body);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const ok = await productService.deactivateProduct(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto dado de baja' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
