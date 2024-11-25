const express = require("express");
const { register, getAllUsers, updateUser , deleteUser  } = require("../controllers/adminController");

const router = express.Router();

// POST route for user registration
router.post("/", register); // No authentication required for registration

// GET route to fetch all users
router.get("/", getAllUsers); // No authentication required to get all users

// PUT route to update a user
router.put("/:id", updateUser ); // No authentication required to update a user

// DELETE route to delete a user
router.delete("/:id", deleteUser ); // No authentication required to delete a user

module.exports = router;