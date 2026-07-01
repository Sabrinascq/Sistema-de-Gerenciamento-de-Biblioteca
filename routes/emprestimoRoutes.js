const express = require('express');
const router = express.Router();
const EmprestimoController = require('../controllers/EmprestimoController');
const auth = require('../middlewares/auth');

// Rota para realizar novo empréstimo (Admin e Bibliotecário podem realizar)
router.post('/', auth(['Administrador', 'Bibliotecario']), EmprestimoController.create);

// Rota para listar empréstimos (Todos podem ver)
router.get('/', auth(['Administrador', 'Bibliotecario', 'Leitor']), EmprestimoController.getAll);

module.exports = router;