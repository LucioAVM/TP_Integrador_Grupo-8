import express from 'express';
import controller from '../Controllers/insumos.controller.js';

const router = express.Router();

router.get('/', controller.getAll);

export default router;