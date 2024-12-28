const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const  checkRole  = require('../middleware/role');
const User = require('../models/User');

const router = express.Router();

router.get('/users', protect, checkRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
