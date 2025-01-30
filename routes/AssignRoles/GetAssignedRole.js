const Role = require('../../models/RoleSchema');
const express = require('express');
const router = express.Router();
router.get('/:role', async (req, res) => {
    const { role } = req.params; // Get role from the route parameter

    try {
        // Find the role by role name
        const roleData = await Role.findOne({ role });

        if (!roleData) {
            return res.status(404).json({ error: 'Role not found' });
        }

        // Return the selected users for the role
        res.status(200).json(roleData.selectedRole);
    } catch (error) {
        console.error('Error fetching assigned users:', error);
        res.status(500).json({ error: 'Failed to fetch assigned users' });
    }
});
module.exports = router
