const express = require("express");
const User = require("../../models/User");

const router = express.Router();

/**
 * @route GET /roles
 * @desc Get all unique roles with their IDs and emails in the system
 * @access Private (Admin only)
 */
router.get("/", async (req, res) => {
  try {
    // Fetch users and their roles
    const users = await User.find({}, { role: 1, _id: 1, email: 1 }); // Select role, _id, and email

    // Get distinct roles, IDs, and emails
    const roles = users.map(user => ({
      role: user.role,
      id: user._id,
      email: user.email // Include email
    }));

    // Remove duplicates by role (keeping the first occurrence)
    const uniqueRoles = Array.from(new Set(roles.map(r => r.role)))
      .map(role => roles.find(r => r.role === role));

    res.status(200).json(uniqueRoles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
