const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");
const authMiddleware = require("../../middleware/authMiddleware");

// Route to get notesheets by userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find approvals where userId matches
    const approvals = await approvalSchema.find({ userId });

    if (!approvals || approvals.length === 0) {
      return res.status(404).json({ message: "No notesheets found for this user." });
    }

    res.status(200).json({ data: approvals });
  } catch (error) {
    console.error("Error fetching notesheets:", error);
    res.status(500).json({ message: "Failed to fetch notesheets.", error: error.message });
  }
});

module.exports = router;