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
const checkRole = require('../middleware/role');

const router = express.Router();

// Routes for managing a lesson
router.get('/:courseId', protect, getLessonsByCourse);
router.post('/create', checkRole(['admin', 'instructor']), createLesson);
router.put('/:id', checkRole(['admin', 'instructor']), updateLesson);
router.delete('/:id', checkRole(['admin']), deleteLesson);

// Lesson Details Routes
router.get('/enrolled/:id' , protect, getLessonDetails);

// New Routes for videos upload
router.post('/upload/:lessonId', checkRole(['admin', 'instructor']), upload.single('video'), uploadVideo)

module.exports = router;