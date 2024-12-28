const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const  checkRole  = require('../middleware/role');
const User = require('../models/User');
const { deleteUser } = require('../controllers/deleteUser');
const { updateUserRole } = require('../controllers/updateUserRoleController');

const router = express.Router();

router.get('/users', protect, checkRole('admin'), async (req, res) => {
  try {
    const { search, role } = req.query;

    // A dynamic query object
    const query = {};

    // Search logic for name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive search for name
        { email: { $regex: search, $options: 'i' } }, // Case-insensitive search for email
      ];
    }


    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('-password');

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});


router.delete('/users/:userId', protect, checkRole('admin'), deleteUser);

router.patch('/users/:userId/role', protect, checkRole('admin'), updateUserRole);


module.exports = router;
