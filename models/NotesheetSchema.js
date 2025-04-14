const mongoose = require("mongoose");

// Sub-schema for comments inside roles
const commentSchema = new mongoose.Schema({
  user: { type: String },
  comment: { type: String },
  document: { type: String }, // Optional document related to the comment
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

// Sub-schema for workflow steps
const workflowSchema = new mongoose.Schema({
  role: { type: String, required: true }, // Role in the workflow (e.g., PA, Chairman, etc.)
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Completed', 'Received']
  },
  forwardedAt: { type: Date, default: Date.now },
}, { _id: false });

// Sub-schema for action history
const historySchema = new mongoose.Schema({
  role: { type: String },
  action: { type: String },
  timestamp: { type: Date, default: Date.now },
  comment: { type: String },
  timeliness: { type: String, default: "N/A" },
}, { _id: false });

// Sub-schema for role activity
const roleSchema = new mongoose.Schema({
  role: { type: String, required: true },
  comments: [commentSchema],
  forwardedAt: { type: Date },
  completedAt: { type: Date },
}, { _id: false });

// Main notesheet schema
const notesheetSchema = new mongoose.Schema({
  description: { type: String },
  subject: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  userEmail: { type: String, required: true },
  contact_number: { type: String, required: true },
  trackingId: { type: String, unique: true },
  image: { type: String }, // For storing image path if any
  currentHandler: { type: String, required: true },
  previousHandler: { type: String },

  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },

  workflow: [workflowSchema],
  history: [historySchema],
  roles: [roleSchema],

});
module.exports = mongoose.model("Notesheet", notesheetSchema); 