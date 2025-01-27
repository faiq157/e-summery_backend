const mongoose = require("mongoose");

const ApprovalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
      sentTo: {
      type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
      ref: "User", // Reference to the User model
      default: [], // Default is an empty array
    },
    sended:{
      type:Boolean,
      default:false,
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

module.exports = mongoose.model("approvalSchema", ApprovalSchema);
