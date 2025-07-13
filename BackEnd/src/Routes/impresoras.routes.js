const express = require('express');
const router = express.Router();
const controller = require('../controllers/insumos.controller'); // acá no se que iba

router.get('/', controller.getAll);

module.exports = router;