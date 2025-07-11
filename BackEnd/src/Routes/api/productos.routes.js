const express = require('express');
const router = express.Router();
const Producto = require('../../Models/producto');

// Obtener todos los productos activos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({ where: { activo: true } });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un producto
router.post('/', async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Producto.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    const producto = await Producto.findByPk(req.params.id);
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Baja lógica de un producto
router.delete('/:id', async (req, res) => {
  try {
    const [updated] = await Producto.update({ activo: false }, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto dado de baja' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;