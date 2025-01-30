const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const router = express.Router();

/**
 * @route PUT /edit/:id
 * @desc Edit user details
 */
router.put("/:id", async (req, res) => {
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
module.exports = router;