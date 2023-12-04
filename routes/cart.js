const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authJWT = require('../middleware/jwt.auth');

router.post('/', authJWT, cartController.addToCart);
router.get('', authJWT, cartController.getCart);
router.delete('/:productId', authJWT, cartController.removeFromCart);
router.put('/:productId', authJWT, cartController.updateQuantity);

module.exports = router;
