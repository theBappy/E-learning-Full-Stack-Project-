const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { uploadAvatar } = require('../controllers/avatarController');
const  { protect }  = require('../middleware/authMiddleware');
const uploadImage = require('../utils/profileImage');
 
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', protect, getProfile);

router.put('/upload-avatar', protect, uploadImage.single('avatar') , uploadAvatar);


module.exports = router;
