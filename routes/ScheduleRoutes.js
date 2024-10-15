const express = require('express');
const db = require('../config/db');
const ScheduleController = require('../controllers/ScheduleController'); // Será criado um controlador específico para os agendamentos

const router = express.Router();

router.post('/appointments', ScheduleController.createAppointment);
router.get('/my-appointments', ScheduleController.getMyAppointments);
router.delete('/cancel-appointment/:id', ScheduleController.cancelAppointment);

module.exports = router;
