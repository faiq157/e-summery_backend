const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");

router.get("/", async (req, res) => {
  try {
    const approvals = await approvalSchema.find();
    // console.log("approval",approvals)

    // Respond with all approvals
    res.status(200).json({
      message: "Approvals retrieved successfully.",
      data: approvals,
    });
  } catch (error) {
    console.error("Error retrieving approvals:", error);
    res.status(500).json({ message: "Failed to retrieve approvals.", error: error.message });
  }
});

module.exports = router