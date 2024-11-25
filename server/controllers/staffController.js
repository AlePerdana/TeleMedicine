const { Appointment, User } = require('../models');

exports.getPendingAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: 'pasien', attributes: ['namaLengkap'] },
        { model: User, as: 'dokter', attributes: ['namaLengkap'] }
      ]
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching pending appointments', 
      error: error.message 
    });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, staff_id } = req.body; // Include staff_id in the request body

    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the appointment status and associate it with the staff_id
    const updatedAppointment = await appointment.update({ 
      status,
      staff_id // Assuming your Appointment model has a staff_id field
    });

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating appointment status', 
      error: error.message 
    });
  }
};

exports.acceptAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { staff_id } = req.body; // Get staff_id from request body

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the appointment status to 'accepted' and associate it with staff_id
    await appointment.update({ 
      status: 'accepted',
      staff_id // Assuming your Appointment model has a staff_id field
    });

    res.json({ message: 'Appointment accepted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error accepting appointment',
      error: error.message
    });
  }
};

exports.rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { staff_id } = req.body; // Get staff_id from request body

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the appointment status to 'rejected' and associate it with staff_id
    await appointment.update({ 
      status: 'rejected',
      staff_id // Assuming your Appointment model has a staff_id field
    });

    res.json({ message: 'Appointment rejected successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error rejecting appointment',
      error: error.message
    });
  }
};