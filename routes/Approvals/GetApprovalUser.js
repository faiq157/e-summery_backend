// Route to get approvals by a specific user ID
const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Assuming approvals have a 'userId' field to track the user who submitted them
    const approvals = await approvalSchema.find({ userId });

    if (approvals.length === 0) {
      return res.status(404).json({ message: "No approvals found for this user." });
    }

    // Respond with approvals for the specified user
    res.status(200).json({
      message: "Approvals for the user retrieved successfully.",
      data: approvals,
    });
  } catch (error) {
    console.error("Error retrieving approvals for user:", error);
    res.status(500).json({ message: "Failed to retrieve approvals for user.", error: error.message });
  }
});

module.exports = router