const express = require("express");
const {
    createAppointment,
    getPasienAppointments,
    updateAppointment,
    deleteAppointment,
    getDokters
} = require("../controllers/pasienController");

const router = express.Router();

// Appointment routes (no authentication required)
router.post("/appointments", createAppointment); // Create a new appointment
router.get("/appointments", getPasienAppointments); // Get all appointments for a patient
router.put("/appointments/:id", updateAppointment); // Update an existing appointment
router.delete("/appointments/:id", deleteAppointment); // Delete an existing appointment

// Dokter routes
router.get("/dokters", getDokters); // Get all doctors

module.exports = router;