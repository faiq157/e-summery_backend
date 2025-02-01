
const express = require("express");
const crypto = require("crypto");
const User = require("../../models/User");
const { sendEmail } = require("../../utils/email");


const router = express.Router();
/**
 * @route POST /forgotpassword
 * @desc Send a password reset email
 */
router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
  const resetUrl = `https://e-summery.netlify.app/resetpassword/${resetToken}`;
    const mailOptions = {
      to: email,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetUrl}`,
    };
    await sendEmail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;