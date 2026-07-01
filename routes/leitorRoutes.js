const express = require('express');
const router = express.Router();
const LeitorController = require('../controllers/LeitorController');
const auth = require('../middlewares/auth');

router.post('/', auth(['Administrador', 'Bibliotecario']), LeitorController.create);
router.get('/', auth(['Administrador', 'Bibliotecario']), LeitorController.getAll);

module.exports = router;