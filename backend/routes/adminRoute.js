const { protect, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const express = require('express');
const router = express.Router();


router.patch('/update-role', protect, isAdmin, async (req, res) => {
    const { email, role } = req.body;
  
    // Validate role
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
  
    try {
      const user = await User.findOneAndUpdate({ email }, { role }, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'Role updated successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});
  

router.post('/request-role-upgrade', protect, async (req, res) => {
    const { role } = req.body;
  
    // Validate role
    if (role !== 'instructor') {
      return res.status(400).json({ error: 'Invalid role request' });
    }
  
    try {
      const user = await User.findByIdAndUpdate(req.user._id, { requestedRole: role });
      res.json({ message: 'Role upgrade request submitted' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});
  

module.exports = router;
  
