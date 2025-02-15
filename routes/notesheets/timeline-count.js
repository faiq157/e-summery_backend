const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");
const authMiddleware = require("../../middleware/authMiddleware");

// Route to get timeliness count of each role
router.get("/", async (req, res) => {
    try {
        const notesheets = await Notesheet.find();
    
        const roleTimeliness = {};
    
       
    notesheets.forEach((notesheet) => {
        notesheet.history.forEach((entry) => {
          const { role, timeliness, action } = entry;
          // Exclude "N/A" timeliness and "Created Notesheet" action
          if (timeliness !== "N/A" && action !== "Created Notesheet") {
            if (!roleTimeliness[role]) {
              roleTimeliness[role] = { timely: 0, delayed: 0 };
            }
            // Count Timely and Delayed
            if (timeliness === "Timely") {
              roleTimeliness[role].timely++;
            } else if (timeliness === "Delayed") {
              roleTimeliness[role].delayed++;
            }
          }
        });
      });
        res.status(200).json({
          message: "Timeliness count retrieved successfully.",
          data: roleTimeliness,
        });
      } catch (error) {
        console.error("Error retrieving timeliness count:", error);
        res.status(500).json({
          message: "Failed to retrieve timeliness count.",
          error: error.message,
        });
      }
    });

module.exports = router;
