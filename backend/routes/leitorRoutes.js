const express = require('express');
const router = express.Router();

const LeitorController = require('../controllers/LeitorController');
const auth = require('../middlewares/auth');

// ==========================
// Consultas
// ==========================

router.get(
  '/buscar',
  auth(['Administrador', 'Bibliotecário']),
  LeitorController.search
);

router.get(
  '/:id/historico',
  auth(['Administrador', 'Bibliotecário', 'Leitor']),
  LeitorController.historico
);

router.get(
  '/:id',
  auth(['Administrador', 'Bibliotecário']),
  LeitorController.getById
);

router.get(
  '/',
  auth(['Administrador', 'Bibliotecário']),
  LeitorController.getAll
);

// ==========================
// Cadastro, Atualização e Inativação
// ==========================

router.post(
  '/',
  auth(['Administrador', 'Bibliotecário']),
  LeitorController.create
);

router.put(
  '/:id',
  auth(['Administrador', 'Bibliotecário']),
  LeitorController.update
);

router.patch(
  '/:id/inativar',
  auth(['Administrador']),
  LeitorController.inativar
);

router.patch(
  '/:id/reativar',
  auth(['Administrador']),
  LeitorController.reativar
);

module.exports = router;