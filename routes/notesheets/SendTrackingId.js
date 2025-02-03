const express = require("express");
const { sendEmail } = require("../../utils/email"); 

const router = express.Router();

/**
 * @route POST /sendApprovalOther
 * @desc Send an approval email with the provided tracking ID
 */
router.post("/", async (req, res) => {
  const { email, trackingId,subject,text } = req.body;

  // Validate required fields
  if (!email ) {
    return res
      .status(400)
      .json({ message: "Email and Tracking ID are required" });
  }

  try {
    // Prepare the email content
    const mailOptions = {
      to: email,
      from: process.env.EMAIL,
      subject: subject,
      text: text,
    };

    // Send the email using the utility function
    await sendEmail(mailOptions);

    res.status(200).json({ message: "Tracking Id email sent successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
