const express = require('express');
const router = express.Router();

// Listado de productos (vista principal)
router.get('/', (req, res) => {
  // Aquí deberías obtener los productos de la base de datos
  res.render('productos/index', { products, page, totalPages, limit, q });
});

// Formulario para nuevo producto
router.get('/nuevo', (req, res) => {
  res.render('productos/nuevo');
});

// Formulario para editar producto
router.get('/:id/editar', (req, res) => {
  // Busca el producto por ID
  res.render('productos/editar', { producto });
});

module.exports = router;