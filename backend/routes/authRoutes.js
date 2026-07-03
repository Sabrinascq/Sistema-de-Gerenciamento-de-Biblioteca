const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const auth = require('../middlewares/auth');

// Registro de usuários do sistema restrito a Administradores
router.post('/register', auth(['Administrador']), AuthController.register);

// Login é público
router.post('/login', AuthController.login);

module.exports = router;