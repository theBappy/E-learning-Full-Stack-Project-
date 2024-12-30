const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    lessons: [
        {
            title: {
                type: String,
                required: true,
            },
            contentType: {
                type: String,
                enum: ['video', 'text', 'quiz', 'pdf'],
                required: true,
            },
            content: {
                type: String,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
module.exports = mongoose.model('Module', moduleSchema);