const express = require('express');
const router = express.Router();
const incidentsController = require('../controllers/incidentsController');
const db = require('../config/db');


router.get('/', incidentsController.getIncidents);
router.delete('/:id', incidentsController.deleteIncident);
// Adicione outras rotas de ocorrências conforme necessário.

module.exports = router;
