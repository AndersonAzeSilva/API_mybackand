const express = require('express');
const router = express.Router();
const {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncident,
    deleteIncident
} = require('../controllers/incidentController'); // Certifique-se de que as funções estão corretamente importadas

// Rota para criar um incidente
router.post('/', createIncident);

// Rota para listar todos os incidentes
router.get('/', getAllIncidents);

// Rota para buscar um incidente específico pelo ID
router.get('/:id', getIncidentById);

// Rota para atualizar um incidente
router.put('/:id', updateIncident);

// Rota para excluir um incidente
router.delete('/:id', deleteIncident);

module.exports = router;
