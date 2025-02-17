const User = require("../../models/User");
const express = require('express');
const jwt = require('jsonwebtoken'); // Ensure this line is added
const router = express.Router();

/**
 * @route POST /verify-otp
 * @desc Verify the OTP and return a token
 */
router.post("/", async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User not found" });
  
      // Check OTP and expiry
      if (user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
      }
  
      // Clear OTP after verification
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
  
      // Generate token
      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      res.json({
        token,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          department: user.department,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

module.exports = router;
