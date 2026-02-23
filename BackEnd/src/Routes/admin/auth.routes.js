import express from 'express';
import adminAuthController from '../../Controllers/adminAuth.controller.js';

const router = express.Router();

// Ruta para login de administrador
router.post('/login', adminAuthController.login);

// Ruta para verificar autenticación (ejemplo)
router.get('/me', adminAuthController.me);

export default router;