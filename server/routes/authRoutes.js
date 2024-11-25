const express = require("express");
const {
  register,
  login,
  logout,
} = require("../controllers/authController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

// Registration route - includes all necessary fields
router.post("/register", register); // Ensure that the register function handles the new fields
router.post("/login", login);
router.post("/logout", authenticateToken, logout);

module.exports = router;