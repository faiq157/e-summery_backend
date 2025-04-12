const ApprovalRole = require('../../models/ApprovalRoleSchema');
const Role = require('../../models/RoleSchema');
const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        // Fetch all approval roles
        const approvalRoles = await ApprovalRole.find();
        res.status(200).json({ data: approvalRoles });
    } catch (error) {
        console.error('Error fetching approval roles:', error);
        res.status(500).json({ error: 'Failed to fetch approval roles' });
    }
});

module.exports = router;