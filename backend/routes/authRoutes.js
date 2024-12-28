const express = require('express');
const { register, login } = require('../controllers/authController');
const { updateProfile } = require('../controllers/profileController');
const  { protect }  = require('../middleware/authMiddleware');
const uploadImage = require('../utils/profileImage');
 
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.put('/update-profile', protect, uploadImage.single('avatar') , updateProfile);


module.exports = router;
