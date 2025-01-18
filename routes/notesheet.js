const express = require("express");
const router = express.Router();
const Notesheet = require("../models/NotesheetSchema");
const User = require("../models/User");
const upload = require("./../config/multerConfig");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * Create Notesheet Endpoint
 */
router.post("/create",authMiddleware, upload.single("image"), async (req, res) => {
  const { description, subject, userName, email, contact_number,userEmail } = req.body;

  try {
    // Validate required fields
    if (!description || !subject || !userName || !email || !contact_number) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    let role = user.role;

    // Create notesheet
    const newNoteSheet = new Notesheet({
      description,
      subject,
      userName,
      email,
      contact_number,
      userEmail,
      image: req.file ? req.file.path : null,
      currentHandler: role,
       workflow: [
    {
      role: role,
      status: "In Progress",
      forwardedAt: Date.now(),
    },
  ],
  history: [
    {
      handler: role,
      action: "Created Notesheet",
      timestamp: new Date(),
    },
  ],
  comments: [],
  roles: [
    {
      role: role,
      status: "In Progress",
      timestamp: new Date(),
    },
  ],
    });

    const savedNoteSheet = await newNoteSheet.save();

    res.status(201).json({
      message: "Notesheet created successfully.",
      data: savedNoteSheet,
    });
  } catch (error) {
    console.error("Error creating notesheet:", error);
    res.status(500).json({ message: "Failed to create notesheet.", error: error.message });
  }
});

/**
 * Send Notesheet to Next Role Endpoint
 */
router.post("/send/:id",authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { currentRole, toSendRole } = req.body;

  try {
    // Fetch the notesheet
    const notesheet = await Notesheet.findById(id);
    if (!notesheet) {
      return res.status(404).json({ message: "Notesheet not found." });
    }

    // Ensure `toSendRole` exists in the workflow or add it dynamically
    if (!notesheet.roles) notesheet.roles = [];
    if (!notesheet.roles.some(r => r.role === toSendRole)) {
      notesheet.roles.push({
        role: toSendRole,
        status: "Pending",
        comments: [],
      });
    }

    // Log the action in history
    notesheet.history.push({
      handler: currentRole,
      action: `Sent to ${toSendRole}`,
      timestamp: new Date(),
    });

    // Update the current handler to the new role
    notesheet.currentHandler = toSendRole;

    // Save the notesheet
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





/**
 * Add Comments to Notesheet Endpoint
 */
router.post("/add-comment/:id",authMiddleware, upload.single('document'), async (req, res) => {
  const { id } = req.params;
  const { role, comment } = req.body;

  try {
    const notesheet = await Notesheet.findById(id);
    if (!notesheet) {
      return res.status(404).json({ message: "Notesheet not found." });
    }
    if (notesheet.currentHandler !== role) {
      return res.status(403).json({ message: "You are not authorized to comment on this notesheet." });
    }

    if (!notesheet.roles || notesheet.roles.length === 0) {
      return res.status(404).json({ message: "No roles assigned in notesheet." });
    }

    const roleIndex = notesheet.roles.findIndex(r => r.role === role);

    // Check for file upload for 'Establishment' role
    const filePath = req.file ? req.file.path : null;  // Get the file path if uploaded

    if (role === 'Establishment' && req.file) {
      if (!filePath) {
        return res.status(400).json({ message: "File is required for the Establishment role." });
      }
      // Add comment with file path for 'Establishment'
      if (roleIndex !== -1) {
        notesheet.roles[roleIndex].comments.push({
          user: role,
          comment,
          document: filePath,  // Add the file path to the comment
          timestamp: new Date(),
        });
      } else {
        notesheet.roles.push({
          role: role,
          status: "Pending", // Or any default status
          comments: [{
            user: role,
            comment,
            document: filePath,  // Add the file path to the comment
            timestamp: new Date(),
          }],
        });
      }
    } else {
      // If the role is not 'Establishment', just add the comment without the file path
      if (roleIndex !== -1) {
        notesheet.roles[roleIndex].comments.push({
          user: role,
          comment,
          timestamp: new Date(),
        });
      } else {
        notesheet.roles.push({
          role: role,
          status: "Pending", // Or any default status
          comments: [{
            user: role,
            comment,
            timestamp: new Date(),
          }],
        });
      }
    }

    const updatedNoteSheet = await notesheet.save();

    res.status(200).json({
      message: "Comment added successfully.",
      data: updatedNoteSheet,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment.", error: error.message });
  }
});


/**
 * Get All Notesheets
 */
router.get("/notesheets",authMiddleware, async (req, res) => {
  try {
    const notesheets = await Notesheet.find();
    res.status(200).json(notesheets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notesheets.", error: error.message });
  }
});

/**
 * Get Comments for a Notesheet Endpoint
 */
router.get("/comments/:id", authMiddleware, async (req, res) => {
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
