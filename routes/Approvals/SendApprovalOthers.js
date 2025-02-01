const express = require("express");
const { sendEmail } = require("../../utils/email"); 

const router = express.Router();

/**
 * @route POST /sendApprovalOther
 * @desc Send an approval email with the provided tracking ID
 */
router.post("/", async (req, res) => {
  const { email, Url } = req.body;
  if (!email || !Url ) {
    return res
      .status(400)
      .json({ message: "Email and Tracking ID are required" });
  }

  try {
    const mailOptions = {
      to: email,
      from: process.env.EMAIL,
      subject: "Notification From UET Mardan",
      text: `The Final Approval from UET Mardan.Please click on link below ${Url} `,
    };
    await sendEmail(mailOptions);

    res.status(200).json({ message: "Approval email sent successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
