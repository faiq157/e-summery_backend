const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { currentRole, toSendRole } = req.body;

  try {
    // Fetch the notesheet by ID
    const notesheet = await Notesheet.findById(id);
    if (!notesheet) {
      return res.status(404).json({ message: "Notesheet not found." });
    }

    // Ensure the roles and workflow arrays exist
    if (!notesheet.roles) notesheet.roles = [];
    if (!notesheet.workflow) notesheet.workflow = [];

    // Update the current role's status to "In Progress"
    const currentRoleIndex = notesheet.roles.findIndex((r) => r.role === currentRole);
    if (currentRoleIndex !== -1) {
      notesheet.roles[currentRoleIndex].status = "In Progress";
      notesheet.roles[currentRoleIndex].forwardedAt = new Date();
    } else {
      notesheet.roles.push({
        role: currentRole,
        status: "In Progress",
        forwardedAt: new Date(),
      });
    }

    // Update workflow: Remove duplicates of the current role and keep the latest data
    notesheet.workflow = notesheet.workflow.filter((entry) => entry.role !== currentRole);
    notesheet.workflow.push({
      role: currentRole,
      status: "In Progress",
      forwardedAt: new Date(),
    });

    // Update the next role's status to "Received"
    const toSendRoleIndex = notesheet.roles.findIndex((r) => r.role === toSendRole);
    if (toSendRoleIndex !== -1) {
      notesheet.roles[toSendRoleIndex].status = "Received";
    } else {
      notesheet.roles.push({
        role: toSendRole,
        status: "Received",
        forwardedAt: new Date(),
      });
    }

    // Update workflow: Remove duplicates of the toSend role and keep the latest data
    notesheet.workflow = notesheet.workflow.filter((entry) => entry.role !== toSendRole);
    notesheet.workflow.push({
      role: toSendRole,
      status: "Received",
      forwardedAt: new Date(),
    });

    // Update the overall handler
    notesheet.previousHandler = notesheet.currentHandler; // Track the previous handler
    notesheet.currentHandler = toSendRole;

    // Log the action in history with timeliness check
    if (!notesheet.history) notesheet.history = [];

    // Determine timeliness
    let timeliness = "N/A"; // Default value for the first entry
    if (notesheet.history.length > 0) {
      const lastHistory = notesheet.history[notesheet.history.length - 1];
      const currentTimestamp = new Date();
      const previousTimestamp = new Date(lastHistory.timestamp);

      const timeDifference = currentTimestamp - previousTimestamp;
      const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day

      // Check if it's timely or delayed
      timeliness = timeDifference <= oneDay ? "Timely" : "Delayed";
    }

    notesheet.history.push({
      role: currentRole,
      action: `Sent to ${toSendRole}`,
      timestamp: new Date(),
      timeliness, // Add timeliness status
    });

    // Save the updated notesheet
    const updatedNotesheet = await notesheet.save();

    res.status(200).json({
      message: `Notesheet sent to ${toSendRole} successfully.`,
      data: updatedNotesheet,
    });
  } catch (error) {
    console.error("Error sending notesheet:", error);
    res.status(500).json({ message: "Failed to send notesheet.", error: error.message });
  }
});

module.exports = router;
