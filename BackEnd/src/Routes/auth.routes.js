const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const impresorasController = require('../controllers/impresoras.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/impresoras', impresorasController.getAll);

module.exports = router;