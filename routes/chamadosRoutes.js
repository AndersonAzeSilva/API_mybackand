const express = require('express');
const router = express.Router();
const chamadosController = require('../controllers/chamadosController');
const db = require('../config/db');

router.post('/', chamadosController.createChamado);
router.get('/', chamadosController.getChamados);
// Adicione outras rotas de chamados conforme necessário.

module.exports = router;
