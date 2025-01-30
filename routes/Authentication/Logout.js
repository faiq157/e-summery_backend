// Import dependencies
const express = require("express");


const router = express.Router();

/**
 * @route POST /logout
 * @desc Logout a user
 */
router.post("/", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
});
 module.exports = router