const mongoose = require('mongoose');

const LessonSchema = new mongoose({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
module.exports = mongoose.model('Lesson', LessonSchema);