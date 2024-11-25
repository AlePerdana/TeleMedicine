const { Appointment, User } = require('../models');

// Fetch accepted appointments for a specific doctor
exports.getAcceptedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: 'pasien', attributes: ['namaLengkap'] },
        { model: User, as: 'dokter', attributes: ['namaLengkap'] } // Include doctor information if needed
      ],
      attributes: {
        include: ['keluhan', 'tanggal_appointment'] // Include keluhan and medical_notes in the response
      }
    });

    res.json(appointments);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ 
      message: 'Error fetching accepted appointments', 
      error: error.message 
    });
  }
};
// Add medical notes and update appointment status to completed
// Add medical notes and update appointment status to completed
exports.addMedicalNotesAndComplete = async (req, res) => {
  try {
    const { appointment_id, medical_notes } = req.body; // Extract appointment_id and medical_notes from the request body

    // Check if medical_notes is provided
    if (!medical_notes || medical_notes.trim() === '') {
      return res.status(400).json({ message: 'Medical notes are required.' });
    }

    const appointment = await Appointment.findOne({
      where: { 
        appointment_id 
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the appointment with medical notes and change status to completed
    const updatedAppointment = await appointment.update({
      medical_notes,
      status: 'completed'
    });

    res.json(updatedAppointment);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ 
      message: 'Error adding medical notes and completing appointment', 
      error: error.message 
    });
  }
};