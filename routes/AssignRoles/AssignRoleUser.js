const Role = require('../../models/RoleSchema');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { role, selectedRole, email } = req.body;

    if (!role ) {
        return res.status(400).json({ message: "Role and email are required" });
    }

    try {
        const existingRole = await Role.findOne({ role });

        if (existingRole) {
            existingRole.selectedRole = selectedRole;
            existingRole.email = email; 

            await existingRole.save();
            return res.status(200).json({ message: 'Role updated successfully', data: existingRole });
        }

        // If the role doesn't exist, create a new role entry
        const newRole = new Role({
            role,
            selectedRole,
            email 
        });

        await newRole.save();
        res.status(201).json({ message: 'Data saved successfully', data: newRole });
    } catch (error) {
        console.error('Error saving role data:', error);
        res.status(500).json({ error: 'Failed to save role data' });
    }
});

module.exports = router;
