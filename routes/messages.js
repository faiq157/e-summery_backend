// routes/messages.js
const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");  
const upload = require("../config/multerConfig");
const router = express.Router();

// POST: Send a message from one user to another with optional file upload
router.post("/send", upload.single("file"), async (req, res) => {
  try {
    const { senderId, recipientId, content, fileComment } = req.body;

    // Create a new message
    const message = new Message({
      senderId,
      recipientId,
      content,
      fileUrl: req.file ? req.file.path : null, // Store file path if uploaded
      fileComment: fileComment || "", 
    });

    await message.save();
    res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error("Error sending message:", error); // Log the error for debugging
    res.status(500).json({ message: "Failed to send message", error });
  }
});

// GET: Retrieve all messages for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find messages where the user is either the sender or the recipient
    const messages = await Message.find({
      $or: [{ senderId: userId }, { recipientId: userId }]
    }).populate("senderId recipientId", "name email");

    res.status(200).json({ data: messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve messages", error });
  }
});
// GET: Retrieve messages between two users
router.get("/send", async (req, res) => {
  try {
    const { senderId, recipientId } = req.query;

    // Validate the presence of senderId and recipientId
    if (!senderId || !recipientId) {
      return res.status(400).json({ message: "senderId and recipientId are required" });
    }

    // Find messages between sender and recipient
    const messages = await Message.find({
      $or: [
        { senderId: senderId, recipientId: recipientId },
        { senderId: recipientId, recipientId: senderId }
      ]
    }).populate("senderId recipientId", "name email");

    res.status(200).json({ data: messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve messages", error });
  }
});

module.exports = router;
