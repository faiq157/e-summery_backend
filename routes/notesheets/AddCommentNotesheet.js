const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");
const User = require("../../models/User");
const upload = require("../../config/multerConfig");
const authMiddleware = require("../../middleware/authMiddleware");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const s3 = require("../../config/cloudfareConfig");
const BUCKET_NAME = "notesheets";

 const R2_PUBLIC_URL = "https://pub-df4b0b355e6f47b294e478e797b911da.r2.dev";

 router.post("/:id", authMiddleware, upload.single("document"), async (req, res) => {
  const { id } = req.params;
  const { role, comment } = req.body;

  try {
    if (!comment || !role) {
      return res.status(400).json({ message: "Role and comment are required." });
    }

    const notesheet = await Notesheet.findById(id);
    if (!notesheet) {
      return res.status(404).json({ message: "Notesheet not found." });
    }

    if (notesheet.currentHandler !== role) {
      return res.status(403).json({ message: "You are not authorized to comment on this notesheet." });
    }

    let documentUrl = null;

    if (req.file) {
      try {
        const fileContent = fs.readFileSync(req.file.path);
        const fileName = `notesheets/${Date.now()}_${req.file.originalname}`;

        const params = {
          Bucket: BUCKET_NAME, // Replace with your R2 bucket name
          Key: fileName,
          Body: fileContent,
          ContentType: req.file.mimetype,
        };

        await s3.upload(params).promise();
        documentUrl = `${R2_PUBLIC_URL}/${fileName}`;
      } catch (uploadError) {
        console.error("Document upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload document.", error: uploadError.message });
      }
    }


    const roleIndex = notesheet.roles.findIndex((r) => r.role === role);

    const commentObject = {
      user: role,
      comment,
      document: documentUrl || null, // Include document URL if available
      timestamp: new Date(),
    };

    if (roleIndex !== -1) {
      notesheet.roles[roleIndex].comments.push(commentObject);
    } else {
      notesheet.roles.push({
        role: role,
        status: "New", // Or any default status
        comments: [commentObject],
      });
    }

    const updatedNoteSheet = await notesheet.save();

    res.status(200).json({
      message: "Comment added successfully.",
      data: updatedNoteSheet,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      message: "Failed to add comment.",
      error: error.message,
    });
  }
});

module.exports=router;