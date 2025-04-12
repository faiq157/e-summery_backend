const express = require("express");
const router = express.Router();
const Approval = require("../../models/ApprovalSchema");
const { default: mongoose } = require("mongoose");

// Route for creating a new approval
router.post("/", async (req, res) => {
  const { title, registrarOffice, phoneFax, email, refNo, date, bodyText, userId } = req.body;

  try {
    if (!title || !registrarOffice || !phoneFax || !email || !refNo || !date || !bodyText || !userId) {
      return res.status(400).json({ message: "All fields, including userId, are required." });
    }

    // Validate userId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    // Save to MongoDB
    const NewApproval = new Approval({
      title,
      registrarOffice,
      phoneFax,
      email,
      refNo,
      date,
      bodyText,
      status: "new",
      sentTo: [new mongoose.Types.ObjectId(userId)], // Use 'new' keyword
      userId: new mongoose.Types.ObjectId(userId), // Save userId as ObjectId
    });

    const savedApproval = await NewApproval.save();

    // Respond with the saved entry
    res.status(201).json({
      message: "Approval Draft Created successfully.",
      data: savedApproval,
    });
  } catch (error) {
    console.error("Error creating approval:", error);
    res.status(500).json({ message: "Failed to create approval.", error: error.message });
  }
});

module.exports = router;