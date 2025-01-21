const PushNotificationToken = require("../models/PushNotificationToken");
const express = require("express");
const router = express.Router();

// Endpoint to save device token
router.post('/save-token', async (req, res) => {
  const { token,userId } = req.body;
 console.log("Received token:", token,userId);
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    let existingToken = await PushNotificationToken.findOne({ token });

    if (existingToken) {
      return res.status(200).json({ message: "Token already exists" });
    }

    const newToken = new PushNotificationToken({ token,userId });
    await newToken.save();

    res.status(200).json({ message: "Token saved successfully" });
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router