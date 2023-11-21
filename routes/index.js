const express = require('express');
const router = express.Router();
const product = require('./product');
const auth = require('./auth');
const user = require('./user');

router.use('/api/product', product);
router.use('/api/auth', auth);
router.use('/api/user', user);
module.exports = router;