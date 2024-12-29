const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { enrollInACourse, getAllEnrolledCourse } = require('../controllers/enrollmentController');
const { viewEnrollment }  = require('../controllers/viewEnrollmentController');
const checkRole = require('../middleware/role');

const router = express.Router();

router.post('/course-enroll', protect, enrollInACourse);
router.get('/enrolled-courses', protect, getAllEnrolledCourse);
router.get('/students/:id', checkRole(['admin', 'instructor']), viewEnrollment);

module.exports = router;