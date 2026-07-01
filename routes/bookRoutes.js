const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');
const auth = require('../middlewares/auth'); // O seu arquivo de proteção (JWT)

// Rota para Cadastrar Livro (Protegida: só Admin e Bibliotecário acessam)
router.post('/', auth(['Administrador', 'Bibliotecario']), BookController.create);

// Rota para Listar Livros (Protegida: todos os perfis podem ver)
router.get('/', auth(['Administrador', 'Bibliotecario', 'Leitor']), BookController.getAll);

module.exports = router;