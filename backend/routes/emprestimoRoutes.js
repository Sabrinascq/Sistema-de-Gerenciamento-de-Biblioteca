const express = require('express');
const router = express.Router();

const EmprestimoController = require('../controllers/EmprestimoController');
const auth = require('../middlewares/auth');

// ======================================
// Consultas
// ======================================

router.get(
    '/buscar',
    auth(['Administrador', 'Bibliotecário']),
    EmprestimoController.search
);

router.get(
    '/meus',
    auth(['Leitor']),
    EmprestimoController.meusEmprestimos
);

router.get(
    '/:id',
    auth(['Administrador', 'Bibliotecário']),
    EmprestimoController.getById
);

router.get(
    '/',
    auth(['Administrador', 'Bibliotecário']),
    EmprestimoController.getAll
);

// ======================================
// Cadastro e Devolução
// ======================================

router.post(
    '/',
    auth(['Administrador', 'Bibliotecário']),
    EmprestimoController.create
);

router.put(
    '/:id/devolver',
    auth(['Administrador', 'Bibliotecário']),
    EmprestimoController.devolver
);

module.exports = router;