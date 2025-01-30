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
router.post("/", upload.single("pdf"), async (req, res) => {
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
module.exports = router;