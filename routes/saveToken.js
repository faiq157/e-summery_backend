const PushNotificationToken = require("../models/PushNotificationToken");
const express = require("express");
const router = express.Router();

router.post('/save-token', async (req, res) => {
  const { token, userId } = req.body;
  console.log("Received token:", token, userId);

  if (!token || !userId) {
    return res.status(400).json({ message: "Token and userId are required" });
  }

  try {
    // Check if the userId already exists in the database
    let existingEntry = await PushNotificationToken.findOne({ userId });

    if (existingEntry) {
      // Update the token for the existing userId
      existingEntry.token = token;
      await existingEntry.save();
      return res.status(200).json({ message: "Token updated successfully" });
    }

    // Create a new entry if userId does not exist
    const newToken = new PushNotificationToken({ token, userId });
    await newToken.save();

    res.status(200).json({ message: "Token saved successfully" });
  } catch (error) {
    console.error("Error saving/updating token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router