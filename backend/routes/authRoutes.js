const express = require('express');
const { register, login } = require('../controllers/authController');
const { uploadAvatar } = require('../controllers/avatarController');
const  { protect }  = require('../middleware/authMiddleware');
const uploadImage = require('../utils/profileImage');
 
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.put('/upload-avatar', protect, uploadImage.single('avatar') , uploadAvatar);


module.exports = router;
