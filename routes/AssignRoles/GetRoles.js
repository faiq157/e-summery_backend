const Role = require('../../models/RoleSchema');
const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json({ data: roles });
    } catch (error) {
        console.error('Error fetching role data:', error);
        res.status(500).json({ error: 'Failed to fetch role data' });
    }
});

module.exports = router