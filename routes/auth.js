const router = require('express').Router();
const controller = require('../controllers/auth.controller');
 
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/verify', controller.verify);
router.post('/forgotPassword', controller.forgotPassword);
router.post('/resetPassword', controller.resetPassword);

module.exports = router;