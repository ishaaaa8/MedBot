// In your backend routes (e.g., `adminRoutes.js`)

const express = require('express');
const Admin = require('../models/Admin');
const User = require('../models/User');
const router = express.Router();

// Route to get all distress users for admin dashboard
router.get('/distress-users', async (req, res) => {
    try {
        const admin = await Admin.findOne({email : "admin@gmail.com"}).populate('distressUsers');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Return the distressed users (including their details)
        const distressUsers = admin.distressUsers;
        return res.status(200).json(distressUsers);
    } catch (error) {
        console.error('Failed to fetch distress users:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
