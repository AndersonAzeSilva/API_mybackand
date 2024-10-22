const express = require('express');
const router = express.Router();
const secretaryController = require('../controllers/secretaryController');

// Rotas para Secretaria
router.post('/', secretaryController.createSecretary); // Verifique se esta função está definida e exportada
router.get('/', secretaryController.getAllSecretaries); // Verifique se esta função está definida e exportada
router.get('/:id', secretaryController.getSecretaryById); // Verifique se esta função está definida e exportada
router.put('/:id', secretaryController.updateSecretary); // Verifique se esta função está definida e exportada
router.delete('/:id', secretaryController.deleteSecretary); // Verifique se esta função está definida e exportada

module.exports = router;
