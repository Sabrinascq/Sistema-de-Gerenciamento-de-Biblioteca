const express = require('express');
const router = express.Router();

const LeitorController = require('../controllers/LeitorController');
const auth = require('../middlewares/auth');

// ==========================
// Consultas
// ==========================

// Buscar por nome ou CPF
router.get(
  '/buscar',
  auth(['Administrador', 'Bibliotecario']),
  LeitorController.search
);

// Histórico de empréstimos do leitor
router.get(
  '/:id/historico',
  auth(['Administrador', 'Bibliotecario']),
  LeitorController.historico
);

// Buscar leitor por ID
router.get(
  '/:id',
  auth(['Administrador', 'Bibliotecario']),
  LeitorController.getById
);

// Listar todos os leitores
router.get(
  '/',
  auth(['Administrador', 'Bibliotecario']),
  LeitorController.getAll
);

// ==========================
// Cadastro
// ==========================

router.post(
  '/',
  auth(['Administrador', 'Bibliotecario']),
  LeitorController.create
);

// ==========================
// Atualização
// ==========================

router.put(
  '/:id',
  auth(['Administrador', 'Bibliotecario']),
  LeitorController.update
);

// ==========================
// Inativação
// ==========================

router.patch(
  '/:id/inativar',
  auth(['Administrador']),
  LeitorController.inativar
);

module.exports = router;