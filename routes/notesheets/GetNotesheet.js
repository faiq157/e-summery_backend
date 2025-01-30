const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");

const authMiddleware = require("../../middleware/authMiddleware");
router.get("/", authMiddleware, async (req, res) => {
  const { role, status, page, limit, dateRange, search } = req.query; 

  try {
    // Validate required parameters
    if (!role || !status || !page || !limit) {
      return res.status(400).json({ message: "Role, status, page, and limit are required." });
    }

    // Convert page and limit to integers
    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);

    // Initialize the date filter
    let dateFilter = {};

    if (dateRange) {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case "all":
          startDate = new Date(0); 
    break;
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "last_week":
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "last_15_days":
          startDate.setDate(now.getDate() - 15);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "last_month":
          startDate.setMonth(now.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        default:
          return res.status(400).json({ message: "Invalid date range" });
      }

      dateFilter = { "timestamps.createdAt": { $gte: startDate } };
    }

    // Initialize the search filter for subject and userName
    let searchFilter = {};
    if (search) {
      const searchQuery = new RegExp(search, 'i'); // 'i' makes it case-insensitive

      searchFilter = {
        $or: [
          { subject: { $regex: searchQuery } }, // Match subject field
          { userName: { $regex: searchQuery } } // Match userName field
        ]
      };
    }

    // Filter notesheets based on role, status in the workflow, date range, and search
    const notesheets = await Notesheet.find({
      workflow: {
        $elemMatch: {
          role: role,
          status: status,
        },
      },
      ...dateFilter, // Include the date filter in the query
      ...searchFilter, // Include the search filter in the query
    })
      .skip((pageNumber - 1) * pageLimit)  // Skip items based on current page
      .limit(pageLimit);                    // Limit the number of results per page

    // Get the total number of notesheets for pagination metadata
    const totalNotesheets = await Notesheet.countDocuments({
      workflow: {
        $elemMatch: {
          role: role,
          status: status,
        },
      },
      ...dateFilter, // Include the date filter for the count
      ...searchFilter, // Include the search filter for the count
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalNotesheets / pageLimit);

    // Return the paginated notesheets and pagination metadata
    res.status(200).json({
      notesheets,
      pagination: {
        totalNotesheets,
        totalPages,
        currentPage: pageNumber,
        pageLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching notesheets:", error);
    res.status(500).json({ message: "Failed to fetch notesheets.", error: error.message });
  }
});

module.exports=router;