const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find approvals where the sendTo array includes the specified ID
    const approvals = await approvalSchema.find({ sentTo: id });

    if (approvals.length === 0) {
      return res.status(404).json({ message: "No approvals found for the specified ID." });
    }

    // Respond with the matched approvals
    res.status(200).json({
      message: "Approvals retrieved successfully for the specified ID.",
      data: approvals,
    });
  } catch (error) {
    console.error("Error retrieving approvals by sendTo ID:", error);
    res.status(500).json({ message: "Failed to retrieve approvals by sendTo ID.", error: error.message });
  }
});
module.exports= router