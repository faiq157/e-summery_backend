const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");
const authMiddleware = require("../../middleware/authMiddleware");
const fs = require("fs");

// Route for uploading a new approval (existing)
router.post("/", async (req, res) => {
  const { title,registrarOffice,phoneFax,email,refNo,date,bodyText } = req.body;

  try {
    if (!title || !registrarOffice || !phoneFax || !email || !refNo ||!date ||!bodyText) {
      return res.status(400).json({ message: "All Field are required." });
    }


    // Save to MongoDB
    const NewApproval = new approvalSchema({
      title,
      registrarOffice,
      phoneFax,
      email,
      refNo,
      date,
      bodyText,
      status: "new" 
    });

    const savedApproval = await NewApproval.save();

    // Respond with the saved entry
    res.status(201).json({
      message: "Approval Draft Created successfully.",
      data: savedApproval,
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Failed to upload PDF.", error: error.message });
  }
});
module.exports = router;