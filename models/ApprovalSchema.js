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
      type: String, // Keep this as String if it’s not an actual Date
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

module.exports = mongoose.model("Approval", ApprovalSchema);
