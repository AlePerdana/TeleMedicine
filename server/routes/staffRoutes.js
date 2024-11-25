const express = require("express");
const { 
  getPendingAppointments, 
  updateAppointmentStatus,
  acceptAppointment,
  rejectAppointment
} = require("../controllers/staffController");

const router = express.Router();

// GET route to fetch pending appointments
router.get("/pending-appointments", getPendingAppointments);

// PUT route to update appointment status
router.put("/appointments/:id", updateAppointmentStatus);

// PATCH route to accept appointment
router.patch("/appointments/:id/accept", acceptAppointment);

// PATCH route to reject appointment
router.patch("/appointments/:id/reject", rejectAppointment);

module.exports = router;