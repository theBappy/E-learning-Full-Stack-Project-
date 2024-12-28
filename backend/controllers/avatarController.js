const User = require('../models/User');

exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id; 
    const avatarUrl = req.file.path; 

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

