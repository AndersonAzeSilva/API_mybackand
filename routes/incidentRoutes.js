const express = require('express');
const { getIncidents, exportIncidents } = require('../controllers/incidentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getIncidents);
router.get('/export', authMiddleware, exportIncidents);

module.exports = router;
