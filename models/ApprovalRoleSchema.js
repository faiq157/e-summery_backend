const mongoose = require('mongoose');

// Schema for approval roles access
const approvalRoleSchema = new mongoose.Schema({
    approvalAccess: {
        type: [String], // Array of strings to store roles with approval access
        required: true,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically store the creation date
    },
});

// Add indexes for common query patterns
approvalRoleSchema.index({ approvalAccess: 1 }); // Query by approval access roles
approvalRoleSchema.index({ createdAt: -1 }); // Sort by creation date (descending)

// Create the model from the schema
const ApprovalRole = mongoose.model('ApprovalRole', approvalRoleSchema);

// Export the model
module.exports = ApprovalRole;