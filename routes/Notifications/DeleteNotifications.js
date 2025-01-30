const PushNotificationToken = require("../../models/PushNotificationToken");
const Notification = require("../../models/NotificationSchema");
const admin = require("../../config/firebaseConfig"); // Assuming you have configured Firebase Admin SDK
const express = require("express");
const router = express.Router();


router.delete('/:userId', async (req, res) => {
  const { userId } = req.params; // Extract userId from the URL parameter

  try {
    // Delete all notifications for the given userId
    const result = await Notification.deleteMany({ userId });

    // If no notifications were deleted, return a 404 response
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No notifications found to delete for this user" });
    }

    // Return a success response with the count of deleted notifications
    res.status(200).json({
      message: "All notifications deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router