
const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");
const authMiddleware = require("../../middleware/authMiddleware");

router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the Notesheet by ID
    const notesheet = await Notesheet.findById(id);
    if (!notesheet) {
      return res.status(404).json({ message: "Notesheet not found." });
    }

    // Update all entries in the workflow to "Completed"
    notesheet.workflow = notesheet.workflow.map((entry) => ({
      ...entry,
      status: "Completed",
    }));

    // Update the Notesheet's status to "Completed"
    notesheet.status = "Completed";

    // Add an entry in the history
    notesheet.history.push({
      role: req.user.role, // Replace with the actual role
      action: "Notesheet Completed",
      timestamp: new Date(),
    });

    // Save the updated Notesheet
    const updatedNotesheet = await notesheet.save();

    res.status(200).json({
      message: "Notesheet and workflow statuses updated to 'Completed'.",
      data: updatedNotesheet,
    });
  } catch (error) {
    console.error("Error updating Notesheet status and workflow:", error);
    res.status(500).json({
      message: "Failed to update Notesheet and workflow statuses.",
      error: error.message,
    });
  }
});

module.exports = router;