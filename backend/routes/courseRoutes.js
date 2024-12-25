const express = require('express');
const {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const checkRole = require('../middleware/role');

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes (Instructor and Admin)
router.post('/',  checkRole(['admin', 'instructor']), addCourse);
router.put('/:id',checkRole(['admin', 'instructor']), updateCourse);
router.delete('/:id', checkRole(['admin']), deleteCourse);

module.exports = router;

