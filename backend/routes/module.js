const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const { protect } = require('../middleware/authMiddleware');
const checkRole  = require('../middleware/role');

// Add a new module (Instructor/Admin only)
router.post('/', protect, checkRole(['admin', 'instructor']), moduleController.addModule);

// Get all modules for a course (Public)
router.get('/:courseId', moduleController.getModulesByCourse);

// Update a module (Instructor/Admin only)
router.put('/:moduleId',protect, checkRole(['admin', 'instructor']) , moduleController.updateModule);

// Delete a module (Instructor/Admin only)
router.delete('/:moduleId', protect, checkRole(['admin', 'instructor']) , moduleController.deleteModule);

module.exports = router;
