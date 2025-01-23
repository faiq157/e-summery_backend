const Role = require('../models/RoleSchema');
const express = require('express');
const router = express.Router();
router.post('/assign-role', async (req, res) => {
    const { role, selectedRole } = req.body;

    try {
        // Check if the role already exists in the database
        const existingRole = await Role.findOne({ role });

        if (existingRole) {
            // If the role already exists, update the selectedRole array
            existingRole.selectedRole = selectedRole;

            await existingRole.save();
            return res.status(200).json({ message: 'Role updated successfully', data: existingRole });
        }

        // If the role doesn't exist, create a new role entry
        const newRole = new Role({
            role,
            selectedRole
        });

        await newRole.save();
        res.status(201).json({ message: 'Data saved successfully', data: newRole });
    } catch (error) {
        console.error('Error saving role data:', error);
        res.status(500).json({ error: 'Failed to save role data' });
    }
});

router.get('/get-role', async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json({ data: roles });
    } catch (error) {
        console.error('Error fetching role data:', error);
        res.status(500).json({ error: 'Failed to fetch role data' });
    }
});
module.exports = router;

