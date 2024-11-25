const express = require('express');
const router = express.Router();
const { getAcceptedAppointments, addMedicalNotesAndComplete } = require('../controllers/dokterController');

// Fetch accepted appointments for the doctor
router.get('/appointments',getAcceptedAppointments);

// Add medical notes and complete appointment
router.post('/medical-notes',addMedicalNotesAndComplete);

module.exports = router;