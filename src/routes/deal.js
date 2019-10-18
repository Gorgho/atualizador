const express = require('express');
const router = express.Router();
const controller = require('../controllers/deal.crtl')

router.get('/', controller.get);

module.exports = router;