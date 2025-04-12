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

// Create the model from the schema
const ApprovalRole = mongoose.model('ApprovalRole', approvalRoleSchema);

// Export the model
module.exports = ApprovalRole;