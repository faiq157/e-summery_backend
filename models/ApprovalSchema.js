const mongoose = require("mongoose");

// Comment sub-schema
const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false } // Avoids unnecessary _id field for each comment
);

const ApprovalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    registrarOffice: {
      type: String,
    },
    phoneFax: {
      type: String,
    },
    email: {
      type: String,
    },
    refNo: {
      type: String,
    },
    date: {
      type: String, // Keep this as String if it's not an actual Date
    },
    bodyText: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["new", "received", "completed"],
      default: "new",
    },
    sentTo: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    selectedRole: {
      type: String,
    },
    sended: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds updatedAt in addition to createdAt
  }
);

// Add indexes for common query patterns
ApprovalSchema.index({ userId: 1 }); // Query by user who created the approval
ApprovalSchema.index({ sentTo: 1 }); // Query by users the approval was sent to
ApprovalSchema.index({ status: 1 }); // Query by approval status
ApprovalSchema.index({ createdAt: -1 }); // Sort by creation date (descending)
ApprovalSchema.index({ userId: 1, status: 1 }); // Compound index for user + status
ApprovalSchema.index({ sentTo: 1, status: 1 }); // Compound index for sentTo + status
ApprovalSchema.index({ selectedRole: 1 }); // Query by selected role
ApprovalSchema.index({ sended: 1 }); // Query by sent status

module.exports = mongoose.model("Approval", ApprovalSchema);
