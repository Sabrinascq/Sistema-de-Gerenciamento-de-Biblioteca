const express = require('express');
const router = express.Router();

const LivroController = require('../controllers/LivroController');
const auth = require('../middlewares/auth');

// ==========================
// Consultas
// ==========================

router.get(
  '/buscar',
  auth(['Administrador', 'Bibliotecário', 'Leitor']),
  LivroController.search
);

router.get(
  '/',
  auth(['Administrador', 'Bibliotecário', 'Leitor']),
  LivroController.getAll
);

router.get(
  '/:id',
  auth(['Administrador', 'Bibliotecário', 'Leitor']),
  LivroController.getById
);

// ==========================
// Cadastro, Atualização e Exclusão
// ==========================

router.post(
  '/',
  auth(['Administrador', 'Bibliotecário']),
  LivroController.create
);

router.put(
  '/:id',
  auth(['Administrador', 'Bibliotecário']),
  LivroController.update
);

router.delete(
  '/:id',
  auth(['Administrador']),
  LivroController.delete
);

module.exports = router;