const express = require('express');
const router = express.Router();

const EmprestimoController = require('../controllers/EmprestimoController');
const auth = require('../middlewares/auth');

// ======================================
// Consultas
// ======================================

// Buscar por status
router.get(
    '/buscar',
    auth(['Administrador', 'Bibliotecario']),
    EmprestimoController.search
);

// Buscar empréstimo por ID
router.get(
    '/:id',
    auth(['Administrador', 'Bibliotecario']),
    EmprestimoController.getById
);

// Listar todos
router.get(
    '/',
    auth(['Administrador', 'Bibliotecario']),
    EmprestimoController.getAll
);

// ======================================
// Cadastro
// ======================================

router.post(
    '/',
    auth(['Administrador', 'Bibliotecario']),
    EmprestimoController.create
);

// ======================================
// Registrar devolução
// ======================================

router.put(
    '/:id/devolver',
    auth(['Administrador', 'Bibliotecario']),
    EmprestimoController.devolver
);

module.exports = router;