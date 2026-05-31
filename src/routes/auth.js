const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { guest } = require('../middlewares/auth');

router.get('/cadastro', guest, AuthController.showRegister);
router.post('/cadastro', guest, AuthController.register);
router.get('/login', guest, AuthController.showLogin);
router.post('/login', guest, AuthController.login);
router.post('/logout', AuthController.logout);

module.exports = router;
