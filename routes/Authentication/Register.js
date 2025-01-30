// Import dependencies
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const router = express.Router();

/**
 * @route POST /register
 * @desc Register a new user
 */
router.post("/", async (req, res) => {
  const { fullname, email, password, role,department } = req.body;

  try {
    if (!role) {
      return res.status(400).json({ msg: "Role is required" });
    }

    // Check if the role already exists in the database
    const existingRole = await User.findOne({ role });
    if (existingRole) {
      return res.status(400).json({ msg: `The role '${role}' already exists in the system` });
    }

    // Check if the user already exists with the provided email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // Create a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ fullname, email, password: hashedPassword, role ,department});
    await user.save();

    // Generate a token
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router