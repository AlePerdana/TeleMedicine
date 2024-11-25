const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { TokenBlacklist } = require("../models");

// Promisify jwt.verify to use async/await
const verifyToken = promisify(jwt.verify);

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    console.log('Token received:', token); // Log the token

    if (!token) {
      return res.status(401).json({ message: "Access denied!" });
    }

    const [blacklistedToken, decoded] = await Promise.all([
      TokenBlacklist.findOne({ where: { token } }),
      verifyToken(token, process.env.SECRET_KEY),
    ]);

    if (blacklistedToken) {
      return res.status(401).json({
        message: "Token has been blacklisted. Please login again.",
      });
    }

    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    console.error('Token validation error:', error); // Log the error
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;