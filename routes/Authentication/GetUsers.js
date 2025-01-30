const express = require("express");
const User = require("../../models/User");


const router = express.Router();

/**
 * @route GET /users
 * @desc Get all users (Admin only)
 * @access Private (Admin only)
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;