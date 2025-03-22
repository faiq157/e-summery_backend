const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");
router.post("/:id", async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
  
    try {
      if (!comment) {
        return res.status(400).json({ message: "Comment is required." });
      }
  
      const approval = await approvalSchema.findById(id);
      if (!approval) {
        return res.status(404).json({ message: "Approval not found." });
      }
  
      approval.comments.push({ text: comment, date: new Date() });
  
      const updatedApproval = await approval.save();
  
      res.status(200).json({
        message: "Comment added successfully.",
        data: updatedApproval,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Failed to add comment.", error: error.message });
    }
  });
module.exports = router;
  