const express = require('express');
const router = express.Router();
const controller = require('../controllers/insumosController');

router.get('/', controller.getAll);

module.exports = router;