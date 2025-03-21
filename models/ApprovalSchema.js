const mongoose = require("mongoose");

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
