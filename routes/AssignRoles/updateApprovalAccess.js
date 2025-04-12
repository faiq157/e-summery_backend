const ApprovalRole = require('../../models/ApprovalRoleSchema');
const express = require('express');
const router = express.Router();
// PUT - Replace the approvalAccess array
router.put('/', async (req, res) => {
    const { approvalAccess } = req.body;

    if (!approvalAccess || !Array.isArray(approvalAccess)) {
        return res.status(400).json({ message: "Approval access must be an array of roles." });
    }

    try {
        let approvalRoleDoc = await ApprovalRole.findOne();

        if (!approvalRoleDoc) {
            return res.status(404).json({ message: "Approval roles document not found." });
        }

        // Replace the array completely
        approvalRoleDoc.approvalAccess = approvalAccess;
        await approvalRoleDoc.save();

        res.status(200).json({ message: 'Approval roles replaced successfully', data: approvalRoleDoc });
    } catch (error) {
        console.error('Error updating approval roles:', error);
        res.status(500).json({ error: 'Failed to update approval roles' });
    }
});
module.exports = router;
