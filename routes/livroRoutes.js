const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/LivroController'); // <- NOME MUDADO AQUI
const auth = require('../middlewares/auth');

// Rotas de Livros (TROCANDO TUDO PARA LivroController)
router.post('/', auth(['Administrador', 'Bibliotecario']), LivroController.create);
router.get('/', auth(['Administrador', 'Bibliotecario', 'Leitor']), LivroController.getAll);
router.get('/:id', auth(['Administrador', 'Bibliotecario', 'Leitor']), LivroController.getById);

router.put('/:id', auth(['Administrador', 'Bibliotecario']), LivroController.update);
router.delete('/:id', auth(['Administrador']), LivroController.delete); 

module.exports = router;