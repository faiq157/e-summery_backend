const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");
router.post("/", async (req, res) => {
  const { approvalId, userIds } = req.body; // assuming userIds is an array of user IDs

  if (!approvalId || !userIds || userIds.length === 0) {
    return res.status(400).json({ message: "Approval ID and at least one user ID are required." });
  }

  try {
    // Find the approval document by ID
    const approval = await approvalSchema.findById(approvalId);
    if (!approval) {
      return res.status(404).json({ message: "Approval not found." });
    }

    // Add the user IDs to the sentTo field (avoid duplicates)
    const updatedSentTo = [...new Set([...approval.sentTo, ...userIds])];

    // Update the sentTo field in the database
    approval.sentTo = updatedSentTo;
    approval.sended = true;
    approval.status = "received";
    const updatedApproval = await approval.save();

    // Logic to send approval to multiple users (e.g., email or notification)
    userIds.forEach((userId) => {
      console.log(`Sending approval to user with ID: ${userId}`);
      // Implement your sending logic here (e.g., send email, notification, etc.)
    });

    res.status(200).json({
      message: "Approval sent to users successfully.",
      data: updatedApproval,
    });
  } catch (error) {
    console.error("Error sending approval to users:", error);
    res.status(500).json({ message: "Failed to send approval.", error: error.message });
  }
});
module.exports = router