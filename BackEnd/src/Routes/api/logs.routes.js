import express from 'express';
const router = express.Router();

// Obtener todos los logs
router.get('/', (req, res) => {
    res.send('Lista de logs');
});

// Crear un nuevo log
router.post('/', (req, res) => {
    res.send('Log creado');
});

export default router;