// Import dependencies
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../../utils/email");
const User = require("../../models/User");

const router = express.Router();

/**
 * @route POST /login
 * @desc Login a user and send an OTP to email
 */
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY));

    // Save OTP and expiry to user
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP to user's email
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    await sendEmail(mailOptions);

    res.status(200).json({ msg: "OTP sent to your email." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;