const Message = require('../models/Message');
const User = require('../models/User');

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;

    const newMessage = new Message({
      sender: req.user._id,
      receiver,
      content,
    });

    await newMessage.save();

    // Notify the receiver in real-time
    req.io.to(`user_${receiver}`).emit('newMessage', {
      sender: req.user._id,
      content,
      timestamp: newMessage.timestamp,
    });

    res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
