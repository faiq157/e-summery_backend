const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");
const User = require("../../models/User");
const upload = require("../../config/multerConfig");
const authMiddleware = require("../../middleware/authMiddleware");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const s3 = require("../../config/cloudfareConfig");
const BUCKET_NAME = "notesheets";

 const R2_PUBLIC_URL = "https://pub-df4b0b355e6f47b294e478e797b911da.r2.dev";

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
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

module.exports = router;