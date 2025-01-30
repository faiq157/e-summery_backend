// Import dependencies
const express = require("express");
const User = require("../../models/User");
const { default: mongoose } = require("mongoose");

const router = express.Router();
/**
 * @route DELETE /delete/:id
 * @desc Delete a user
 */
router.delete("/:id", async (req, res) => {
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

module.exports = router