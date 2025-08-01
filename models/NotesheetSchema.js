const mongoose = require("mongoose");


const notesheetSchema = new mongoose.Schema({
  description: { type: String, },
  subject: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  userEmail: { type: String, required: true },
  contact_number: { type: String, required: true },
  trackingId: { type: String, unique: true },
  image: { type: String }, // For storing image path if any
  currentHandler: { type: String, required: true }, // Current handler
  previousHandler: { type: String }, // Previous handler

  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  workflow: [
    {
      role: { type: String, required: true }, // Role in the workflow (e.g., PA, Chairman, etc.)
      status: { type: String, enum: ['New', 'In Progress', 'Completed', 'Received'] }, // Current status of the task for the role
      forwardedAt: { type: Date, default: Date.now }, // Date when the task was forwarded to this role
    },
  ],
  history: [
    {
      role: { type: String }, // Role performing the action
      action: { type: String }, // Action performed (e.g., "Created Notesheet")
      timestamp: { type: Date, default: Date.now },
      comment: { type: String }, // Optional comment for this action
      timeliness: { type: String, default: "N/A" }, 
    },
  ],
  roles: [
    {
      role: { type: String, required: true }, // Role name (PA, Chairman, Registrar, etc.)
      comments: [
        {
          user: { type: String }, // User who added the comment
          comment: { type: String },
          document: { type: String }, // Optional document related to the comment
          timestamp: { type: Date, default: Date.now },
        },
      ],
      forwardedAt: { type: Date }, // When it was forwarded to this role
      completedAt: { type: Date }, // When this role completed their task
    },
  ],
});

// Add indexes for common query patterns
notesheetSchema.index({ trackingId: 1 }, { unique: true }); // Unique tracking ID
notesheetSchema.index({ "workflow.role": 1, "workflow.status": 1 }); // Compound index for workflow queries
notesheetSchema.index({ "timestamps.createdAt": -1 }); // Sort by creation date (descending)
notesheetSchema.index({ currentHandler: 1 }); // Query by current handler
notesheetSchema.index({ email: 1 }); // Query by user email
notesheetSchema.index({ subject: "text", userName: "text" }); // Text search on subject and userName
notesheetSchema.index({ "workflow.role": 1, "timestamps.createdAt": -1 }); // Role + date compound index
notesheetSchema.index({ "history.role": 1, "history.timeliness": 1 }); // For timeliness queries

module.exports = mongoose.model("Notesheet", notesheetSchema);