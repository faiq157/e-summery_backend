
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Notesheet = require("../models/NotesheetSchema");
const router = express.Router();
router.get("/track/:trackingId", async (req, res) => {
  const { trackingId } = req.params;

  try {
    const notesheet = await Notesheet.findOne({ trackingId });

    if (!notesheet) {
      return res.status(404).json({ message: "Notesheet not found." });
    }

    res.status(200).json({
      message: "Notesheet tracking data retrieved successfully.",
      data: {
        trackingId: notesheet.trackingId,
        currentHandler: notesheet.currentHandler,
        workflow: notesheet.workflow,
        status: notesheet.status,
        history: notesheet.history,
      },
    });
  } catch (error) {
    console.error("Error tracking notesheet:", error);
    res.status(500).json({ message: "Failed to track notesheet.", error: error.message });
  }
});
module.exports = router