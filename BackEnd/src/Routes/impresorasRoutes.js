const express = require('express');
const router = express.Router();
const controller = require('../controllers/impresorasController');

router.get('/', controller.getAll);

module.exports = router;