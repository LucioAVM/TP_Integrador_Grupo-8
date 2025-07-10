const express = require('express');
const adminAuthController = require('../controllers/adminAuth.controller');

const router = express.Router();

// Controlador de autenticación (debes crearlo)

// Ruta para login de administrador
router.post('/login', adminAuthController.login);

// Ruta para verificar autenticación (ejemplo)
router.get('/me', adminAuthController.me);

module.exports = router;