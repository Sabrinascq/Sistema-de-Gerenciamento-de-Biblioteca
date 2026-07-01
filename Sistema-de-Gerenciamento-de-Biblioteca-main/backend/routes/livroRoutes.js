const express = require('express');
const router = express.Router();

const LivroController = require('../controllers/LivroController');
const auth = require('../middlewares/auth');

// ==========================
// Consultas
// ==========================

// Buscar por filtros (deve vir antes de /:id)
router.get(
  '/buscar',
  auth(['Administrador', 'Bibliotecario', 'Leitor']),
  LivroController.search
);

// Listar todos
router.get(
  '/',
  auth(['Administrador', 'Bibliotecario', 'Leitor']),
  LivroController.getAll
);

// Buscar por ID
router.get(
  '/:id',
  auth(['Administrador', 'Bibliotecario', 'Leitor']),
  LivroController.getById
);

// ==========================
// Cadastro
// ==========================

router.post(
  '/',
  auth(['Administrador', 'Bibliotecario']),
  LivroController.create
);

// ==========================
// Atualização
// ==========================

router.put(
  '/:id',
  auth(['Administrador', 'Bibliotecario']),
  LivroController.update
);

// ==========================
// Exclusão
// ==========================

router.delete(
  '/:id',
  auth(['Administrador']),
  LivroController.delete
);

module.exports = router;