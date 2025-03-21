const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find approvals where the sentTo array includes the specified ID
    const approvals = await approvalSchema.find({ sentTo: id });
    // console.log("approvals", approvals);

    // Respond with the matched approvals or an empty array if none found
    res.status(200).json({
      message: "Approvals retrieved successfully for the specified ID.",
      data: approvals.map(approval => ({
        title: approval.title,
        registrarOffice: approval.registrarOffice,
        phoneFax: approval.phoneFax,
        email: approval.email,
        refNo: approval.refNo,
        date: approval.date,
        bodyText: approval.bodyText,
        sentTo: approval.sentTo,
        sended: approval.sended,
        _id: approval._id,
        createdAt: approval.createdAt,
        updatedAt: approval.updatedAt,
        __v: approval.__v
      })),
    });
  } catch (error) {
    console.error("Error retrieving approvals by sentTo ID:", error);
    res.status(500).json({ message: "Failed to retrieve approvals by sentTo ID.", error: error.message });
  }
});

module.exports = router;