import express from 'express';
import usuariosController from '../../Controllers/usuarios.controller.js';
import { validarUsuario } from '../../middlewares/validacion.js';

const router = express.Router();

router.post('/', validarUsuario, usuariosController.crearUsuario);

export default router;
