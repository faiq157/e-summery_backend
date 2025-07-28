// models/Role.js
const e = require('express');
const mongoose = require('mongoose');

// Schema for selectedRole
const selectedRoleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

// Schema for the main role
const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    selectedRole: [selectedRoleSchema], 
});

// Add indexes for common query patterns
roleSchema.index({ role: 1 }); // Query by role name
roleSchema.index({ "selectedRole.email": 1 }); // Query by email within selectedRole
roleSchema.index({ "selectedRole.id": 1 }); // Query by id within selectedRole

// Create the model from the schema
const Role = mongoose.model('Role', roleSchema);

// Export the model
module.exports = Role;
