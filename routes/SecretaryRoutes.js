const express = require('express');
const router = express.Router();
const secretaryController = require('../controllers/secretaryController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para criar uma nova secretária
router.post('/', authMiddleware, secretaryController.createSecretary);

// Rota para listar todas as secretárias
router.get('/', authMiddleware, secretaryController.getAllSecretaries);

// Outras rotas relacionadas a secretárias...

module.exports = router;
