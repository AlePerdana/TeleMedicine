const { Appointment, User } = require('../models');

exports.createAppointment = async (req, res) => {
  try {
    const { pasien_id, dokter_id, tanggal_appointment, keluhan } = req.body;

    if (!dokter_id || !tanggal_appointment || !keluhan) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAppointment = await Appointment.create({
      pasien_id,
      dokter_id,
      tanggal_appointment,
      keluhan,
      status: 'pending',
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Error creating appointment", error: error.message });
  }
};

exports.getPasienAppointments = async (req, res) => {
  try {
    const pasien_id = req.user?.user_id; // Use optional chaining

    const appointments = await Appointment.findAll({
      where: pasien_id ? { pasien_id } : {}, // Adjust query based on pasien_id
      include: [
        {
          model: User,
          as: 'dokter',
          attributes: ['namaLengkap']
        }
      ],
      attributes: {
        include: ['medical_notes'] // Include medical_notes in the response
      }
    });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error.message); // Log error message
    console.error('Stack Trace:', error.stack); // Log stack trace for debugging
    res.status(500).json({ 
      message: 'Error fetching appointments', 
      error: error.message 
    });
  }
};

  exports.updateAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      const { pasien_id, tanggal_appointment, keluhan } = req.body; // Get pasien_id from the request body
  
      // Validate request body
      if (!pasien_id || !tanggal_appointment || !keluhan) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const appointment = await Appointment.findOne({ 
        where: { 
          appointment_id: id, 
          pasien_id, // Use pasien_id from the request body
          status: 'pending' 
        } 
      });
  
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      const updatedAppointment = await appointment.update({
        tanggal_appointment,
        keluhan
      });
  
      res.json(updatedAppointment);
    } catch (error) {
      console.error('Error updating appointment:', error); // Detailed logging
      res.status(500).json({ 
        message: 'Error updating appointment', 
        error: error.message 
      });
    }
  };
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOne({ 
      where: { 
        appointment_id: id, 
        status: 'pending' 
      } 
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.destroy();

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error); // Detailed logging
    res.status(500).json({ 
      message: 'Error deleting appointment', 
      error: error.message 
    });
  }
};

exports.getDokters = async (req, res) => {
  try {
    const dokters = await User.findAll({
      where: { 
        role: 'dokter' 
      },
      attributes: [
        'user_id', 
        'namaLengkap', 
        'email', 
        'nomorTelepon', 
        'jenisKelamin',
      ],
      order: [['namaLengkap', 'ASC']],
    });

    const formattedDokters = dokters.map(dokter => ({
      user_id: dokter.user_id,
      namaLengkap: dokter.namaLengkap,
      email: dokter.email,
      nomorTelepon: dokter.nomorTelepon,
      jenisKelamin: dokter.jenisKelamin,
    }));

    res.json(formattedDokters);
  } catch (error) {
    console.error('Error fetching dokters:', error); // Detailed logging
    res.status(500).json({ 
      message: 'Error fetching dokters', 
      error: error.message 
    });
  }
};