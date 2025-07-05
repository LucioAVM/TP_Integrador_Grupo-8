const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const impresorasController = require('../controllers/impresorasController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/impresoras', impresorasController.getAll);

module.exports = router;