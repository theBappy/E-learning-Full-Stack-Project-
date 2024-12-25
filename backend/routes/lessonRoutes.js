const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    createLesson,
    getLessonsByCourse,
    updateLesson,
    deleteLesson,
    uploadVideo,
    getLessonDetails,
} = require('../controllers/lessonController');
const upload = require('../utils/multer');

const router = express.Router();

// Routes for managing a lesson
router.post('/create', protect, createLesson);
router.get('/:courseId', protect, getLessonsByCourse);
router.put('/:id', protect, updateLesson);
router.delete('/:id', protect, deleteLesson);

// Lesson Details Routes
router.get('/enrolled/:id' , protect, getLessonDetails);

// New Routes for videos upload
router.post('/upload/:lessonId', protect, upload.single('video'), uploadVideo)

module.exports = router;