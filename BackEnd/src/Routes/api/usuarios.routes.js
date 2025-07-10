const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');

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

module.exports = router;