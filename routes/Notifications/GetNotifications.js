const PushNotificationToken = require("../../models/PushNotificationToken");
const Notification = require("../../models/NotificationSchema");
const admin = require("../../config/firebaseConfig"); // Assuming you have configured Firebase Admin SDK
const express = require("express");
const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params; // Extract userId from the URL parameter

  try {
    // Find notifications for the given userId
    const notifications = await Notification.find({ userId });

    // If no notifications are found, return a 404 response
    if (notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found for this user" });
    }

    // Return the notifications found
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router