const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/RelatorioController');
const auth = require('../middlewares/auth');

// Apenas Administrador acessa relatórios gerais
router.get('/resumo', auth(['Administrador']), RelatorioController.getResumo);

module.exports = router;