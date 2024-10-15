const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const db = require('../config/db');

router.post('/google', authController.loginWithGoogle);
// Adicione outras rotas de autenticação conforme necessário.

module.exports = router;
