import express from 'express';
import usuariosController from '../../Controllers/usuarios.controller.js';

const router = express.Router();

// Obtener todos los usuarios
router.get('/', usuariosController.obtenerUsuarios);

// Obtener un usuario por ID
router.get('/:id', usuariosController.obtenerUsuarioPorId);

// Crear un nuevo usuario
router.post('/', usuariosController.crearUsuario);

// Actualizar un usuario existente
router.put('/:id', usuariosController.actualizarUsuario);

// Eliminar un usuario
router.delete('/:id', usuariosController.eliminarUsuario);

export default router;