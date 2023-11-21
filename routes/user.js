const router = require('express').Router();
const controller = require('../controllers/user.controller');
const authJWT = require('../middleware/jwt.auth');
 
router.get('/', authJWT, controller.getUsers);

module.exports = router;