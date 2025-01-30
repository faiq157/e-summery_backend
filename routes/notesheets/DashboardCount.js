const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");

// Route to get the total number of statuses based on role
router.get("/", async (req, res) => {
  try {
    const { role } = req.query; // Corrected: Use req.query instead of req.params

    if (!role) {
      return res.status(400).json({ error: "Role is required as a query parameter" });
    }

    console.log("Fetching status count for role:", role);

    // Fetch notesheets where the role exists in the workflow
    const notesheets = await Notesheet.find({ "workflow.role": role });

    console.log("Total notesheets fetched:", notesheets.length);

    // Initialize status counters
    const statusCount = {
      New: 0,
      "In Progress": 0,
      Completed: 0,
      Received: 0,
    };

    // Iterate through each notesheet and count statuses for the given role
    notesheets.forEach((notesheet) => {
      notesheet.workflow.forEach((entry) => {
        if (entry.role === role) {
          statusCount[entry.status] = (statusCount[entry.status] || 0) + 1;
        }
      });
    });

    console.log("Final status count:", statusCount);

    res.json({ role, statusCount });
  } catch (error) {
    console.error("Error fetching status count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
