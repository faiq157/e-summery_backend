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

// Create the model from the schema
const Role = mongoose.model('Role', roleSchema);

// Export the model
module.exports = Role;
