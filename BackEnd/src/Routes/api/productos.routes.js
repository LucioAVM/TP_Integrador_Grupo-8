const express = require('express');

const router = express.Router();

// Obtener todos los productos
router.get('/', (req, res) => {
    // Lógica para obtener productos
    res.send('Lista de productos');
});

// Obtener un producto por ID
router.get('/:id', (req, res) => {
    // Lógica para obtener un producto por ID
    res.send(`Producto con ID: ${req.params.id}`);
});

// Crear un nuevo producto
router.post('/', (req, res) => {
    // Lógica para crear un producto
    res.send('Producto creado');
});

// Actualizar un producto
router.put('/:id', (req, res) => {
    // Lógica para actualizar un producto
    res.send(`Producto actualizado con ID: ${req.params.id}`);
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
    // Lógica para eliminar un producto
    res.send(`Producto eliminado con ID: ${req.params.id}`);
});

module.exports = router;