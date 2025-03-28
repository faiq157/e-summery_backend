const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");
const User = require("../../models/User");
const upload = require("../../config/multerConfig");
const authMiddleware = require("../../middleware/authMiddleware");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  const { description, subject, userName, email, contact_number, userEmail } = req.body;

  try {
    if (!subject || !userName || !email || !contact_number) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let role = user.role;
    let base64Image = null;

    if (req.file) {
      try {
        // Read the file and convert it to Base64
        const fileContent = fs.readFileSync(req.file.path);
        base64Image = `data:${req.file.mimetype};base64,${fileContent.toString("base64")}`;

        // Optionally, delete the file after converting to Base64
        fs.unlinkSync(req.file.path);
      } catch (conversionError) {
        console.error("Image conversion error:", conversionError);
        return res.status(500).json({ message: "Failed to process image.", error: conversionError.message });
      }
    }

    const trackingId = uuidv4().replace(/-/g, "").substring(0, 8);
    const newNoteSheet = new Notesheet({
      description,
      subject,
      userName,
      email,
      contact_number,
      userEmail,
      image: base64Image, // Store the Base64 image in the database
      currentHandler: role,
      trackingId,
      status: "New",
      workflow: [
        {
          role: role,
          status: "New",
          forwardedAt: Date.now(),
        },
      ],
      history: [
        {
          role: role,
          action: "Created Notesheet",
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
    res.status(500).json({
      message: "Failed to create notesheet.",
      error: error.message,
    });
  }
});

module.exports = router;