const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");
const upload = require("../../config/multerConfig");
const authMiddleware = require("../../middleware/authMiddleware");
const fs = require("fs");

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

    let base64Document = null;

    if (req.file) {
      try {
        // Read the file and convert it to Base64
        const fileContent = fs.readFileSync(req.file.path);
        base64Document = `data:${req.file.mimetype};base64,${fileContent.toString("base64")}`;

        // Optionally, delete the file after converting to Base64
        fs.unlinkSync(req.file.path);
      } catch (conversionError) {
        console.error("Document conversion error:", conversionError);
        return res.status(500).json({ message: "Failed to process document.", error: conversionError.message });
      }
    }

    const roleIndex = notesheet.roles.findIndex((r) => r.role === role);

    const commentObject = {
      user: role,
      comment,
      document: base64Document || null, // Store Base64 document if available
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

module.exports = router;