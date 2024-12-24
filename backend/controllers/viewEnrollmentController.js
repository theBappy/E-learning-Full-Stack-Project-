const Course = require('../models/Course');

exports.viewEnrollment = async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate('studentsEnrolled', 'name email');
  
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied. Only the course instructor can view this information.' });
      }
  
      res.json({ students: course.studentsEnrolled });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};