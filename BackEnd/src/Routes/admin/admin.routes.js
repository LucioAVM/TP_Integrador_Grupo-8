import express from 'express';
import adminController from '../../Controllers/admin.controller.js';
import { requireAdmin } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Login / Logout
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Dashboard y productos (rutas protegidas)
router.get('/dashboard', requireAdmin, adminController.getDashboard);
router.get('/productos', requireAdmin, adminController.getProductos);
router.get('/productos/:id', requireAdmin, adminController.getProductoDetalle);

router.get('/crearProducto', requireAdmin, adminController.getCrearProducto);
router.post('/crearProducto', requireAdmin, adminController.postCrearProducto);

router.get('/productos/:id/editar', requireAdmin, adminController.getEditarProducto);
router.post('/productos/:id/editar', requireAdmin, adminController.postEditarProducto);

router.post('/productos/:id/desactivar', requireAdmin, adminController.postDesactivar);
router.post('/productos/:id/reactivar', requireAdmin, adminController.postReactivar);

export default router;
