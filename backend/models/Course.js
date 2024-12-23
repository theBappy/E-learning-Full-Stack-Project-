const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    media: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {timestamps: true});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;