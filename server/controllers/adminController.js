// controllers/userController.js
const bcrypt = require("bcrypt");
const { User } = require("../models/index"); // Ensure User model is correctly imported

// Register a new user
exports.register = async (req, res) => {
  const { 
    namaLengkap,
    tanggalLahir,
    jenisKelamin,
    alamat,
    nomorTelepon,
    email,
    password,
    role
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      namaLengkap,
      tanggalLahir,
      jenisKelamin,
      alamat,
      nomorTelepon,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "User  registered successfully", user });
  } catch (error) {
    console.error("Registration error:", error); // Log the error for debugging
    res.status(400).json({ message: "Error registering user", error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Exclude password from the response for security
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetching users error:", error); // Log the error for debugging
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Update a user
exports.updateUser  = async (req, res) => {
  const { id } = req.params;
  const { namaLengkap, tanggalLahir, jenisKelamin, alamat, nomorTelepon, email, password, role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Update fields
    user.namaLengkap = namaLengkap;
    user.tanggalLahir = tanggalLahir;
    user.jenisKelamin = jenisKelamin;
    user.alamat = alamat;
    user.nomorTelepon = nomorTelepon;
    user.email = email;
    user.role = role;

    // Hash password only if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ message: "User  updated successfully", user });
  } catch (error) {
    console.error("Updating user error:", error); // Log the error for debugging
    res.status(400).json({ message: "Error updating user", error: error.message });
  }
};

// Delete a user
exports.deleteUser  = async (req, res) => {
  const { id } = req.params; // This should correspond to user_id in your model

  try {
    const user = await User.findOne({ where: { user_id: id } }); // Use user_id to find the user
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "User  deleted successfully" });
  } catch (error) {
    console.error("Deleting user error:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};