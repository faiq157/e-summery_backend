const mongoose = require("mongoose");

const notesheetSchema = new mongoose.Schema({
  description: { type: String, required: true },
  subject: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  userEmail: { type: String, required: true },
  contact_number: { type: String, required: true },
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

module.exports = mongoose.model("Notesheet", notesheetSchema);
