
import express from 'express';
import adminController from '../../Controllers/admin.controller.js';
import { requireAdmin } from '../../middlewares/auth.middleware.js';
import upload from '../../config/multerConfig.js';
import { validarProducto } from '../../middlewares/crearProductoMiddleware.js';

const router = express.Router();

// Login / Logout
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Dashboard y productos (rutas protegidas)
router.get('/dashboard', requireAdmin, adminController.getDashboard);
router.get('/productos/:id', requireAdmin, adminController.getProductoDetalle);

router.get('/crearProducto', requireAdmin, adminController.getCrearProducto);
// Ruta para crear producto con subida de imagen (campo 'imagen') y validación previa
router.post('/crearProducto', requireAdmin, upload.single('imagen'), validarProducto, adminController.postCrearProducto);

router.get('/productos/:id/editar', requireAdmin, adminController.getEditarProducto);
// Permitir subir nueva imagen al editar (campo 'imagen')
router.post('/productos/:id/editar', requireAdmin, upload.single('imagen'), adminController.postEditarProducto);

// Detalle de una venta
router.get('/ventas/:id', requireAdmin, adminController.getDetalleVenta);

// Registros de inicio de sesión (últimos 10)
router.get('/registros', requireAdmin, adminController.getRegistros);
// Asistencia (Encuestas)
router.get('/asistencia', requireAdmin, adminController.getAsistencia);
// Exportar logs a Excel
router.get('/admin/exportar-logs', requireAdmin, adminController.exportarLogsExcel);

router.post('/productos/:id/desactivar', requireAdmin, adminController.postDesactivar);
router.post('/productos/:id/reactivar', requireAdmin, adminController.postReactivar);

export default router;
