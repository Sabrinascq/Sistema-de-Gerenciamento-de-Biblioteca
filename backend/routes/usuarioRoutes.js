const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const auth = require('../middlewares/auth');

// Apenas Administrador pode gerenciar usuários
router.get('/', auth(['Administrador']), UsuarioController.getAll);
router.post('/', auth(['Administrador']), UsuarioController.create);
router.put('/:id', auth(['Administrador']), UsuarioController.update);
router.delete('/:id', auth(['Administrador']), UsuarioController.delete);

module.exports = router;