const ApprovalRole = require('../../models/ApprovalRoleSchema');
const Role = require('../../models/RoleSchema');
const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const approvalRoleDoc = await ApprovalRole.findOne();

        if (!approvalRoleDoc) {
            return res.status(404).json({ message: 'No approval roles found.' });
        }

        res.status(200).json({ message: 'Approval roles retrieved successfully', data: approvalRoleDoc });
    } catch (error) {
        console.error('Error retrieving approval roles:', error);
        res.status(500).json({ error: 'Failed to retrieve approval roles' });
    }
});


module.exports = router;