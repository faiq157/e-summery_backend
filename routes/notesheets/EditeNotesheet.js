
const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");
const upload = require("../../config/multerConfig");
const authMiddleware = require("../../middleware/authMiddleware");

router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { description, subject, userName, email, contact_number, userEmail } = req.body;

  try {
    const notesheet = await Notesheet.findById(id);
    if (!notesheet) {
      return res.status(404).json({ message: "Notesheet not found." });
    }

    // Update the fields with new values
    notesheet.description = description || notesheet.description;
    notesheet.subject = subject || notesheet.subject;
    notesheet.userName = userName || notesheet.userName;
    notesheet.email = email || notesheet.email;
    notesheet.contact_number = contact_number || notesheet.contact_number;
    notesheet.userEmail = userEmail || notesheet.userEmail;
    notesheet.image = req.file ? req.file.path : notesheet.image;

    // Log the action in history
    if (!notesheet.history) notesheet.history = [];
    notesheet.history.push({
      role: req.user.role,
      action: `Updated Notesheet with ID: ${id}`,
      timestamp: new Date(),
    });

    // Save the updated notesheet
    const updatedNotesheet = await notesheet.save();

    res.status(200).json({
      message: "Notesheet updated successfully.",
      data: updatedNotesheet,
    });
  } catch (error) {
    console.error("Error updating notesheet:", error);
    res.status(500).json({ message: "Failed to update notesheet.", error: error.message });
  }
});

module.exports = router