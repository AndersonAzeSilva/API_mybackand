const express = require('express');
const SecretaryController = require('../controllers/SecretaryController');
const db = require('../config/db');

const router = express.Router();

router.get('/secretaries', SecretaryController.listSecretaries);
router.post('/schedules', SecretaryController.createSchedule);
router.get('/available-times', SecretaryController.getAvailableTimes);

module.exports = router;
