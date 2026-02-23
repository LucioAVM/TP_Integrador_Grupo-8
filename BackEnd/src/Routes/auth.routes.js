import express from 'express';
import * as authController from '../Controllers/auth.controller.js';
import impresorasController from '../Controllers/impresoras.controller.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/impresoras', impresorasController.getAll);

export default router;