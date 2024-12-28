const cloudinary = require('../utils/cloudinary');
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user._id; // Assuming `req.user` contains the authenticated user

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Handle optional avatar upload
    let avatarUrl = user.avatar;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars',
      });
      avatarUrl = result.secure_url;
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Make sure to hash the password
    user.avatar = avatarUrl;

    await user.save();

    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

