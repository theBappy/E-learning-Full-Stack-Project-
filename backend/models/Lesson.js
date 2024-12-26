const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    instructor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    videoUrl: {
        type: String,
        default: null,
    },
    comments: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          comment: { type: String, required: true },
          timestamp: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
module.exports = mongoose.model('Lesson', LessonSchema);