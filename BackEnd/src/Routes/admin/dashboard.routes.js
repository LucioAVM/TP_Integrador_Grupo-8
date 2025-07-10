const express = require('express');

const router = express.Router();

// Ejemplo de ruta para obtener información del dashboard
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenido al dashboard de administración' });
});

// Ejemplo de ruta para obtener estadísticas
router.get('/estadisticas', (req, res) => {
    // Aquí iría la lógica para obtener estadísticas
    res.json({ usuarios: 100, ventas: 50 });
});

module.exports = router;