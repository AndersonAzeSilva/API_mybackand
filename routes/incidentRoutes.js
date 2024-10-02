const express = require('express');
const { createOrUpdateIncident } = require('../controllers/incidentController');

const router = express.Router();

router.post('/incidents', createOrUpdateIncident);

module.exports = router;
