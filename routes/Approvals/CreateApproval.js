const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");
const upload = require("../../config/multerConfig");
const authMiddleware = require("../../middleware/authMiddleware");
const fs = require("fs");
const s3 = require("../../config/cloudfareConfig");

const BUCKET_NAME = "notesheets";
const R2_PUBLIC_URL = "https://pub-df4b0b355e6f47b294e478e797b911da.r2.dev";

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