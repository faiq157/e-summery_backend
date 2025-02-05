const Notification = require("../../models/NotificationSchema");
const express = require("express");
const router = express.Router();

router.put('/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } 
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification marked as read", notification: updatedNotification });
  } catch (error) {
    console.error("Error updating notification status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports= router;