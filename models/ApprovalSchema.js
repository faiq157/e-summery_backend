const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ApprovalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    registrarOffice: {
      type: String,
      required: false,
    },
    phoneFax: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    refNo: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
    bodyText: {
      type: String,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
      ref: "User", // Reference to the User model
      required: true,
    },
    comments: [commentSchema],
    status: {
      type: String,
      enum: ["new", "received", "completed"],
      default: "new",
    },
    sentTo: {
      type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
      ref: "User", // Reference to the User model
      default: [], // Default is an empty array
    },
    selectedRole: {
      type: String,
      required: false,
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
    timestamps: true,
  }
);

module.exports = mongoose.model("Approval", ApprovalSchema);