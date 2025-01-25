const express = require("express");
const router = express.Router();
const approvalSchema = require("../models/ApprovalSchema");
const upload = require("../config/multerConfig");
const authMiddleware = require("../middleware/authMiddleware");
const fs = require("fs");
const s3 = require("../config/cloudfareConfig");

const BUCKET_NAME = "notesheets";
const R2_PUBLIC_URL = "https://pub-df4b0b355e6f47b294e478e797b911da.r2.dev";

// Route for uploading a new approval (existing)
router.post("/approval", upload.single("pdf"), async (req, res) => {
  const { title } = req.body;

  try {
    if (!title || !req.file) {
      return res.status(400).json({ message: "Title and PDF file are required." });
    }

    const user = req.user; // Assuming `authMiddleware` adds the authenticated user to `req.user`.

    // Upload PDF to S3 bucket
    const fileContent = fs.readFileSync(req.file.path);
    const fileName = `pdfs/${Date.now()}_${req.file.originalname}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: req.file.mimetype,
    };

    await s3.upload(params).promise();
    const pdfUrl = `${R2_PUBLIC_URL}/${fileName}`;

    // Save to MongoDB
    const newPDF = new approvalSchema({
      title,
      pdfUrl,
    });

    const savedPDF = await newPDF.save();

    // Respond with the saved entry
    res.status(201).json({
      message: "PDF uploaded successfully.",
      data: savedPDF,
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Failed to upload PDF.", error: error.message });
  }
});

// Route to get all approvals (existing)
router.get("/approvals", async (req, res) => {
  try {
    const approvals = await approvalSchema.find();

    if (approvals.length === 0) {
      return res.status(404).json({ message: "No approvals found." });
    }

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

// Route to delete an approval by ID
router.delete("/approval/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const approval = await approvalSchema.findById(id);

    if (!approval) {
      return res.status(404).json({ message: "Approval not found." });
    }

    // Delete from S3 bucket
    const fileName = approval.pdfUrl.split("/").pop();
    const params = {
      Bucket: BUCKET_NAME,
      Key: `pdfs/${fileName}`,
    };

    await s3.deleteObject(params).promise();

    // Delete from MongoDB
    await approvalSchema.findByIdAndDelete(id);

    res.status(200).json({
      message: "Approval deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting approval:", error);
    res.status(500).json({ message: "Failed to delete approval.", error: error.message });
  }
});

router.post("/approval/send", async (req, res) => {
  const { approvalId, userIds } = req.body; // assuming userIds is an array of user IDs

  if (!approvalId || !userIds || userIds.length === 0) {
    return res.status(400).json({ message: "Approval ID and at least one user ID are required." });
  }

  try {
    // Find the approval document by ID
    const approval = await approvalSchema.findById(approvalId);
    if (!approval) {
      return res.status(404).json({ message: "Approval not found." });
    }

    // Add the user IDs to the sentTo field (avoid duplicates)
    const updatedSentTo = [...new Set([...approval.sentTo, ...userIds])];

    // Update the sentTo field in the database
    approval.sentTo = updatedSentTo;
    const updatedApproval = await approval.save();

    // Logic to send approval to multiple users (e.g., email or notification)
    userIds.forEach((userId) => {
      console.log(`Sending approval to user with ID: ${userId}`);
      // Implement your sending logic here (e.g., send email, notification, etc.)
    });

    res.status(200).json({
      message: "Approval sent to users successfully.",
      data: updatedApproval,
    });
  } catch (error) {
    console.error("Error sending approval to users:", error);
    res.status(500).json({ message: "Failed to send approval.", error: error.message });
  }
});

// Route to get approvals by a specific user ID
router.get("/approvals/user/:userId", async (req, res) => {
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

module.exports = router;
