const express = require('express');
const router = express.Router();
const secretaryController = require('../controllers/secretaryController');

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Rotas para Secretaria
///////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/', secretaryController.createSecretary); 
router.get('/', secretaryController.getAllSecretaries); 
router.get('/:id', secretaryController.getSecretaryById); 
router.put('/:id', secretaryController.updateSecretary); 
router.delete('/:id', secretaryController.deleteSecretary); 

module.exports = router;

///////////////////////////////////////////////////////////////////////////////////////////////////////
