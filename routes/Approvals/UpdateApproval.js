const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");

router.put("/", async (req, res) => {
    const { approvalId } = req.body;
  
    if (!approvalId) {
      return res.status(400).json({ message: "Approval ID is required." });
    }
  
    try {
      // Find the approval document by ID
      const approval = await approvalSchema.findById(approvalId);
      if (!approval) {
        return res.status(404).json({ message: "Approval not found." });
      }
  
      // Update the status to "completed"
      approval.status = "completed";
      const updatedApproval = await approval.save();
  
      res.status(200).json({
        message: "Approval status updated to completed successfully.",
        data: updatedApproval,
      });
    } catch (error) {
      console.error("Error updating approval status to completed:", error);
      res.status(500).json({ message: "Failed to update approval status.", error: error.message });
    }
  });
  
  module.exports = router;