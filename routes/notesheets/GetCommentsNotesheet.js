const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");

const authMiddleware = require("../../middleware/authMiddleware");
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the notesheet by ID
    const notesheet = await Notesheet.findById(id);

    if (!notesheet) {
      return res.status(404).json({ message: "Notesheet not found." });
    }

    // Extract all comments from the 'roles' array
    const allComments = notesheet.roles.reduce((comments, role) => {
      if (role.comments && Array.isArray(role.comments)) {
        comments.push(...role.comments);
      }
      return comments;
    }, []);


    // Return the comments
    res.status(200).json({
      message: "Comments fetched successfully.",
      comments: allComments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments.", error: error.message });
  }
});

module.exports = router;