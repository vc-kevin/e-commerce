const router = require('express').Router();
const controller = require('../controllers/product.controller');
const validateProduct = require('../validators/product.validator');
const authJWT = require('../middleware/jwt.auth');
 
router.post('/', authJWT, validateProduct, controller.addProduct);
router.get('/', authJWT, controller.getProducts);
router.delete('/:id', authJWT, controller.deleteProduct);
router.put('/:id', authJWT, controller.updateProduct);

module.exports = router;