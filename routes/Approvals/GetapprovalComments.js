const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");
router.get("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const approval = await approvalSchema.findById(id);
      if (!approval) {
        return res.status(404).json({ message: "Approval not found." });
      }
  
      res.status(200).json({
        message: "Comments retrieved successfully.",
        comments: approval.comments,
      });
    } catch (error) {
      console.error("Error retrieving comments:", error);
      res.status(500).json({ message: "Failed to retrieve comments.", error: error.message });
    }
  });
  
  module.exports = router;