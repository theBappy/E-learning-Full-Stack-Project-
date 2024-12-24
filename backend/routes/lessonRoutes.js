const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const {
    createLesson,
    getLessonsByCourse,
    updateLesson,
    deleteLesson, 
} = require('../controllers/lessonController');

const router = express.Router();

// Routes for managing a lesson
router.post('/create', protect, createLesson);
router.get('/:courseId', protect, getLessonsByCourse);
router.put('/:id', protect, updateLesson);
router.delete('/:id', protect, deleteLesson);

module.exports = router;