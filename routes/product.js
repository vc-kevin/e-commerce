const router = require('express').Router();
const controller = require('../controllers/product.controller');
const validateProduct = require('../validators/product.validator');
 
router.post('/', validateProduct, controller.addProduct);
router.get('/', controller.getProducts);
router.delete('/:id', controller.deleteProduct);
router.patch('/', controller.updateProduct);

module.exports = router;