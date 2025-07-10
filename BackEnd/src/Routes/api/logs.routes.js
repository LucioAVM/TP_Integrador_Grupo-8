const express = require('express');

const router = express.Router();

// Obtener todos los logs
router.get('/', (req, res) => {
    // Lógica para obtener logs
    res.send('Lista de logs');
});

// Crear un nuevo log
router.post('/', (req, res) => {
    // Lógica para crear un log
    res.send('Log creado');
});

module.exports = router;