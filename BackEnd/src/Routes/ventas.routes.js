import express from 'express';
import ventasController from '../Controllers/ventas.controller.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/ventas', requireAdmin, ventasController.getVentas);
router.get('/ventas/:id', requireAdmin, ventasController.getVentaDetalle);
router.post('/ventas/nueva', requireAdmin, ventasController.postNuevaVenta);

export default router;
