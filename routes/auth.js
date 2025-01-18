// Import dependencies
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { default: mongoose } = require("mongoose");

const router = express.Router();

/**
 * @route POST /register
 * @desc Register a new user
 */
/**
 * @route POST /register
 * @desc Register a new user
 */
router.post("/register", async (req, res) => {
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


/**
 * @route POST /login
 * @desc Login a user and return a token
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate token
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });

    // Send user information and token
    res.json({
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST /forgotpassword
 * @desc Send a password reset email
 */
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetUrl = `https://e-summery.netlify.app/resetpassword/${resetToken}`;
    const mailOptions = {
      to: email,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route POST /reset-password/:token
 * @desc Reset the user password
 */
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route POST /logout
 * @desc Logout a user
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
});

/**
 * @route PUT /edit/:id
 * @desc Edit user details
 */
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { fullname, email, password, role,department } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (fullname) user.fullname = fullname;
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ msg: "Email is already in use by another user" });
      }
      user.email = email;
    }
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;
    if (department) user.department = department;
    await user.save();
    res.status(200).json({ msg: "User updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route DELETE /delete/:id
 * @desc Delete a user
 */
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid user ID" });
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route GET /users
 * @desc Get all users (Admin only)
 * @access Private (Admin only)
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});
/**
 * @route GET /roles
 * @desc Get all unique roles in the system
 * @access Private (Admin only)
 */
router.get("/roles", async (req, res) => {
  try {
    const roles = await User.distinct("role");
    res.status(200).json(roles); 
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
