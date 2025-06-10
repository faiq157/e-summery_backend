const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");

const moment = require("moment"); // Include moment.js for date manipulation
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { role } = req.query;
    const { filter } = req.query; // Filter query parameter to specify weekly, 15 days, monthly, or all

    if (!role) {
      return res.status(400).json({ error: "Role is required as a query parameter" });
    }

    // Define date ranges based on the filter
    let dateFilter = {};
    const currentDate = moment();

    if (filter && filter !== "all") {
      let startDate;
      switch (filter) {
        case "weekly":
          startDate = currentDate.subtract(1, "weeks").startOf("week");
          break;
        case "15days":
          startDate = currentDate.subtract(15, "days");
          break;
        case "monthly":
          startDate = currentDate.subtract(1, "months").startOf("month");
          break;
        default:
          return res.status(400).json({ error: "Invalid filter. Use 'weekly', '15days', 'monthly', or 'all'" });
      }
      dateFilter = { "timestamps.createdAt": { $gte: startDate.toDate() } };
    }
    // If filter is "all" or not provided, do not filter by date

    // Fetch notesheets where the role exists in the workflow and filter by date range if applicable
    const notesheets = await Notesheet.find({
      "workflow.role": role,
      ...dateFilter,
    });

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

    res.json({ role, filter: filter || "all", statusCount });
  } catch (error) {
    console.error("Error fetching status count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;