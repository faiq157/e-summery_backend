const express = require("express");
const router = express.Router();
const Notesheet = require("../models/NotesheetSchema");
const User = require("../models/User");
const upload = require("./../config/multerConfig");
const authMiddleware = require("../middleware/authMiddleware");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const s3 = require("../config/cloudfareConfig");
const BUCKET_NAME = "notesheets";

 const R2_PUBLIC_URL = "https://pub-df4b0b355e6f47b294e478e797b911da.r2.dev";

router.post("/create", authMiddleware, upload.single("image"), async (req, res) => {
  const { description, subject, userName, email, contact_number, userEmail } = req.body;
 
  try {
    if (!description || !subject || !userName || !email || !contact_number) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    let role = user.role;
    let imageUrl = null;

    if (req.file) {
      try {
        const fileContent = fs.readFileSync(req.file.path);
        const fileName = `notesheets/${Date.now()}_${req.file.originalname}`;

        const params = {
          Bucket: BUCKET_NAME,
          Key: fileName,
          Body: fileContent,
          ContentType: req.file.mimetype,
        };

        await s3.upload(params).promise();
        imageUrl = `${R2_PUBLIC_URL}/${fileName}`;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload image.", error: uploadError.message });
      }
    }

  const trackingId = uuidv4().substring(0, 15);
    const newNoteSheet = new Notesheet({
      description,
      subject,
      userName,
      email,
      contact_number,
      userEmail,
      image: imageUrl,
      currentHandler: role,
      trackingId,
      status: "New",
      workflow: [{
        role: role,
        status: "New",
        forwardedAt: Date.now(),
      }],
      history: [{
        role: role,
        action: "Created Notesheet",
        timestamp: new Date(),
      }],
    });

    const savedNoteSheet = await newNoteSheet.save();
    res.status(201).json({
      message: "Notesheet created successfully.",
      data: savedNoteSheet,
    });

  } catch (error) {
    console.error("Error creating notesheet:", error);
    res.status(500).json({ 
      message: "Failed to create notesheet.", 
      error: error.message 
    });
  }
});

router.put("/complete/:id", authMiddleware, async (req, res) => {
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
      role: "Establishment", // Replace with the actual role
      action: "Updated all workflow statuses and Notesheet status to Completed",
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


/**
 * Send Notesheet to Next Role Endpoint
 */
router.post("/send/:id", authMiddleware, async (req, res) => {
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

    // Log the action in history
    if (!notesheet.history) notesheet.history = [];
    notesheet.history.push({
      role: currentRole,
      action: `Sent to ${toSendRole}`,
      timestamp: new Date(),
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






/**
 * Add Comments to Notesheet Endpoint
 */

router.post("/add-comment/:id", authMiddleware, upload.single("document"), async (req, res) => {
  const { id } = req.params;
  const { role, comment } = req.body;

  try {
    if (!comment || !role) {
      return res.status(400).json({ message: "Role and comment are required." });
    }

    const notesheet = await Notesheet.findById(id);
    if (!notesheet) {
      return res.status(404).json({ message: "Notesheet not found." });
    }

    if (notesheet.currentHandler !== role) {
      return res.status(403).json({ message: "You are not authorized to comment on this notesheet." });
    }

    let documentUrl = null;

    if (req.file) {
      try {
        const fileContent = fs.readFileSync(req.file.path);
        const fileName = `notesheets/${Date.now()}_${req.file.originalname}`;

        const params = {
          Bucket: BUCKET_NAME, // Replace with your R2 bucket name
          Key: fileName,
          Body: fileContent,
          ContentType: req.file.mimetype,
        };

        await s3.upload(params).promise();
        documentUrl = `${R2_PUBLIC_URL}/${fileName}`;
      } catch (uploadError) {
        console.error("Document upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload document.", error: uploadError.message });
      }
    }


    const roleIndex = notesheet.roles.findIndex((r) => r.role === role);

    const commentObject = {
      user: role,
      comment,
      document: documentUrl || null, // Include document URL if available
      timestamp: new Date(),
    };

    if (roleIndex !== -1) {
      notesheet.roles[roleIndex].comments.push(commentObject);
    } else {
      notesheet.roles.push({
        role: role,
        status: "New", // Or any default status
        comments: [commentObject],
      });
    }

    const updatedNoteSheet = await notesheet.save();

    res.status(200).json({
      message: "Comment added successfully.",
      data: updatedNoteSheet,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      message: "Failed to add comment.",
      error: error.message,
    });
  }
});



/**
 * Get All Notesheets
 */
router.get("/notesheets", authMiddleware, async (req, res) => {
  const { role, status } = req.query; // Retrieve role and status from query parameters

  try {
    // Validate role and status parameters
    if (!role || !status) {
      return res.status(400).json({ message: "Both role and status are required." });
    }

    // Filter notesheets based on role and status in the workflow
    const notesheets = await Notesheet.find({
      workflow: {
        $elemMatch: {
          role: role,       // Match the role in the workflow
          status: status,   // Match the status in the workflow
        },
      },
    });

    // Return the filtered notesheets
    res.status(200).json(notesheets);
  } catch (error) {
    console.error("Error fetching notesheets:", error);
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

/**
 * Edit Notesheet Endpoint
 */
router.put("/edit/:id", authMiddleware, upload.single("image"), async (req, res) => {
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

/**
 * Delete Notesheet Endpoint
 */
router.delete('/delete/:id', async (req, res) => {
    const notesheetId = req.params.id;

    try {
        // Find and delete the notesheet by ID
        const result = await Notesheet.findByIdAndDelete(notesheetId);

        if (!result) {
            return res.status(404).json({ message: "Notesheet not found" });
        }

        return res.status(200).json({ message: "Notesheet deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});







module.exports = router;
