const ApprovalRole = require('../../models/ApprovalRoleSchema');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { approvalAccess } = req.body;

    if (!approvalAccess || !Array.isArray(approvalAccess)) {
        return res.status(400).json({ message: "Approval access must be an array of roles." });
    }

    try {
        // Check if the approval roles document already exists
        let approvalRoleDoc = await ApprovalRole.findOne();

        if (approvalRoleDoc) {
            // Merge new roles with existing roles, avoiding duplicates
            const updatedApprovalAccess = [
                ...new Set([...approvalRoleDoc.approvalAccess, ...approvalAccess]),
            ];

            approvalRoleDoc.approvalAccess = updatedApprovalAccess;
            await approvalRoleDoc.save();

            return res.status(200).json({ message: 'Approval roles updated successfully', data: approvalRoleDoc });
        }

        // If no document exists, create a new one
        const newApprovalRole = new ApprovalRole({
            approvalAccess,
        });

        await newApprovalRole.save();
        res.status(201).json({ message: 'Approval roles saved successfully', data: newApprovalRole });
    } catch (error) {
        console.error('Error saving approval roles:', error);
        res.status(500).json({ error: 'Failed to save approval roles' });
    }
});

module.exports = router;