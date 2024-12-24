const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { enrollInACourse, getAllEnrolledCourse } = require('../controllers/enrollmentController');
const { viewEnrollment }  = require('../controllers/viewEnrollmentController');

const router = express.Router();

router.post('/course/:id', protect, enrollInACourse);
router.get('/my-courses', protect, getAllEnrolledCourse);
router.get('/students/:id', protect, viewEnrollment);

module.exports = router;