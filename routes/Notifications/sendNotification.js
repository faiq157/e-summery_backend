const PushNotificationToken = require("../../models/PushNotificationToken");
const Notification = require("../../models/NotificationSchema");
const admin = require("../../config/firebaseConfig"); // Assuming you have configured Firebase Admin SDK
const express = require("express");
const router = express.Router();

// Route to send notification and store in database
router.post('/send-notification', async (req, res) => {
  const { title, body, userId,link } = req.body;

  if (!title || !body || !userId) {
    return res.status(400).json({ message: "Title, body, and userId are required" });
  }

  try {
    const userTokenRecord = await PushNotificationToken.findOne({ userId }).select('token');
    console.log(userTokenRecord);
    if (!userTokenRecord) {
      return res.status(404).json({ message: "No token found for this user" });
    }

    const fcmToken = userTokenRecord.token;
    if (!fcmToken) {
      return res.status(400).json({ message: "Token is missing for this user" });
    }

    console.log(fcmToken);
    const message = {
      notification: {
        title,
        body,
        link,
      },
      token: fcmToken, // The token of the specific user
    };

    // Send notification to the specific user using Firebase Admin SDK (send instead of sendEachForMulticast)
    const response = await admin.messaging().send(message); // Change here to send instead of sendEachForMulticast

    // Store the notification details in the database
    const newNotification = new Notification({
      userId,
      title,
      body,
      link,
      status: 'sent', // Notification sent successfully
    });

    // Save the notification to the database
    await newNotification.save();

    // Respond with success
    res.status(200).json({ message: `Notification sent successfully to user ${userId}` });
  } catch (error) {
    console.error("Error sending notification:", error);
    // Save the notification with failed status in case of an error
    const newNotification = new Notification({
      userId,
      title,
      body,
      link,
      status: 'failed', // Notification failed
    });

    // Save the failed notification to the database
    await newNotification.save();

    // Respond with failure
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router