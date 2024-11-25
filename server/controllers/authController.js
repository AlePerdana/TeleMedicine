const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models");
const { Op } = require("sequelize");

// Register user
exports.register = async (req, res) => {
  const { 
    namaLengkap, // Full Name
    tanggalLahir, // Date of Birth
    jenisKelamin, // Gender
    alamat, // Address
    nomorTelepon, // Phone Number
    email, // Email Address
    password // Password
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the additional fields
    const user = await User.create({
      namaLengkap,
      tanggalLahir,
      jenisKelamin,
      alamat,
      nomorTelepon,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User  registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", Error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    
    res.json({ 
      token, 
      user_id: user.user_id,
      name: user.name, 
      email: user.email,
      role: user.role  // Explicitly add role to the response
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", Error: error.message });
  }
};

exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    // Simpan token ke tabel blacklist
    await TokenBlacklist.create({ token });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};