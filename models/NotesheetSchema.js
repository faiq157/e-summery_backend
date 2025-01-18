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
  previousHandler: { type: String,}, // Previous handler
   status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed'], 
    default: 'Pending' 
  }, // Overall status
  flowStatus: { type: String, default: 'PA' }, // Tracks the current position in the hierarchy
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  history: [
    {
      role: { type: String }, // Role performing the action
      action: { type: String }, // Action performed (e.g., "Added Comment", "Sent Forward")
      timestamp: { type: Date, default: Date.now },
      comment: { type: String }, // Optional comment for this action
    },
  ],
  roles: [
    {
      role: { type: String, required: true }, // Role name (PA, Chairman, Registrar, etc.)
      status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
      comments: [
        {
          user: { type: String }, // User who added the comment
          comment: { type: String },
           document: String,
          timestamp: { type: Date, default: Date.now },
        },
      ],
      forwardedAt: { type: Date }, // When it was forwarded to this role
      completedAt: { type: Date }, // When this role completed their task
    },
  ],
});
module.exports = mongoose.model("Notesheet", notesheetSchema);
