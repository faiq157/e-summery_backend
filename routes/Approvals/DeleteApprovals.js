// Route to delete an approval by ID
const express = require("express");
const router = express.Router();
const approvalSchema = require("../../models/ApprovalSchema");

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const approval = await approvalSchema.findById(id);

    if (!approval) {
      return res.status(404).json({ message: "Approval not found." });
    }

    // Delete from MongoDB
    await approvalSchema.findByIdAndDelete(id);

    res.status(200).json({
      message: "Approval deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting approval:", error);
    res.status(500).json({ message: "Failed to delete approval.", error: error.message });
  }
});

module.exports = router