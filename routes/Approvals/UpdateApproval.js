const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, registrarOffice, phoneFax, email, refNo, date, bodyText } = req.body;
  
    try {
      if (!title || !registrarOffice || !phoneFax || !email || !refNo || !date || !bodyText) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const updatedApproval = await approvalSchema.findByIdAndUpdate(
        id,
        {
          title,
          registrarOffice,
          phoneFax,
          email,
          refNo,
          date,
          bodyText,
        },
        { new: true }
      );
  
      if (!updatedApproval) {
        return res.status(404).json({ message: "Approval not found." });
      }
  
      res.status(200).json({
        message: "Approval updated successfully.",
        data: updatedApproval,
      });
    } catch (error) {
      console.error("Error updating approval:", error);
      res.status(500).json({ message: "Failed to update approval.", error: error.message });
    }
  });
    
  module.exports = router;